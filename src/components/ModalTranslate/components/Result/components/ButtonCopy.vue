<script setup lang="ts">
import { CheckOutlined, CopyOutlined } from '@ant-design/icons-vue'
import { useClipboard } from '@vueuse/core'
import { message } from 'ant-design-vue'

interface Props {
  text: string
}

defineOptions({ name: 'ButtonCopy' })
const props = defineProps<Props>()

const { copy } = useClipboard()
const copied = ref(false)
const timer = ref<NodeJS.Timeout>()

function handleCopy() {
  clearTimeout(timer.value)

  copied.value = true
  copy(props.text)
  message?.success('复制成功')

  timer.value = setTimeout(() => {
    copied.value = false
  }, 400)
}
</script>

<template>
  <WIconWrapper>
    <CopyOutlined v-if="!copied" title="复制" @click.prevent.stop="handleCopy" />
    <CheckOutlined v-else />
  </WIconWrapper>
</template>
