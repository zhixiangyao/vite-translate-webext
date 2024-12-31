import { useDebounceFn, useEventListener, useMouse } from '@vueuse/core'

interface State {
  top: number
  left: number
  text: string
  open: boolean
}

export function useModalSearch(disabled: ComputedRef<boolean>) {
  const state = reactive<State>({
    top: 0,
    left: 0,
    text: '',
    open: false,
  })
  const mouse = useMouse()

  function handleShow(text: string, left: number, top: number) {
    state.open = true
    state.text = text
    state.left = left
    state.top = top
  }

  function handleHidden() {
    state.open = false
  }

  function listener(event: Event) {
    const target = event!.target as HTMLElement

    if (target.id.includes(__NAME__))
      return

    if (disabled.value)
      return

    const selection = window.getSelection()

    if (selection && selection.toString().trim().length > 0) {
      handleShow(selection.toString().trim(), mouse.x.value - window.scrollX + 16, mouse.y.value - window.scrollY + 8)
      return
    }

    handleHidden()
  }

  useEventListener(document, 'mouseup', useDebounceFn(listener, 50))
  useEventListener(document, 'keydown', e => e.key === 'Escape' && handleHidden())

  return {
    state,
    handleHidden,
  }
}
