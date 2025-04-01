<script lang="ts" setup>
import type { ButtonProps } from 'ant-design-vue'
import { onLongPress } from '@vueuse/core'
import { Button, Tooltip } from 'ant-design-vue'

interface Props {
  type?: ButtonProps['type']
  danger?: ButtonProps['danger']
  title?: ButtonProps['title']
  delay?: number
}

interface Emits {
  press: []
}

defineOptions({ name: 'ButtonLongPress', inheritAttrs: false })
const { title, delay, ...props } = defineProps<Props>()
const emit = defineEmits<Emits>()

const containerRef = ref<HTMLDivElement>()
onLongPress(containerRef, () => emit('press'), {
  delay,
  modifiers: {
    prevent: true,
  },
})
</script>

<template>
  <div ref="containerRef">
    <Tooltip :title="title" :arrow="false">
      <Button v-bind="{ ...$attrs, ...props }">
        <slot />
      </Button>
    </Tooltip>
  </div>
</template>
