import type { RecordType } from '~/options/views/BookList/composables/useBookList'
import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'
import { DEFAULT_SETTING } from '~/constant/settings'

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

/** 设置 */
export const storageSetting = useWebExtensionStorage('webext-setting', {
  api: {
    url: DEFAULT_SETTING.api.url,
    token: DEFAULT_SETTING.api.token,
    timeout: DEFAULT_SETTING.api.timeout,
  },
  highlight: {
    style: DEFAULT_SETTING.highlight.style,
  },
})
