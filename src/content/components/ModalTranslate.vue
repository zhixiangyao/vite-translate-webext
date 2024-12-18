<script setup lang="ts">
interface Props {
  top: string
  left: string
  text: string
  open: boolean
}

defineOptions({ name: 'ModalTranslate' })
defineProps<Props>()
</script>

<template>
  <div
    v-show="open"
    class="absolute z-999 min-w-200px max-w-500px bg-white color-black rounded-sm px-2"
    :style="{ left, top }"
  >
    <p>Translate: {{ text }}</p>
  </div>
</template>
