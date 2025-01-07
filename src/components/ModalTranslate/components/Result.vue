<script setup lang="ts">
import type { useModalTranslate } from '../composables/useModalTranslate'
import { CheckOutlined, CopyOutlined, LeftOutlined } from '@ant-design/icons-vue'
import { useClipboard } from '@vueuse/core'
import { message } from 'ant-design-vue'

interface Props {
  result: NonNullable<ReturnType<typeof useModalTranslate>['state']['result']>
}

defineOptions({ name: 'Result' })
defineProps<Props>()

const expendMap = ref<Record<number, boolean | undefined>>({ 0: true })
const { copy } = useClipboard()
const copiedIndex = ref(-1)
const timer = ref<NodeJS.Timeout>()

function handleCopy(text: string, i: number) {
  clearTimeout(timer.value)

  copiedIndex.value = i
  copy(text)
  message?.success('复制成功')

  timer.value = setTimeout(() => {
    copiedIndex.value = -1
  }, 400)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div v-for="(alternative, i) of result.alternatives" :key="i" class="item">
      <div
        class="flex justify-between items-center h-5 text-sm pl-2 cursor-pointer select-none"
        @click="expendMap[i] = !expendMap[i]"
      >
        <WIconWrapper>
          <CopyOutlined v-if="copiedIndex !== i" title="复制" @click.prevent.stop="() => handleCopy(alternative, i)" />
          <CheckOutlined v-else />
        </WIconWrapper>

        <WIconWrapper>
          <LeftOutlined class="transition-transform" :class="expendMap[i] && '-rotate-90'" />
        </WIconWrapper>
      </div>

      <div v-if="expendMap[i]" class="pt-2">
        {{ alternative }}
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
