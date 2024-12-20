<script setup lang="ts">
import type { Data } from '~/content/composables/useTranslate'

interface Props {
  result?: Data
}

defineOptions({ name: 'Result' })
defineProps<Props>()
</script>

<template>
  <div v-if="result?.alternatives.length">
    <p v-for="(alternative, i) of result.alternatives" :key="i">
      {{ alternative }}
    </p>
  </div>
  <div v-else>
    <span>没有找到结果</span>
  </div>
</template>
