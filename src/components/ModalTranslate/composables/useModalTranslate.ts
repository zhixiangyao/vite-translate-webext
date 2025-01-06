import { useEventListener, useMouse } from '@vueuse/core'
import { EnumTranslateLang } from '~/constant/enum'
import { storageTranslateCacheMap, storageWordList } from '~/logic/storage'
import { type DeeplxResponse, useTranslate } from './useTranslate'

function isFiftyPercentLetters(str: string) {
  str = str.replaceAll(' ', '')

  let letterCount = 0

  for (let i = 0; i < str.length; i++) {
    if (/[a-z]/i.test(str[i])) {
      letterCount++
    }
  }

  return letterCount / str.length >= 0.5
}

interface State {
  top: number
  left: number
  text: string
  open: boolean
  pin: boolean
  loading: boolean
  result: DeeplxResponse | undefined
}

export function useModalTranslate(root?: HTMLElement) {
  const translate = useTranslate()

  const state = reactive<State>({
    top: 0,
    left: 0,
    text: '',
    open: false,
    pin: false,
    loading: false,
    result: void 0,
  })
  const mouse = useMouse()
  const wordList = computed(() => {
    return storageWordList.value.map(value => value.word.toLowerCase())
  })
  const favorite = computed(() => {
    return wordList.value.includes(state.text.toLowerCase())
  })

  function handleReset() {
    state.top = 0
    state.left = 0
    state.text = ''
    state.loading = false
    state.result = void 0
  }

  function handleShow(text: string, left: number, top: number) {
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
    if (storageTranslateCacheMap.value[text]) {
      state.result = storageTranslateCacheMap.value[text]
      return
    }

    const isEnglish = isFiftyPercentLetters(text)

    try {
      state.loading = true
      const data = await translate.run(
        text,
        isEnglish ? EnumTranslateLang.EN : EnumTranslateLang.ZH,
        isEnglish ? EnumTranslateLang.ZH : EnumTranslateLang.EN,
      )
      state.result = data
      data && (storageTranslateCacheMap.value[text] = data)
    }
    catch {
      state.result = void 0
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

      handleShow(target.textContent, mouse.x.value - window.scrollX + 16, mouse.y.value - window.scrollY + 8)
      return
    }

    !state.pin && handleHidden()
  }

  useEventListener(root ?? document, 'click', listener)
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
