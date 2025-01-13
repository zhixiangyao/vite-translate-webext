<script setup lang="ts">
import { SearchOutlined } from '@ant-design/icons-vue'
import { useModalSearch } from './composables/useModalSearch'

interface Emits {
  search: [text: string, left: number, top: number]
}

defineOptions({ name: 'ModalSearch' })
const props = defineProps<{ disabled?: boolean, root?: HTMLElement }>()
const emit = defineEmits<Emits>()

const modalSearch = useModalSearch({
  disabled: computed(() => props.disabled),
  root: props.root,
})

function handle() {
  modalSearch.handleHidden()
  emit('search', modalSearch.state.text, modalSearch.state.left, modalSearch.state.top)
}
</script>

<template>
  <div
    v-show="modalSearch.state.open"
    class="modal-search"
    :style="`left:${modalSearch.state.left}px;top:${modalSearch.state.top}px;`"
  >
    <WIconWrapper @click="handle">
      <SearchOutlined />
    </WIconWrapper>
  </div>
</template>

<style scoped>
.modal-search {
  box-shadow: 2px 3px 7px 2px rgba(0, 0, 0, 0.3);
  @apply fixed z-100000000000000000000 bg-white cursor-pointer rounded-sm;
  @apply flex items-center;
}
</style>
