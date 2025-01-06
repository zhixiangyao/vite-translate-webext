<script setup lang="ts">
import { CloseOutlined, HeartFilled, HeartOutlined, PushpinFilled, PushpinOutlined } from '@ant-design/icons-vue'
import { storageWordList } from '~/logic/storage'
import Empty from './components/Empty.vue'
import Result from './components/Result.vue'
import { useModalTranslate } from './composables/useModalTranslate'
import { useModalTranslateDraggable } from './composables/useModalTranslateDraggable'

defineOptions({ name: 'ModalTranslate' })
const props = defineProps<{ root?: HTMLElement }>()

const modalTranslate = useModalTranslate(props.root)
const { top, left, refContainer, refHeader, isDragging } = useModalTranslateDraggable({
  x: toRef(modalTranslate.state, 'left'),
  y: toRef(modalTranslate.state, 'top'),
  open: toRef(modalTranslate.state, 'open'),
  root: props.root,
})
const wordList = computed(() => {
  return storageWordList.value.map(value => value.word.toLowerCase())
})
const favorite = computed(() => {
  return wordList.value.includes(modalTranslate.state.text.toLowerCase())
})
const isWord = computed<boolean>(() => {
  const regex = /^[a-z]+$/i
  return regex.test(modalTranslate.state.text)
})

defineExpose({
  show: modalTranslate.handleShow,
  state: modalTranslate.state,
})
</script>

<template>
  <div
    v-show="modalTranslate.state.open"
    ref="refContainer"
    class="modal-translate"
    :class="[isDragging && 'is-dragging']"
    :style="`top:${top}px;left:${left}px`"
  >
    <header ref="refHeader" class="header">
      <div class="inline-flex gap-[2px]">
        <WIconWrapper>
          <PushpinFilled
            v-if="modalTranslate.state.pin"
            title="点击取消固定"
            @click="modalTranslate.state.pin = false"
          />
          <PushpinOutlined v-else title="点击固定" @click="modalTranslate.state.pin = true" />
        </WIconWrapper>

        <WIconWrapper :show="!isWord">
          <template v-if="isWord">
            <HeartFilled v-if="favorite" title="点击取消收藏" @click="modalTranslate.handleRemove" />
            <HeartOutlined v-else title="点击收藏" @click="modalTranslate.handleAdd" />
          </template>
        </WIconWrapper>
      </div>

      <WIconWrapper>
        <CloseOutlined title="关闭" @click="modalTranslate.handleHidden" />
      </WIconWrapper>
    </header>

    <main class="px-2">
      <WSearchInput
        v-model:value="modalTranslate.state.text"
        placeholder="请输入要翻译的内容"
        :disabled="!modalTranslate.state.text"
        @search="modalTranslate.handleSearch"
      />

      <div class="py-2">
        <template v-if="modalTranslate.state.loading">
          <WLoading />
        </template>
        <template v-else-if="modalTranslate.state.result">
          <Result :result="modalTranslate.state.result" />
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
  box-shadow: 2px 3px 7px 2px rgba(0, 0, 0, 0.3);
  @apply fixed z-100000000000000000000 min-w-300px max-w-500px bg-white color-black overflow-hidden rounded-sm;

  &.is-dragging * {
    @apply select-none;
  }

  .header {
    @apply flex justify-between items-center p-2 gap-1 bg-gray-4 cursor-grab;
  }
}
</style>
