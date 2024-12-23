import type { RecordType } from '~/options/components/TabBookList/type'
import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

export const storageCurrentTab = useWebExtensionStorage<{ id?: number }>('webext-current-tab', { id: void 0 })

export const storageWordList = useWebExtensionStorage<RecordType[]>('webext-word-list', [{ word: 'demo' }])

export const storageActivityWebsiteMap = useWebExtensionStorage<Record<string, boolean>>(
  'webext-activity-website-map',
  {},
)

export const storageTranslateCacheMap = useWebExtensionStorage<Record<string, any>>(
  'webext-cache-map',
  {},
  { listenToStorageChanges: false },
)

export const storageSettingApi = useWebExtensionStorage('webext-setting-api', {
  url: 'http://home.yaozhixiang.top:1188/translate',
  token: 'deeplx_yzx',
})
