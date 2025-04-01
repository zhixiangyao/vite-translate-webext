import type { TView } from './useView'

interface State {
  open: boolean
  view: TView | null
  x: number
  y: number
}

export function useContextMenu() {
  const state = reactive<State>({
    open: false,
    view: null,
    x: 0,
    y: 0,
  })
  const itemsRef = ref<HTMLLIElement[]>()

  function handleContextMenu(event: MouseEvent, view: TView, index: number) {
    event.preventDefault()
    event.stopPropagation()
    const elementLi = itemsRef.value?.[index]
    if (elementLi) {
      const elementLiRect = elementLi.getClientRects()[0]
      state.open = true
      state.view = view
      state.x = elementLiRect.left
      state.y = elementLiRect.top + elementLiRect.height + 4
    }
  }

  return {
    state,
    itemsRef,
    handleContextMenu,
  }
}
