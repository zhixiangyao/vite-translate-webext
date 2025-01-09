import type { TSetting } from '~/constant/map'
import type { TRecordWord } from '~/options/views/BookList/composables/useDrawerWordList'
import type { TRecordWebsite } from '~/options/views/WebsiteList/composables/useWebsiteList'
import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'
import { DEFAULT_SETTING } from '~/constant/map'

interface TCurrentTab {
  id?: number
}

interface TCacheMap {
  [name: string]: any
}

const DO_NOT_LISTEN = { listenToStorageChanges: false }

/** 当前 Tab 信息 */
export const storageCurrentTab = useWebExtensionStorage<TCurrentTab>('webext-current-tab', { id: void 0 })

/** 单词 list */
export const storageWordList = useWebExtensionStorage<TRecordWord[]>('webext-word-list', [{ word: 'demo', group: [] }])

/** 网站 list */
export const storageWebsiteList = useWebExtensionStorage<TRecordWebsite[]>('webext-website-list', [])

/** 搜索结果缓存 */
export const storageCacheMap = useWebExtensionStorage<TCacheMap>('webext-cache-map', {}, DO_NOT_LISTEN)

/** 设置 */
export const storageSetting = useWebExtensionStorage<TSetting>('webext-setting', DEFAULT_SETTING)
