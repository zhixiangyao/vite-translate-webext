import type { FileStat, WebDAVClient } from 'webdav'
import { App, Button } from 'ant-design-vue'
import { AuthType, createClient } from 'webdav'
import { useCustomModal } from '~/options/composables/useCustomModal'

interface TStateBackupList {
  open: boolean
  loading: boolean
  list: FileStat[]
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
  const client = ref<WebDAVClient>()
  const disabled = computed(() => !url.value || !username.value || !password.value || !path.value)
  const loadingShowBackups = ref(false)
  const stateBackupList = reactive<TStateBackupList>({
    open: false,
    loading: false,
    list: [],
  })

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

  /** Modal: Backup List */
  async function handleBackupList() {
    try {
      stateBackupList.loading = true
    }
    finally {
      stateBackupList.loading = false
    }
  }

  /** Export */
  function handleExport() {
    const { close } = customModal.confirm({
      title: 'Sure you want to Export All Data?',
      footer: (
        <div class="mt-3 flex justify-end gap-2">
          <Button onClick={() => close()}>Cancel</Button>

          <Button type="primary">Yes</Button>
        </div>
      ),
    })
  }

  /** Show Backups */
  async function handleShowBackups() {
    if (disabled.value)
      return

    loadingShowBackups.value = true

    try {
      const client = handleCreateClient()

      await client.exists(path.value!)

      const directoryItems = await client.getDirectoryContents(path.value!)

      if (Array.isArray(directoryItems)) {
        stateBackupList.open = true
        stateBackupList.list = directoryItems
      }
    }
    catch {
      message.error(`Oops! "${path.value}" does not exist`)
    }
    finally {
      loadingShowBackups.value = false
    }
  }

  onUnmounted(() => (client.value = void 0))

  return {
    loadingShowBackups,
    disabled,
    stateBackupList,

    handleBackupList,
    handleExport,
    handleShowBackups,
  }
}
