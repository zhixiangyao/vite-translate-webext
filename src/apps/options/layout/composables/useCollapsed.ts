import { refDebounced, useStorage, useWindowSize } from '@vueuse/core'

export function useCollapsed() {
  const collapsed = useStorage<boolean>('collapsed', false)
  const size = useWindowSize()
  const debouncedWidth = refDebounced(size.width, 500)

  watch(debouncedWidth, width => (collapsed.value = width <= 1024))

  return collapsed
}
