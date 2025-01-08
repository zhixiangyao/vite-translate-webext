<script setup lang="ts">
import type { EnumSpeakerLang } from '~/constant/enum'
import { SoundOutlined } from '@ant-design/icons-vue'
import { SPEAKER_LANG_MAP } from '~/constant/map'
import { storageVoices } from '~/logic/storage'

interface Props {
  lang: EnumSpeakerLang
  text: string
}

defineOptions({ name: 'ButtonSpeaker' })
const props = defineProps<Props>()

function handleSpeaker() {
  speechSynthesis.cancel()
  const ssu = new SpeechSynthesisUtterance(props.text)

  const americanVoice = storageVoices.value.find(voice => voice.lang === props.lang)

  americanVoice && (ssu.voice = americanVoice)

  speechSynthesis.speak(ssu)
}

function handleGetVoices() {
  if (storageVoices.value.length !== 0)
    return
  storageVoices.value = speechSynthesis.getVoices()
}

onMounted(() => {
  speechSynthesis.addEventListener('voiceschanged', handleGetVoices)
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
