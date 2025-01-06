<script setup lang="ts">
import { SearchOutlined } from '@ant-design/icons-vue'

interface Props {
  top: number
  left: number
  text: string
  open: boolean
}

interface Emits {
  search: []
}

defineOptions({ name: 'ModalSearch' })
defineProps<Props>()
defineEmits<Emits>()
</script>

<script lang="ts">
export { useModalSearch } from './composables/useModalSearch'
</script>

<template>
  <div v-show="open" class="modal-search" :style="`left:${left}px;top:${top}px;`">
    <WIconWrapper @click="$emit('search')">
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
