<script setup lang="ts">
import { CloseOutlined, HeartFilled, HeartOutlined, PushpinFilled, PushpinOutlined } from '@ant-design/icons-vue'
import Empty from './components/Empty.vue'
import Error from './components/Error.vue'
import Result from './components/Result/index.vue'
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
            title="Click to unfix"
            @click="modalTranslate.state.pin = false"
          />
          <PushpinOutlined v-else title="Click to fix" @click="modalTranslate.state.pin = true" />
        </WIconWrapper>

        <WIconWrapper :show="!modalTranslate.isWord.value">
          <template v-if="modalTranslate.isWord.value">
            <HeartFilled v-if="modalTranslate.favorite.value" title="Click to unfavorite" @click="modalTranslate.handleRemove" />
            <HeartOutlined v-else title="Click to favorite" @click="modalTranslate.handleAdd" />
          </template>
        </WIconWrapper>
      </div>

      <WIconWrapper>
        <CloseOutlined title="Close" @click="modalTranslate.handleHidden" />
      </WIconWrapper>
    </header>

    <main class="px-2">
      <WSearchInput
        v-model:value="modalTranslate.state.text"
        placeholder="Please enter the content to be translated"
        :disabled="!modalTranslate.state.text"
        @search="modalTranslate.handleSearch"
      />

      <div class="py-2">
        <template v-if="modalTranslate.state.loading">
          <WLoading />
        </template>
        <template v-else-if="modalTranslate.state.result">
          <Result :result="modalTranslate.state.result" :search="modalTranslate.state.text" />
        </template>
        <template v-else-if="modalTranslate.state.error !== void 0">
          <Error :code="modalTranslate.state.error" />
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
