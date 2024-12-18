<script setup lang="ts">
defineOptions({ name: 'Translate' })
defineProps<{ value: string }>()
</script>

<template>
  <p>Translate: {{ value }}</p>
</template>
