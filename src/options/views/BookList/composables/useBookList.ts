import type { ListGridType } from 'ant-design-vue/es/list'
import type { TRecordGroup } from '~/logic/storage'

export const listGrid: ListGridType = {
  xs: 1,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
  xxl: 5,
}

export function useBookList() {
  const groups = computed<TRecordGroup[]>(() => {
    return []
  })

  return { groups }
}
