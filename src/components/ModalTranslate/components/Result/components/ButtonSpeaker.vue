<script setup lang="ts">
import type { EnumSpeakerLang } from '~/constant/enum'
import { SoundOutlined } from '@ant-design/icons-vue'
import { SPEAKER_LANG_MAP } from '~/constant/map'

interface Props {
  lang: EnumSpeakerLang
  text: string
}

defineOptions({ name: 'ButtonSpeaker' })
const props = defineProps<Props>()

const voices = ref<SpeechSynthesisVoice[]>([])

function handleSpeaker() {
  speechSynthesis.cancel()
  const ssu = new SpeechSynthesisUtterance(props.text)

  const americanVoice = voices.value.find(voice => voice.lang === props.lang)

  americanVoice && (ssu.voice = americanVoice)

  speechSynthesis.speak(ssu)
}

onMounted(() => {
  speechSynthesis.addEventListener('voiceschanged', () => (voices.value = speechSynthesis.getVoices()))
})
</script>

<template>
  <div class="flex items-center gap-1">
    <span class="select-none">{{ SPEAKER_LANG_MAP[lang] }}:</span>

    <WIconWrapper @click="handleSpeaker">
      <SoundOutlined />
    </WIconWrapper>
  </div>
</template>
