import type { FileStat, WebDAVClient } from 'webdav'
import { App } from 'ant-design-vue'
import { AuthType, createClient } from 'webdav'

export const folderName = '/Translate'

interface TStateCreateFolder {
  open: boolean
  loading: boolean
}

interface TStateBackupList {
  open: boolean
  loading: boolean
  list: FileStat[]
}

interface Params {
  url: ComputedRef<string | undefined>
  username: ComputedRef<string | undefined>
  password: ComputedRef<string | undefined>
}

export function useToolbarWebdav(params: Params) {
  const { url, username, password } = params

  const { message } = App.useApp()
  const client = ref<WebDAVClient>()
  const stateCreateFolder = reactive<TStateCreateFolder>({
    open: false,
    loading: false,
  })
  const stateBackupList = reactive<TStateBackupList>({
    open: false,
    loading: false,
    list: [],
  })
  const disabled = computed(() => !url.value || !username.value || !password.value)

  /** Create Client */
  function handleCreateClient() {
    if (!client.value) {
      client.value = createClient(url.value!, {
        authType: AuthType.Password,
        username: username.value!,
        password: password.value!,
      })
    }

    return client.value!
  }

  /** Modal: Create Missing Folder */
  async function handleCreateFolder() {
    try {
      stateCreateFolder.loading = true

      // await client.value?.createDirectory(folderName) // TODO
      const directoryItems = await client.value?.getDirectoryContents('/') // TODO
      stateCreateFolder.open = false
      stateBackupList.open = true

      if (Array.isArray(directoryItems)) {
        stateBackupList.list = directoryItems
      }
    }
    catch {
      message.error('Oops! Create folder is fail')
    }
    finally {
      stateCreateFolder.loading = false
    }
  }

  /** Modal: Backup List */
  async function handleBackupList() {
    try {
      stateBackupList.loading = true
      // TODO
    }
    finally {
      stateBackupList.loading = false
    }
  }

  /** Export */
  function handleExport() {
    // TODO
  }

  /** Show Backups */
  async function handleShowBackups() {
    if (disabled.value)
      return

    const client = handleCreateClient()

    const existsFolder = await client.exists(folderName)

    if (!existsFolder) {
      stateCreateFolder.open = true
    }
  }

  onUnmounted(() => (client.value = void 0))

  return {
    stateCreateFolder,
    stateBackupList,
    disabled,

    handleCreateFolder,
    handleBackupList,
    handleExport,
    handleShowBackups,
  }
}
