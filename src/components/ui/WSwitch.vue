<script setup lang="ts">
interface Props {
  color?: string
}

defineOptions({ name: 'WSwitch' })
withDefaults(defineProps<Props>(), { color: '#4ade80' })

const checked = defineModel<boolean>('checked', { default: false })
</script>

<template>
  <label for="toggle" class="w-switch">
    <input id="toggle" type="checkbox" :checked="checked" class="sr-only" @change="checked = !checked">
    <div class="bg" />
    <div class="dot" />
  </label>
</template>

<style scoped>
.w-switch {
  @apply flex items-center cursor-pointer relative;

  > input:checked ~ .dot {
    background-color: v-bind(color);

    @apply translate-x-5;
  }

  > .bg {
    @apply block bg-gray-600 w-11 h-6 rounded-full;
  }

  > .dot {
    @apply absolute left-1 top-1 bg-white w-4 h-4 rounded-full;
  }
}
</style>
