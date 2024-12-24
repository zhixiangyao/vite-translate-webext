<script setup lang="ts">
import type { useModalTranslate } from '../composables/useModalTranslate'
import { LeftOutlined } from '@ant-design/icons-vue'

interface Props {
  result: NonNullable<ReturnType<typeof useModalTranslate>['state']['result']>
}

defineOptions({ name: 'Result' })
defineProps<Props>()

const expendMap = ref<Record<number, boolean | undefined>>({ 0: true })
</script>

<template>
  <div class="flex flex-col gap-1">
    <div v-for="(alternative, i) of result.alternatives" :key="i" class="item">
      <div
        class="flex justify-between items-center h-5 text-sm px-2 cursor-pointer select-none"
        @click="expendMap[i] = !expendMap[i]"
      >
        <span> 结果 {{ i + 1 }}: </span>

        <LeftOutlined class="transition-transform" :class="expendMap[i] && 'expend'" />
      </div>

      <div v-if="expendMap[i]" class="p-1 text-xs">
        {{ alternative }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.item {
  @apply relative;
  @apply before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-5 before:bg-gray-4;

  .expend {
    transform: rotate(-90deg);
  }
}
</style>
