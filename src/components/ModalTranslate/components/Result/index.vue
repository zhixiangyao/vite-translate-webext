<script setup lang="ts">
import type { useModalTranslate } from '../../composables/useModalTranslate'
import { LeftOutlined } from '@ant-design/icons-vue'
import { EnumSpeakerLang } from '~/constant/enum'
import ButtonCopy from './components/ButtonCopy.vue'
import ButtonSpeaker from './components/ButtonSpeaker.vue'

interface Props {
  result: NonNullable<ReturnType<typeof useModalTranslate>['state']['result']>
}

defineOptions({ name: 'Result' })
const props = defineProps<Props>()

const expend = ref(true)
const selectedIdx = ref(0)
const text = computed(() => props.result.alternatives[selectedIdx.value])
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="item">
      <div class="flex justify-between items-center h-5 text-sm pl-2 select-none">
        <div class="flex items-center gap-1">
          <span class="color-gray-4 font-bold">Deeplx</span>

          <ButtonCopy :text="text" />

          <WIconWrapper
            v-for="(_, i) of result.alternatives"
            :key="i"
            :selected="i === selectedIdx"
            @click.prevent.stop="() => (selectedIdx = i)"
          >
            {{ i + 1 }}
          </WIconWrapper>
        </div>

        <WIconWrapper @click="expend = !expend">
          <LeftOutlined class="transition-transform" :class="expend && '-rotate-90'" />
        </WIconWrapper>
      </div>

      <div v-if="expend" class="pt-2 flex gap-2">
        <ButtonSpeaker :lang="EnumSpeakerLang.en_GB" :text="text" />
        <ButtonSpeaker :lang="EnumSpeakerLang.en_US" :text="text" />
        <ButtonSpeaker :lang="EnumSpeakerLang.zh_CN" :text="text" />
        <ButtonSpeaker :lang="EnumSpeakerLang.zh_HK" :text="text" />
      </div>

      <div v-if="expend" class="pt-2">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.item {
  @apply relative;
  @apply before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-5 before:bg-gray-4;
}
</style>
