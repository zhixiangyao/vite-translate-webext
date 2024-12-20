<script setup lang="ts">
import type { Data } from '~/content/composables/useTranslate'
import { LeftOutlined } from '@ant-design/icons-vue'

interface Props {
  result: Data
}

defineOptions({ name: 'Result' })
defineProps<Props>()

const expendMap = ref<Record<number, boolean | undefined>>({})
</script>

<template>
  <div class="flex flex-col gap-1">
    <div v-for="(alternative, i) of result.alternatives" :key="i" class="item">
      <div class="flex justify-between items-center h-5 text-sm px-2">
        <span> 结果 {{ i + 1 }}: </span>

        <LeftOutlined
          class="transition-transform select-none cursor-pointer"
          :class="expendMap[i] && 'expend'"
          @click="expendMap[i] = !expendMap[i]"
        />
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
