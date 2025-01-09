import type { TRecordWebsite } from '~/options/views/AllowList/composables/useAllowList'
import type { TRecordWord } from '~/options/views/BookList/composables/useBookList'
import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'
import { DEFAULT_SETTING } from '~/constant/map'

/** 当前 Tab 信息 */
export const storageCurrentTab = useWebExtensionStorage<{ id?: number }>('webext-current-tab', { id: void 0 })

/** 单词 list */
export const storageWordList = useWebExtensionStorage<TRecordWord[]>('webext-word-list', [{ word: 'demo' }])

/** 网站 list */
export const storageWebsiteList = useWebExtensionStorage<TRecordWebsite[]>('webext-website-list', [])

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
