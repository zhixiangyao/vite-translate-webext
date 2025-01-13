<script setup lang="ts">
import type { EnumSpeakerLang } from '~/constant/enum'
import { LoadingOutlined, SoundOutlined } from '@ant-design/icons-vue'
import { SPEAKER_LANG_MAP } from '~/constant/map'
import { useSpeaker } from '../composables/useSpeaker'

interface Props {
  lang: EnumSpeakerLang
  text: string
}

defineOptions({ name: 'ButtonSpeaker' })
const props = defineProps<Props>()

const speaker = useSpeaker({
  text: computed(() => props.text),
  lang: props.lang,
})
</script>

<template>
  <div class="flex items-center gap-1">
    <span class="select-none">{{ SPEAKER_LANG_MAP[lang] }}:</span>

    <WIconWrapper :class="speaker.loading.value && 'cursor-not-allowed'" @click="speaker.play">
      <LoadingOutlined v-if="speaker.loading.value" />
      <SoundOutlined v-else :spin="speaker.isPlaying.value" />
    </WIconWrapper>
  </div>
</template>
