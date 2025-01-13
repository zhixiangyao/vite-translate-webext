import { useUrlSearchParams } from '@vueuse/core'

type Collapsed = 'true' | 'false'

export function useCollapsed() {
  const params = useUrlSearchParams<{ collapsed: Collapsed }>('hash', { initialValue: { collapsed: 'false' } })
  const collapsed = computed({
    get() {
      return params.collapsed === 'true'
    },
    set(bool) {
      params.collapsed = bool ? 'true' : 'false'
    },
  })

  return collapsed
}
