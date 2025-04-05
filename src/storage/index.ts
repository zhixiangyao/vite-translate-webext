import type { TCacheMap, TCurrentTab, TRecordGroup, TRecordWebsite, TRecordWord, TSettings } from './types'
import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

import { DEFAULT_GROUP_LIST, DEFAULT_SETTINGS, DEFAULT_WEBSITE_LIST, DEFAULT_WORD_LIST } from '~/constant/map'

export type * from './types'

const DO_NOT_LISTEN = { listenToStorageChanges: false }

/** Current Tab Information */
export const storageCurrentTab = useWebExtensionStorage<TCurrentTab>('webext-current-tab', { id: void 0 })

/** Group list */
export const storageGroupList = useWebExtensionStorage<TRecordGroup[]>('webext-group-list', DEFAULT_GROUP_LIST)

/** Word list */
export const storageWordList = useWebExtensionStorage<TRecordWord[]>('webext-word-list', DEFAULT_WORD_LIST)

/** Website list */
export const storageWebsiteList = useWebExtensionStorage<TRecordWebsite[]>('webext-website-list', DEFAULT_WEBSITE_LIST)

/** Search Results Cache */
export const storageCacheMap = useWebExtensionStorage<TCacheMap>('webext-cache-map', {}, DO_NOT_LISTEN)

/** Settings */
export const storageSettings = useWebExtensionStorage<TSettings>('webext-settings', DEFAULT_SETTINGS)
