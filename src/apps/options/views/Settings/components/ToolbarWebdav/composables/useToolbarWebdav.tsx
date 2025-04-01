import type { FileStat, WebDAVClient } from 'webdav'
import type { TRecordGroup, TRecordWebsite, TRecordWord, TSettings } from '~/logic/storage'
import packageJson from '#/package.json'
import { App, Button } from 'ant-design-vue'
import dayjs from 'dayjs'
import { AuthType, createClient } from 'webdav'
import { useCustomModal } from '~/apps/options/composables/useCustomModal'
import { storageGroupList, storageSettings, storageWebsiteList, storageWordList } from '~/logic/storage'
import { clone } from '~/utils/clone'

interface TChromeBackupData {
  time: string
  version: string
  data: {
    wordList: TRecordWord[]
    groupList: TRecordGroup[]
    websiteList: TRecordWebsite[]
    settings: TSettings
  }
}

interface Params {
  url: ComputedRef<string | undefined>
  username: ComputedRef<string | undefined>
  password: ComputedRef<string | undefined>
  path: ComputedRef<string | undefined>
}

export function useToolbarWebdav(params: Params) {
  const { url, username, password, path } = params

  const { message } = App.useApp()
  const customModal = useCustomModal()
  const client = shallowRef<WebDAVClient>()
  const folderList = shallowRef<FileStat[]>([])
  const loading = ref(false)
  const open = ref(false)
  const disabled = computed(() => !url.value || !username.value || !password.value || !path.value)

  function handleCreateClient() {
    client.value = createClient(url.value!, {
      authType: AuthType.Password,
      username: username.value!,
      password: password.value!,
    })
  }

  async function handleLoadBackupItems() {
    const backupItems = await client.value!.getDirectoryContents(path.value!)

    if (Array.isArray(backupItems)) {
      folderList.value = backupItems
    }
  }

  async function handleExportYes(options: { time: string, fileName: string, close: () => void }) {
    const jsonData: TChromeBackupData = clone({
      time: options.time,
      version: packageJson.version,
      data: {
        wordList: storageWordList.value,
        groupList: storageGroupList.value,
        websiteList: storageWebsiteList.value,
        settings: storageSettings.value,
      },
    })
    const jsonString = JSON.stringify(jsonData, null, 2)

    try {
      const isUploaded = await client.value!.putFileContents(path.value + options.fileName, jsonString, {
        overwrite: true,
        contentLength: false,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (isUploaded) {
        message.success('Uploaded successfully!')
        options.close()
      }
      else {
        message.warning('Upload not completed, please check server response!')
      }
    }
    catch {
      message.error(`Oops!`)
    }
  }

  async function handleImportYes(options: { item: FileStat, close: () => void }) {
    const content = await client.value!.getFileContents(options.item.filename)
    if (content instanceof ArrayBuffer) {
      // 使用 TextDecoder 解码 ArrayBuffer
      const decoder = new TextDecoder('utf-8')
      const contentString = decoder.decode(content)

      try {
        const data = JSON.parse(contentString) as Partial<TChromeBackupData>

        if (!data?.time || !data?.version || !data?.data) {
          message.error('Oops! Import failed, This file cannot be imported!')
          return
        }

        storageWordList.value = data.data.wordList ?? []
        storageGroupList.value = data.data.groupList ?? []
        storageWebsiteList.value = data.data.websiteList ?? []
        storageSettings.value = data.data.settings ?? {}

        message.success('Imported successfully!')
      }
      catch {
        message.error('Oops!, This file cannot be imported!')
      }
    }
    else {
      message.error('Oops! Import failed!')
      return
    }
    options.close()
  }

  async function handleDeleteYes(options: { item: FileStat, close: () => void }) {
    await client.value!.deleteFile(options.item.filename)
    message.success('Deleted successfully!')
    handleLoadBackupItems()
    options.close()
  }

  function handleImport(item: FileStat) {
    const { close } = customModal.confirm({
      title: (
        <div>
          Sure you want to&nbsp;
          <b class="text-green">Import</b>
          ?
        </div>
      ),
      content: item.basename,
      footer: (
        <div class="mt-3 flex justify-end gap-2">
          <Button onClick={() => close()}>Cancel</Button>

          <Button type="primary" onClick={() => handleImportYes({ item, close })}>
            Yes
          </Button>
        </div>
      ),
    })
  }

  function handleDelete(item: FileStat) {
    const { close } = customModal.confirm({
      title: (
        <div>
          Sure you want to&nbsp;
          <b class="text-red">Delete</b>
          ?
        </div>
      ),
      content: item.basename,
      footer: (
        <div class="mt-3 flex justify-end gap-2">
          <Button onClick={() => close()}>Cancel</Button>

          <Button type="primary" onClick={() => handleDeleteYes({ item, close })}>
            Yes
          </Button>
        </div>
      ),
    })
  }

  async function handleExport() {
    if (disabled.value)
      return

    try {
      const isExists = await client.value!.exists(path.value!)

      if (!isExists) {
        message.error(`Oops! "${path.value}" does not exist!`)
        return
      }

      const time = dayjs().toISOString()
      const fileName = `Translate-${time}.backup.json`

      const { close } = customModal.confirm({
        title: <div>Export</div>,
        width: 550,
        content: (
          <div class="flex items-center gap-1">
            <div>File Name:</div>
            <div>{fileName}</div>
          </div>
        ),
        footer: (
          <div class="mt-3 flex justify-end gap-2">
            <Button onClick={() => close()}>Cancel</Button>

            <Button type="primary" onClick={() => handleExportYes({ time, fileName, close })}>
              Yes
            </Button>
          </div>
        ),
      })
    }
    catch {
      message.error('Oops!')
    }
  }

  async function handleShowBackups() {
    if (disabled.value)
      return

    loading.value = true

    try {
      const isExists = await client.value!.exists(path.value!)

      if (!isExists) {
        message.error(`Oops! "${path.value}" does not exist!`)
        return
      }

      await handleLoadBackupItems()

      open.value = true
    }
    catch {
      message.error('Oops!')
    }
    finally {
      loading.value = false
    }
  }

  onMounted(handleCreateClient)
  onUnmounted(() => (client.value = void 0))

  return {
    open,
    folderList,
    loading,
    disabled,

    handleImport,
    handleDelete,
    handleExport,
    handleShowBackups,
  }
}
