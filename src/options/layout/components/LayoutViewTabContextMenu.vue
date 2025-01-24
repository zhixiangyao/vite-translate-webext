<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'
import { Button, theme } from 'ant-design-vue'

interface Props {
  x: number
  y: number
}

defineOptions({ name: 'LayoutViewTabContextMenu' })
defineProps<Props>()

const { token } = theme.useToken()
const open = defineModel<boolean>('open', { default: false })
const contextRef = ref<HTMLDivElement | null>(null)

onClickOutside(contextRef, () => (open.value = false))
</script>

<template>
  <div
    v-show="open"
    ref="contextRef"
    class="context-menu z-1000 fixed p-[4px] rounded-sm"
    :style="{ top: `${y ?? 0}px`, left: `${x ?? 0}px`, backgroundColor: token.colorBgContainer }"
  >
    <Button size="small" w-25>
      刷新
    </Button>
  </div>
</template>

<style scoped>
.context-menu {
  box-shadow: 2px 3px 7px 2px rgba(0, 0, 0, 0.2);
}
</style>
