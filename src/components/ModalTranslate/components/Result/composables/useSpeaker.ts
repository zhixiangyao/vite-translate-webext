import type { EnumSpeakerLang } from '~/constant/enum'

function genChunksOfText(text: string) {
  const maxLength = 190
  const speechChunks = []

  // Split the text into chunks of maximum length maxLength without breaking words
  while (text.length > 0) {
    if (text.length <= maxLength) {
      speechChunks.push(text)
      break
    }

    const chunk = text.substring(0, maxLength + 1)

    const lastSpaceIndex = chunk.lastIndexOf(' ')
    if (lastSpaceIndex !== -1) {
      speechChunks.push(text.substring(0, lastSpaceIndex))
      text = text.substring(lastSpaceIndex + 1)
    }
    else {
      // If there are no spaces in the chunk, split at the maxLength
      speechChunks.push(text.substring(0, maxLength))
      text = text.substring(maxLength)
    }
  }

  return speechChunks
}

const voices = ref<SpeechSynthesisVoice[]>([])
const controller = ref(new AbortController())

export function useSpeaker() {
  const loading = ref(false)

  async function stop() {
    loading.value = false
    controller.value.abort()
    window.speechSynthesis.cancel()
    await new Promise(r => setTimeout(r, 10))
    controller.value = new AbortController()
  }

  async function speaker(text: string, lang: EnumSpeakerLang) {
    try {
      await stop()

      // 如果当前实例重复点击, 则是退出播放
      if (loading.value) {
        return
      }

      loading.value = true

      const americanVoice = voices.value.find(voice => voice.lang === lang)
      const speechChunks = genChunksOfText(text)

      for (let i = 0; i < speechChunks.length; i++) {
        if (controller.value.signal.aborted)
          return

        await new Promise<void>((resolve) => {
          window.speechSynthesis.cancel()

          const ssu = new SpeechSynthesisUtterance(speechChunks[i])
          ssu.onend = () => resolve()
          ssu.onerror = () => resolve()
          ssu.voice = americanVoice ?? null

          window.speechSynthesis.speak(ssu)
        })
      }
    }
    finally {
      loading.value = false
    }
  }

  function handleGetVoices() {
    if (voices.value.length !== 0)
      return
    voices.value = window.speechSynthesis.getVoices()
  }

  onMounted(() => window.speechSynthesis.addEventListener('voiceschanged', handleGetVoices))

  onUnmounted(() => stop())

  return {
    loading: computed(() => loading.value),
    speaker,
    stop,
  }
}
