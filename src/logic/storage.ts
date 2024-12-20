import type { RecordType } from '~/components/BookList/type'
import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

export const storageCurrentTab = useWebExtensionStorage<{ id?: number }>('webext-current-tab', { id: void 0 })

export const storageWordList = useWebExtensionStorage<RecordType[]>('webext-word-list', [{ word: '' }])

export const storageActivityWebsiteMap = useWebExtensionStorage<Record<string, boolean>>(
  'webext-activity-website-map',
  {},
)
