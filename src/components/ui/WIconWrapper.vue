<script setup lang="ts">
interface Props {
  width?: string
  height?: string
  show?: boolean
  disabled?: boolean
}

defineOptions({ name: 'WIconWrapper' })
withDefaults(defineProps<Props>(), { width: '20px', height: '20px' })
</script>

<template>
  <div class="w-icon-wrapper" :class="[show && 'show', disabled && 'disabled']" :style="{ width, height }">
    <slot />
  </div>
</template>

<style>
.w-icon-wrapper {
  @apply flex justify-center items-center rounded-sm select-none cursor-pointer;
  transition: background-color 400ms ease-out;

  &:not(.show) {
    @apply hover:bg-gray-3;
  }

  > span {
    @apply flex justify-center items-center w-full h-full;
  }

  &.disabled,
  &.disabled * {
    @apply !cursor-not-allowed;
  }
}
</style>
