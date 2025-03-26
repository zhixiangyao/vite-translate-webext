import type { DeeplxResponse } from './useTranslate'
import type { EnumResponseCode } from '~/constant/enum'
import { useEventListener, useMouse } from '@vueuse/core'
import { uniqBy } from 'es-toolkit'
import { EnumTranslateLang } from '~/constant/enum'
import { regexIsWord } from '~/constant/regex'
import { clone } from '~/logic/clone'
import { isFiftyPercentLetters } from '~/logic/is'
import { storageCacheMap, storageWordList } from '~/logic/storage'
import { useTranslate } from './useTranslate'

interface State {
  top: number
  left: number
  text: string
  open: boolean
  pin: boolean
  loading: boolean
  result: DeeplxResponse | undefined
  error: EnumResponseCode | undefined
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
    error: void 0,
  })
  const mouse = useMouse({ touch: false })
  const wordList = computed(() => {
    return storageWordList.value.map(value => value.word.toLowerCase())
  })
  const favorite = computed(() => {
    return wordList.value.includes(state.text.toLowerCase())
  })
  const isWord = computed<boolean>(() => {
    return regexIsWord.test(state.text)
  })

  function handleReset() {
    state.top = 0
    state.left = 0
    state.text = ''
    state.loading = false
    state.result = void 0
    state.error = void 0
  }

  function handleShow(text: string, left: number, top: number) {
    state.open = true
    state.text = text
    state.left = left
    state.top = top

    handleSearch()
  }

  function handleHidden() {
    state.open = false
    handleReset()
  }

  async function handleSearch() {
    state.error = void 0

    if (storageCacheMap.value[state.text]) {
      state.result = storageCacheMap.value[state.text]
      return
    }

    const isEnglish = isFiftyPercentLetters(state.text)

    try {
      state.loading = true
      const data = await translate.run(
        state.text,
        isEnglish ? EnumTranslateLang.EN : EnumTranslateLang.ZH,
        isEnglish ? EnumTranslateLang.ZH : EnumTranslateLang.EN,
      )
      state.result = data
      data && (storageCacheMap.value[state.text] = data)
    }
    catch (error) {
      state.result = void 0
      state.error = error as EnumResponseCode
    }
    finally {
      state.loading = false
    }
  }

  function handleAdd() {
    const word = state.text.toLowerCase()
    const wordList = [...clone(storageWordList.value), { word, groupUUID: void 0 }]

    storageWordList.value = uniqBy(wordList, item => item.word)
  }

  function handleRemove() {
    const word = state.text.toLowerCase()

    const wordList = uniqBy(
      clone(storageWordList.value).filter(item => item.word !== word),
      item => item.word,
    )
    storageWordList.value = wordList
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
    isWord,

    handleShow,
    handleHidden,
    handleSearch,
    handleAdd,
    handleRemove,
  }
}
