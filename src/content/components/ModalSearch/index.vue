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

<template>
  <div v-show="open" class="modal-search" :style="`left:${left}px;top:${top}px;`" @click="$emit('search')">
    <WIconWrapper>
      <SearchOutlined />
    </WIconWrapper>
  </div>
</template>

<style scoped>
.modal-search {
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  @apply fixed z-100000000000000000000;
  @apply bg-white rounded-sm p-0.5;
}
</style>
