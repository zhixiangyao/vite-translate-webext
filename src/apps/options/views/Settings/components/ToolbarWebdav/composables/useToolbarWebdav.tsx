import type { FileStat, WebDAVClient } from 'webdav'
import type { TRecordGroup, TRecordWebsite, TRecordWord, TSettings } from '~/storage'
import packageJson from '#/package.json'
import { App, Button } from 'ant-design-vue'
import dayjs from 'dayjs'
import { AuthType, createClient } from 'webdav'
import { useCustomModal } from '~/apps/options/composables/useCustomModal'
import { useLang } from '~/composables/useLang'
import { storageGroupList, storageSettings, storageWebsiteList, storageWordList } from '~/storage'
import { clone } from '~/utils/clone'
import { triggerFileDownload } from '~/utils/upload'

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
  const lang = useLang()
  const customModal = useCustomModal()
  const client = shallowRef<WebDAVClient>()
  const folderList = shallowRef<FileStat[]>([])
  const loading = ref(false)
  const open = ref(false)
  const disabled = computed(() => !url.value || !username.value || !password.value || !path.value)

  function handleWatchCreateClient(data: [string | undefined, string | undefined, string | undefined]) {
    const [url, username, password] = data
    if (url && username && password) {
      client.value = createClient(url, {
        authType: AuthType.Password,
        username,
        password,
      })
    }
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

    if (disabled.value) {
      const blob = new Blob([jsonString], { type: 'application/json' })
      const downloadUrl = URL.createObjectURL(blob)
      triggerFileDownload(downloadUrl, options.fileName)
      message.success(lang('Exported successfully!'))
      options.close()
      return
    }

    try {
      const isUploaded = await client.value!.putFileContents(path.value + options.fileName, jsonString, {
        overwrite: true,
        contentLength: false,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (isUploaded) {
        message.success(lang('Uploaded successfully!'))
        options.close()
      }
      else {
        message.warning(lang('Upload not completed, please check server response!'))
      }
    }
    catch {
      message.error(lang('Oops!'))
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
          message.error(lang('Oops! Import failed, This file cannot be imported!'))
          return
        }

        storageWordList.value = data.data.wordList ?? []
        storageGroupList.value = data.data.groupList ?? []
        storageWebsiteList.value = data.data.websiteList ?? []
        storageSettings.value = data.data.settings ?? {}

        message.success(lang('Imported successfully!'))
      }
      catch {
        message.error(lang('Oops!, This file cannot be imported!'))
      }
    }
    else {
      message.error(lang('Oops! Import failed!'))
      return
    }
    options.close()
  }

  async function handleDeleteYes(options: { item: FileStat, close: () => void }) {
    await client.value!.deleteFile(options.item.filename)
    message.success(lang('Deleted successfully!'))
    handleLoadBackupItems()
    options.close()
  }

  function handleImport(item: FileStat) {
    const { close } = customModal.confirm({
      title: <div>{lang('Sure you want to Import?')}</div>,
      content: item.basename,
      footer: (
        <div class="mt-3 flex justify-end gap-2">
          <Button onClick={() => close()}>{lang('Cancel')}</Button>

          <Button type="primary" onClick={() => handleImportYes({ item, close })}>
            {lang('Yes')}
          </Button>
        </div>
      ),
    })
  }

  function handleDelete(item: FileStat) {
    const { close } = customModal.confirm({
      title: <div>{lang('Sure you want to Delete?')}</div>,
      content: item.basename,
      footer: (
        <div class="mt-3 flex justify-end gap-2">
          <Button onClick={() => close()}>{lang('Cancel')}</Button>

          <Button type="primary" onClick={() => handleDeleteYes({ item, close })}>
            {lang('Yes')}
          </Button>
        </div>
      ),
    })
  }

  async function handleExport() {
    try {
      if (!disabled.value) {
        const isExists = await client.value!.exists(path.value!)

        if (!isExists) {
          message.error(`Oops! "${path.value}" does not exist!`)
          return
        }
      }

      const time = dayjs().toISOString()
      const fileName = `Translate-${time}.backup.json`

      const { close } = customModal.confirm({
        title: disabled.value ? lang('Export to Local') : lang('Export to Webdav'),
        width: 550,
        content: (
          <div class="flex items-center gap-1">
            <div>
              {lang('File Name')}
              :
            </div>
            <div>{fileName}</div>
          </div>
        ),
        footer: (
          <div class="mt-3 flex justify-end gap-2">
            <Button onClick={() => close()}>{lang('Cancel')}</Button>

            <Button type="primary" onClick={() => handleExportYes({ time, fileName, close })}>
              {lang('Yes')}
            </Button>
          </div>
        ),
      })
    }
    catch {
      message.error(lang('Oops!'))
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
      message.error(lang('Oops!'))
    }
    finally {
      loading.value = false
    }
  }

  watch([url, username, password], handleWatchCreateClient, { immediate: true })
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
