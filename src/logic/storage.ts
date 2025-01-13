import { useWebExtensionStorage as useWebExtStorage } from '~/composables/useWebExtensionStorage'
import { DEFAULT_SETTING } from '~/constant/map'

interface TCurrentTab {
  id?: number
}

export interface TRecordWord {
  word: string
  groupUUID: string | undefined
}

export interface TRecordGroup {
  name: string
  uuid: string
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
  theme: {
    color: string
  }
}

const DO_NOT_LISTEN = { listenToStorageChanges: false }

/** 当前 Tab 信息 */
export const storageCurrentTab = useWebExtStorage<TCurrentTab>('webext-current-tab', { id: void 0 })

/** 单词 list */
export const storageWordList = useWebExtStorage<TRecordWord[]>('webext-word-list', [])

/** 组 list */
export const storageGroupList = useWebExtStorage<TRecordGroup[]>('webext-group-list', [])

/** 网站 list */
export const storageWebsiteList = useWebExtStorage<TRecordWebsite[]>('webext-website-list', [])

/** 搜索结果缓存 */
export const storageCacheMap = useWebExtStorage<TCacheMap>('webext-cache-map', {}, DO_NOT_LISTEN)

/** 设置 */
export const storageSetting = useWebExtStorage<TSetting>('webext-setting', DEFAULT_SETTING)
