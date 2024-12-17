import type { RecordType } from '~/components/BookList/type'
import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'

export const storageDemo = useWebExtensionStorage('webext-demo', 'Storage Demo')

export const storageWordList = useWebExtensionStorage<RecordType[]>('webext-word-list', [{ word: '' }])

export const storageActivityWebsiteMap = useWebExtensionStorage<Record<string, boolean>>(
  'webext-activity-website-map',
  {},
)
