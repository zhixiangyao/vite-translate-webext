import type { UseSpeechSynthesisReturn } from '@vueuse/core'
import type { EnumSpeakerLang } from '~/constant/enum'
import { useSpeechSynthesis } from '@vueuse/core'

const speechList: UseSpeechSynthesisReturn[] = []

export function useSpeaker(params: { text: ComputedRef<string>, lang: EnumSpeakerLang }) {
  const loading = ref(false)
  const speech = useSpeechSynthesis(params.text, {
    lang: params.lang,
  })

  function play() {
    if (loading.value)
      return

    loading.value = true
    // stop all
    speechList.forEach((speech) => {
      speech.stop()
    })

    speech.speak()
  }

  watch(speech.isPlaying, (isPlaying) => {
    if (isPlaying) {
      loading.value = false
    }
  })

  onMounted(() => {
    speechList.push(speech)
  })

  onUnmounted(() => {
    speech.stop()
    const index = speechList.findIndex(item => item === speech)
    speechList.splice(index, 1)
  })

  return {
    loading,
    isPlaying: speech.isPlaying,
    play,
  }
}
