import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'
import { DEFAULT_SETTING } from '~/constant/map'

interface TCurrentTab {
  id?: number
}

export interface TRecordWord {
  word: string
  group: string | null
}

export interface TRecordGroup {
  name: string
  list: TRecordWord[]
}

export interface TRecordWebsite {
  url: string
  enable: boolean
}

interface TCacheMap {
  [name: string]: any
}

export interface TSetting {
  api: {
    url: string
    token: string
    timeout: number
  }
  highlight: {
    style: string
  }
}

const DO_NOT_LISTEN = { listenToStorageChanges: false }

/** 当前 Tab 信息 */
export const storageCurrentTab = useWebExtensionStorage<TCurrentTab>('webext-current-tab', { id: void 0 })

/** 单词 list */
export const storageWordList = useWebExtensionStorage<TRecordWord[]>('webext-word-list', [{ word: 'demo', group: null }])

/** 组 list */
export const storageGroupList = useWebExtensionStorage<TRecordGroup[]>('webext-word-list', [])

/** 网站 list */
export const storageWebsiteList = useWebExtensionStorage<TRecordWebsite[]>('webext-website-list', [])

/** 搜索结果缓存 */
export const storageCacheMap = useWebExtensionStorage<TCacheMap>('webext-cache-map', {}, DO_NOT_LISTEN)

/** 设置 */
export const storageSetting = useWebExtensionStorage<TSetting>('webext-setting', DEFAULT_SETTING)
