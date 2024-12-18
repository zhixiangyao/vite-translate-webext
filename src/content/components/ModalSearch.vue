<script setup lang="ts">
import { SearchOutlined } from '@ant-design/icons-vue'

interface Props {
  top: string
  left: string
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
  <div
    v-show="open"
    class="absolute z-999 bg-white color-black rounded-sm p-1 cursor-pointer text-sm font-bold flex items-center gap-1"
    :style="{ left, top }"
    @click="$emit('search')"
  >
    <SearchOutlined />
    Search
  </div>
</template>
