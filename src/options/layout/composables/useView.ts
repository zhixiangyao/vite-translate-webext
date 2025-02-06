import type { LocationQuery, RouteMeta, RouteParamsGeneric } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'

export interface TView {
  fullPath: string
  meta: RouteMeta
  name: string
  params: RouteParamsGeneric
  path: string
  query: LocationQuery
}

export function useView() {
  const list = useStorage<TView[]>('view-list', [])
  const activity = ref<TView | null>(null)
  const route = useRoute()
  const router = useRouter()

  function handleTo(view: TView) {
    activity.value = view
    router.push({ name: view.name })
  }

  function handleClose(view: TView) {
    const index = list.value.findIndex(item => item.path === view.path)

    if (index !== -1) {
      list.value.splice(index, 1)

      if (view.path === activity.value?.path) {
        const position = index === list.value.length ? index - 1 : index

        const data = list.value[position]
        activity.value = data
        router.push({ name: data.name })
      }
    }
  }

  watch(
    route,
    (to) => {
      const data = {
        fullPath: to.fullPath,
        meta: to.meta,
        name: to.name!.toString(),
        params: to.params,
        path: to.path,
        query: to.query,
      }
      activity.value = data
      list.value.findIndex(item => item.path === data.path) === -1 && list.value.push(data)
    },
    {
      immediate: true,
    },
  )

  return {
    list,
    activity,

    handleTo,
    handleClose,
  }
}
