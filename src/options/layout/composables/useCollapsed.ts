import { refDebounced, useUrlSearchParams, useWindowSize } from '@vueuse/core'

type Collapsed = 'true' | 'false'

export function useCollapsed() {
  const params = useUrlSearchParams<{ collapsed: Collapsed }>('hash', { initialValue: { collapsed: 'false' } })
  const size = useWindowSize()
  const debouncedWidth = refDebounced(size.width, 500)
  const collapsed = computed({
    get() {
      return params.collapsed === 'true'
    },
    set(bool) {
      params.collapsed = bool ? 'true' : 'false'
    },
  })

  watch(debouncedWidth, width => (collapsed.value = width <= 1024))

  return collapsed
}
