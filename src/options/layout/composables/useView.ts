import type { LocationQuery, RouteMeta, RouteParamsGeneric } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import { views } from '~/options/router'

interface View {
  fullPath: string
  meta: RouteMeta
  name: string
  params: RouteParamsGeneric
  path: string
  query: LocationQuery
  title: string
}

export function useView() {
  const list = ref<View[]>([])
  const activity = ref<View | null>(null)
  const route = useRoute()
  const router = useRouter()

  function handleTo(view: View) {
    activity.value = view
    router.push({ name: view.name })
  }

  function handleClose(view: View) {
    const index = list.value.findIndex(item => item.path === view.path)

    if (index !== -1) {
      list.value.splice(index, 1)

      if (view.path === activity.value?.path) {
        activity.value = list.value[index === list.value.length ? index - 1 : index]

        router.push({ name: activity.value.name })
      }
    }
  }

  watch(
    route,
    (to) => {
      const view = views.find(view => view.name === to.name)

      if (view) {
        const data = {
          fullPath: to.fullPath,
          meta: to.meta,
          name: to.name!.toString(),
          params: to.params,
          path: to.path,
          query: to.query,
          title: view.title,
        }
        activity.value = data
        list.value.findIndex(item => item.path === data.path) === -1 && list.value.push(data)
      }
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
