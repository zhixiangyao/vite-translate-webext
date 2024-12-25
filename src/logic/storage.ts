import type { RecordType } from '~/options/views/BookList/type'
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

export const defaultStorageSetting = {
  api: {
    url: 'http://home.yaozhixiang.top:1188/translate',
    token: 'deeplx_yzx',
    timeout: 10_000,
  },
  highlight: {
    style: 'span[data-highlighted-word] { color: #e61a1a; cursor: pointer; background-color: #e6e683; }',
  },
}

export const storageSetting = useWebExtensionStorage('webext-setting', {
  api: {
    url: defaultStorageSetting.api.url,
    token: defaultStorageSetting.api.token,
    timeout: defaultStorageSetting.api.timeout,
  },
  highlight: {
    style: defaultStorageSetting.highlight.style,
  },
})
