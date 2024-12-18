<script setup lang="ts">
interface Props {
  result?: Record<string, string>
  loading: boolean
}

defineOptions({ name: 'Result' })
defineProps<Props>()
</script>

<template>
  <template v-if="loading">
    loading...
  </template>
  <template v-else>
    <span v-if="result">{{ JSON.stringify(result, null, 2) }}</span>
    <span v-else>没有找到结果</span>
  </template>
</template>
