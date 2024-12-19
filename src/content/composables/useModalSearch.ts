import { useEventListener, useMouse } from '@vueuse/core'

interface State {
  top: string
  left: string
  text: string
  open: boolean
}

export function useModalSearch(disabled: ComputedRef<boolean>) {
  const state = reactive<State>({
    top: '',
    left: '',
    text: '',
    open: false,
  })
  const mouse = useMouse()

  function handleShow(text: string, left: string, top: string) {
    state.open = true
    state.text = text
    state.left = left
    state.top = top
  }

  function handleHidden() {
    state.open = false
  }

  function listener(event: Event) {
    event.stopPropagation()
    event.preventDefault()
    const target = event!.target as HTMLElement

    if (target.id.includes(__NAME__))
      return

    if (disabled.value)
      return

    const selection = window.getSelection()

    if (selection && selection.toString().trim().length > 0) {
      handleShow(selection.toString().trim(), `${mouse.x.value + 16}px`, `${mouse.y.value + 8}px`)
      return
    }

    handleHidden()
  }

  useEventListener(document, 'mouseup', listener)
  useEventListener(document, 'keydown', e => e.key === 'Escape' && handleHidden())

  return {
    state,
    handleHidden,
  }
}
