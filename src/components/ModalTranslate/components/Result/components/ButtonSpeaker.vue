<script setup lang="ts">
import type { EnumSpeakerLang } from '~/constant/enum'
import { SoundOutlined } from '@ant-design/icons-vue'
import { SPEAKER_LANG_MAP } from '~/constant/map'
import { useSpeaker } from '../composables/useSpeaker'

interface Props {
  lang: EnumSpeakerLang
  text: string
}

defineOptions({ name: 'ButtonSpeaker' })
const props = defineProps<Props>()

const { speaker, loading } = useSpeaker()
</script>

<template>
  <div class="flex items-center gap-1">
    <span class="select-none">{{ SPEAKER_LANG_MAP[lang] }}:</span>

    <WIconWrapper @click="() => speaker(props.text, props.lang)">
      <SoundOutlined :spin="loading" />
    </WIconWrapper>
  </div>
</template>
