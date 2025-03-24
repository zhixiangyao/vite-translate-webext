import { useWebExtensionStorage as useWebExtStorage } from '~/composables/useWebExtensionStorage'
import { DEFAULT_SETTINGS } from '~/constant/map'

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

export interface TSettings {
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

/** Current Tab Information */
export const storageCurrentTab = useWebExtStorage<TCurrentTab>('webext-current-tab', { id: void 0 })

/** Word list */
export const storageWordList = useWebExtStorage<TRecordWord[]>('webext-word-list', [])

/** Group list */
export const storageGroupList = useWebExtStorage<TRecordGroup[]>('webext-group-list', [])

/** Website list */
export const storageWebsiteList = useWebExtStorage<TRecordWebsite[]>('webext-website-list', [])

/** Search Results Cache */
export const storageCacheMap = useWebExtStorage<TCacheMap>('webext-cache-map', {}, DO_NOT_LISTEN)

/** Settings */
export const storageSettings = useWebExtStorage<TSettings>('webext-settings', DEFAULT_SETTINGS)
