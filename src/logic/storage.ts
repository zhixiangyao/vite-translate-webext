import { useWebExtensionStorage as useWebExtStorage } from '~/composables/useWebExtensionStorage'
import { DEFAULT_GROUP_LIST, DEFAULT_SETTINGS, DEFAULT_WEBSITE_LIST, DEFAULT_WORD_LIST } from '~/constant/map'

interface TCurrentTab {
  id?: number
}

export interface TRecordGroup {
  name: string
  uuid: string
  list: TRecordWord[]
}

export interface TRecordWord {
  word: string
  groupUUID: string | undefined
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
  webdav: {
    url: string | undefined
    username: string | undefined
    password: string | undefined
    path: string | undefined
  }
}

const DO_NOT_LISTEN = { listenToStorageChanges: false }

/** Current Tab Information */
export const storageCurrentTab = useWebExtStorage<TCurrentTab>('webext-current-tab', { id: void 0 })

/** Group list */
export const storageGroupList = useWebExtStorage<TRecordGroup[]>('webext-group-list', DEFAULT_GROUP_LIST)

/** Word list */
export const storageWordList = useWebExtStorage<TRecordWord[]>('webext-word-list', DEFAULT_WORD_LIST)

/** Website list */
export const storageWebsiteList = useWebExtStorage<TRecordWebsite[]>('webext-website-list', DEFAULT_WEBSITE_LIST)

/** Search Results Cache */
export const storageCacheMap = useWebExtStorage<TCacheMap>('webext-cache-map', {}, DO_NOT_LISTEN)

/** Settings */
export const storageSettings = useWebExtStorage<TSettings>('webext-settings', DEFAULT_SETTINGS)
