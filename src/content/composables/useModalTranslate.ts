import { useEventListener } from '@vueuse/core'

export function useModalTranslate() {
  const state = reactive({
    top: '',
    left: '',
    text: '',
    open: false,
  })

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

    if (window.getSelection()?.toString())
      return

    if (target.tagName === 'SPAN' && target.dataset.highlightedWord && target.textContent) {
      const rect = target.getBoundingClientRect()
      show(target.textContent, `${rect.x + window.scrollX}px`, `${rect.y + rect.height + window.scrollY + 8}px`)
      return
    }

    hidden()
  }

  useEventListener(document, 'click', listener)
  useEventListener(document, 'keydown', e => e.key === 'Escape' && hidden())

  return {
    state,
    show,
  }
}
