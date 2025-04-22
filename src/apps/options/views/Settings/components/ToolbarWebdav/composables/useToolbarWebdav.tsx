import type { FileStat, WebDAVClient } from 'webdav'
import type { TRecordGroup, TRecordWebsite, TRecordWord, TSettings } from '~/storage'
import packageJson from '#/package.json'
import { useFileDialog } from '@vueuse/core'
import { App, Button } from 'ant-design-vue'
import dayjs from 'dayjs'
import { AuthType, createClient } from 'webdav'
import { useCustomModal } from '~/apps/options/composables/useCustomModal'
import { useLang } from '~/composables/useLang'
import { storageGroupList, storageSettings, storageWebsiteList, storageWordList } from '~/storage'
import { clone } from '~/utils/clone'
import { isObject } from '~/utils/is'
import { triggerFileDownload } from '~/utils/upload'

function encodeBackupData(time: string) {
  const jsonData: TChromeBackupData = clone({
    time,
    version: packageJson.version,
    data: {
      wordList: storageWordList.value,
      groupList: storageGroupList.value,
      websiteList: storageWebsiteList.value,
      settings: storageSettings.value,
    },
  })
  const jsonString = JSON.stringify(jsonData, null, 2)
  return jsonString
}

function decodeBackupData(content: ArrayBuffer): TChromeBackupData {
  const decoder = new TextDecoder('utf-8')
  const contentString = decoder.decode(content)

  try {
    const data = JSON.parse(contentString) as TChromeBackupData

    if (
      !isObject(data)
      || !data.time
      || !data.version
      || !isObject(data.data)
      || !Array.isArray(data.data.wordList)
      || !Array.isArray(data.data.groupList)
      || !Array.isArray(data.data.websiteList)
      || !Array.isArray(data.data.websiteList)
      || !isObject(data.data.settings)
      || !isObject(data.data.settings.api)
      || !isObject(data.data.settings.highlight)
      || !isObject(data.data.settings.theme)
      || !isObject(data.data.settings.webdav)
    ) {
      throw new Error('Oops! Import failed, This file cannot be imported!')
    }

    return data
  }
  catch {
    throw new Error('Oops! Import failed, This file cannot be imported!')
  }
}

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
  const fileDialog = useFileDialog({ accept: '.json' })

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

  function handleImportToStorage(content?: unknown) {
    if (content instanceof ArrayBuffer === false) {
      message.error(lang('Oops! Import failed!'))
      return
    }

    try {
      const data = decodeBackupData(content)

      storageWordList.value = data.data.wordList
      storageGroupList.value = data.data.groupList
      storageWebsiteList.value = data.data.websiteList
      storageSettings.value = {
        lang: data.data.settings.lang,
        api: {
          url: data.data.settings.api.url,
          token: data.data.settings.api.token,
          timeout: data.data.settings.api.timeout,
        },
        highlight: {
          style: data.data.settings.highlight.style,
        },
        theme: {
          color: data.data.settings.theme.color,
          layout: data.data.settings.theme.layout,
        },
        webdav: {
          url: data.data.settings.webdav.url,
          username: data.data.settings.webdav.username,
          password: data.data.settings.webdav.password,
          path: data.data.settings.webdav.path,
        },
      }

      message.success(lang('Imported successfully!'))
    }
    catch {}
  }

  async function handleLoadBackupItems() {
    const backupItems = await client.value!.getDirectoryContents(path.value!)

    if (Array.isArray(backupItems)) {
      folderList.value = backupItems
    }
  }

  async function handleExportYes(options: { time: string, fileName: string, cb: () => void }) {
    try {
      const jsonString = encodeBackupData(options.time)

      const isUploaded = await client.value!.putFileContents(path.value + options.fileName, jsonString, {
        overwrite: true,
        contentLength: false,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (isUploaded) {
        message.success(lang('Uploaded successfully!'))
        options.cb()
      }
      else {
        message.warning(lang('Upload not completed, please check server response!'))
      }
    }
    catch {
      message.error(lang('Oops!'))
    }
  }

  async function handleImportYes(options: { item: FileStat, cb: () => void }) {
    const content = await client.value!.getFileContents(options.item.filename)

    handleImportToStorage(content)

    options.cb()
  }

  async function handleDeleteYes(options: { item: FileStat, cb: () => void }) {
    await client.value!.deleteFile(options.item.filename)
    message.success(lang('Deleted successfully!'))
    handleLoadBackupItems()
    options.cb()
  }

  function handleDelete(options: { item: FileStat }) {
    const { close } = customModal.confirm({
      title: lang('Sure you want to Delete?'),
      content: options.item.basename,
      footer: (
        <div class="mt-3 flex justify-end gap-2">
          <Button onClick={() => close()}>{lang('Cancel')}</Button>

          <Button type="primary" onClick={() => handleDeleteYes({ item: options.item, cb: close })}>
            {lang('Yes')}
          </Button>
        </div>
      ),
    })
  }

  function handleImport(options: { item: FileStat }) {
    const { close } = customModal.confirm({
      title: lang('Sure you want to Import?'),
      content: options.item.basename,
      footer: (
        <div class="mt-3 flex justify-end gap-2">
          <Button onClick={() => close()}>{lang('Cancel')}</Button>

          <Button type="primary" onClick={() => handleImportYes({ item: options.item, cb: close })}>
            {lang('Yes')}
          </Button>
        </div>
      ),
    })
  }

  function handleImportFromLocal() {
    fileDialog.onChange(async (files) => {
      const file = files?.[0]
      const content = await file?.arrayBuffer()

      handleImportToStorage(content)
    })
    fileDialog.open()
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
        title: lang('Export to Webdav'),
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

            <Button type="primary" onClick={() => handleExportYes({ time, fileName, cb: close })}>
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

  async function handleExportToLocal() {
    const time = dayjs().toISOString()
    const fileName = `Translate-${time}.backup.json`

    const { close } = customModal.confirm({
      title: lang('Export to Local'),
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

          <Button
            type="primary"
            onClick={() => {
              const jsonString = encodeBackupData(time)
              const blob = new Blob([jsonString], { type: 'application/json' })
              const downloadUrl = URL.createObjectURL(blob)
              triggerFileDownload(downloadUrl, fileName)
              close()
            }}
          >
            {lang('Yes')}
          </Button>
        </div>
      ),
    })
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
    handleImportFromLocal,
    handleDelete,
    handleExport,
    handleExportToLocal,
    handleShowBackups,
  }
}
