import { useEventListener, useMouse } from '@vueuse/core'

export function useModalSearch() {
  const state = reactive({
    top: '',
    left: '',
    text: '',
    open: false,
  })
  const mouse = useMouse()

  function show(text: string, left: string, top: string) {
    state.open = true
    state.text = text
    state.left = left
    state.top = top
  }

  function hidden() {
    state.open = false
  }

  function listener(event: Event) {
    event.stopPropagation()
    event.preventDefault()
    const target = event!.target as HTMLElement

    if (target.id.includes(__NAME__))
      return

    const selection = window.getSelection()

    if (selection && selection.toString().trim().length > 0) {
      show(selection.toString(), `${mouse.x.value + 16}px`, `${mouse.y.value + 8}px`)
      return
    }

    hidden()
  }

  useEventListener(document, 'mouseup', listener)
  useEventListener(document, 'keydown', e => e.key === 'Escape' && hidden())

  return {
    state,
    hidden,
  }
}
