import { useEventListener } from '@vueuse/core'
import { storageWordList } from '~/logic'
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
  const wordList = computed(() => {
    return storageWordList.value.map(value => value.word.toLowerCase())
  })
  const favorite = computed(() => {
    return wordList.value.includes(state.text.toLowerCase())
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

  function handleAdd(text: string) {
    storageWordList.value?.splice(storageWordList.value.length, 0, {
      word: text.toLowerCase(),
    })
  }

  function handleRemove(text: string) {
    const i = storageWordList.value
      .map(value => value.word.toLowerCase())
      .findIndex(word => word === text.toLowerCase())
    storageWordList.value?.splice(i, 1)
  }

  function listener(event: Event) {
    const target = event!.target as HTMLElement

    if (target.id.includes(__NAME__))
      return

    if (window.getSelection()?.toString())
      return

    if (target.tagName === 'SPAN' && target.dataset.highlightedWord && target.textContent) {
      event.stopPropagation()
      event.preventDefault()

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
    favorite,
    handleShow,
    handleHidden,
    handleSearch,
    handleAdd,
    handleRemove,
  }
}
