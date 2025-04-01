<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'
import { Button, theme } from 'ant-design-vue'

interface Props {
  x: number
  y: number
}

interface Emits {
  close: []
  closeOther: []
}

defineOptions({ name: 'LayoutViewTabContextMenu' })
defineProps<Props>()
const emit = defineEmits<Emits>()

const { token } = theme.useToken()
const open = defineModel<boolean>('open', { default: false })
const contextRef = ref<HTMLDivElement | null>(null)

onClickOutside(contextRef, () => (open.value = false))

function handleClose() {
  open.value = false
  emit('close')
}

function handleCloseOther() {
  open.value = false
  emit('closeOther')
}
</script>

<template>
  <div
    v-show="open"
    ref="contextRef"
    class="context-menu z-1000 fixed p-1 rounded-sm flex flex-col gap-1"
    :style="{ top: `${y ?? 0}px`, left: `${x ?? 0}px`, backgroundColor: token.colorBgSpotlight }"
  >
    <Button size="small" w-25 @click="handleClose">
      关闭当前
    </Button>
    <Button size="small" w-25 @click="handleCloseOther">
      关闭其它
    </Button>
  </div>
</template>

<style scoped>
.context-menu {
  box-shadow: 2px 3px 7px 2px rgba(0, 0, 0, 0.2);
}
</style>
