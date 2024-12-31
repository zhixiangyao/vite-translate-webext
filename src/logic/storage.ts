import type { RecordType } from '~/options/views/BookList/composables/useBookList'
import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

/** 当前 Tab 信息 */
export const storageCurrentTab = useWebExtensionStorage<{ id?: number }>('webext-current-tab', { id: void 0 })

/** 单词本 */
export const storageWordList = useWebExtensionStorage<RecordType[]>('webext-word-list', [{ word: 'demo' }])

/** 启用的网站 */
export const storageActivityWebsiteMap = useWebExtensionStorage<Record<string, boolean>>(
  'webext-activity-website-map',
  {},
)

/** 搜索结果缓存 */
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

/** 设置 */
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
