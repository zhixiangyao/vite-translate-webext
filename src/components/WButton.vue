<script setup lang="ts">
interface Props {
  disabled?: boolean
  dark?: boolean
  align?: 'left' | 'right'
}

interface Emits {
  click: [MouseEvent]
}

defineOptions({ name: 'WButton' })
defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <button
    class="w-button"
    :class="{ disabled, dark, left: align === 'left', right: align === 'right' }"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot name="default" />
  </button>
</template>

<style scoped>
.w-button {
  @apply inline-flex items-center justify-center shadow h-6 px-2 py-1 hover:bg-gray-1;

  &.disabled {
    @apply cursor-not-allowed bg-gray-2;
  }

  &.dark {
    @apply text-white bg-gray-700;
  }

  &.left {
    @apply justify-start;
  }

  &.right {
    @apply justify-end;
  }
}
</style>
