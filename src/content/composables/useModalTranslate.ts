import { useEventListener } from '@vueuse/core'
import { type Data, useTranslate } from './useTranslate'

interface State {
  top: string
  left: string
  text: string
  open: boolean
  pin: boolean
  loading: boolean
  result: Data | undefined
}

export function useModalTranslate() {
  const translate = useTranslate()

  const state = reactive<State>({
    top: '',
    left: '',
    text: '',
    open: false,
    pin: false,
    loading: false,
    result: void 0,
  })

  function handleReset() {
    state.top = ''
    state.left = ''
    state.text = ''
    state.loading = false
    state.result = void 0
  }

  function handleShow(text: string, left: string, top: string) {
    state.open = true
    state.text = text
    state.left = left
    state.top = top

    handleSearch(text)
  }

  function handleHidden() {
    state.open = false
    handleReset()
  }

  async function handleSearch(text: string) {
    try {
      state.loading = true
      const data = await translate.run(text, 'EN', 'ZH')
      state.result = data
    }
    finally {
      state.loading = false
    }
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
      handleShow(target.textContent, `${rect.x + window.scrollX}px`, `${rect.y + rect.height + window.scrollY + 8}px`)
      return
    }

    !state.pin && handleHidden()
  }

  useEventListener(document, 'click', listener)
  useEventListener(document, 'keydown', e => e.key === 'Escape' && handleHidden())

  return {
    state,
    handleShow,
    handleHidden,
    handleSearch,
  }
}
