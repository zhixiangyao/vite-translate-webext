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

const { copy } = useClipboard()
const expend = ref(true)
const copied = ref(false)
const selectedIdx = ref(0)
const timer = ref<NodeJS.Timeout>()

function handleCopy(text: string) {
  clearTimeout(timer.value)

  copied.value = true
  copy(text)
  message?.success('复制成功')

  timer.value = setTimeout(() => {
    copied.value = false
  }, 400)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="item">
      <div class="flex justify-between items-center h-5 text-sm pl-2 select-none">
        <div class="flex items-center gap-1">
          <span class="color-gray-4 font-bold">Deeplx</span>

          <WIconWrapper>
            <CopyOutlined
              v-if="!copied"
              title="复制"
              @click.prevent.stop="() => handleCopy(result.alternatives[selectedIdx])"
            />
            <CheckOutlined v-else />
          </WIconWrapper>

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

      <div v-if="expend" class="pt-2">
        {{ result.alternatives[selectedIdx] }}
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
