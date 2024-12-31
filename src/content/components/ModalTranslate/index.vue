<script setup lang="ts">
import type { useModalTranslate } from './composables/useModalTranslate'
import { CloseOutlined, HeartFilled, HeartOutlined, PushpinFilled, PushpinOutlined } from '@ant-design/icons-vue'
import Empty from './components/Empty.vue'
import Result from './components/Result.vue'
import { useModalTranslateDraggable } from './composables/useModalTranslateDraggable'

interface Props {
  top: number
  left: number
  open: boolean
  result: ReturnType<typeof useModalTranslate>['state']['result']
  loading: boolean
  favorite: boolean
  root?: HTMLElement
}

interface Emits {
  close: []
  search: [string]
  add: [string]
  remove: [string]
}

defineOptions({ name: 'ModalTranslate' })
const props = defineProps<Props>()
defineEmits<Emits>()

const text = defineModel<string>('text', { default: '' })
const pin = defineModel<boolean>('pin', { default: false })

const isWord = computed<boolean>(() => {
  const regex = /^[a-z]+$/i
  return regex.test(text.value)
})
const { top, left, refContainer, refHeader, isDragging } = useModalTranslateDraggable({
  x: toRef(props, 'left'),
  y: toRef(props, 'top'),
  open: toRef(props, 'open'),
  root: props.root,
})
</script>

<template>
  <div
    v-show="open"
    ref="refContainer"
    class="modal-translate"
    :class="[isDragging && 'is-dragging']"
    :style="`top:${top}px;left:${left}px`"
  >
    <header ref="refHeader" class="header">
      <div class="inline-flex gap-1">
        <WIconWrapper>
          <PushpinFilled v-if="pin" class="cursor-pointer" title="点击取消固定" @click="pin = false" />
          <PushpinOutlined v-else class="cursor-pointer" title="点击固定" @click="pin = true" />
        </WIconWrapper>

        <template v-if="isWord">
          <WIconWrapper>
            <HeartFilled v-if="favorite" class="cursor-pointer" title="点击取消收藏" @click="$emit('remove', text)" />
            <HeartOutlined v-else class="cursor-pointer" title="点击收藏" @click="$emit('add', text)" />
          </WIconWrapper>
        </template>
      </div>

      <WIconWrapper>
        <CloseOutlined class="cursor-pointer" title="关闭" @click="$emit('close')" />
      </WIconWrapper>
    </header>

    <main class="px-2">
      <WSearchInput
        v-model:value="text"
        placeholder="请输入要翻译的内容"
        :disabled="!text"
        @search="$emit('search', text)"
      />

      <div class="py-2">
        <template v-if="loading">
          <WLoading />
        </template>
        <template v-else-if="result">
          <Result :result="result" />
        </template>
        <template v-else>
          <Empty />
        </template>
      </div>
    </main>
  </div>
</template>

<style scoped>
.modal-translate {
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  @apply fixed z-100000000000000000000 min-w-300px max-w-500px bg-white color-black overflow-hidden;

  &.is-dragging * {
    @apply select-none;
  }

  .header {
    @apply flex justify-between items-center p-2 gap-1 bg-gray-4 cursor-grab;
  }
}
</style>
