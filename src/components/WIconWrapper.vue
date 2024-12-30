<script setup lang="ts">
interface Props {
  width?: string
  height?: string
}

defineOptions({ name: 'WIconWrapper' })
withDefaults(defineProps<Props>(), { width: '20px', height: '20px' })
</script>

<template>
  <div class="w-icon-wrapper" :style="{ width, height }">
    <slot />
  </div>
</template>

<style>
.w-icon-wrapper {
  @apply flex justify-center items-center rounded-sm hover:bg-gray-2 select-none;
  transition: background-color 400ms ease-out;
}
</style>
