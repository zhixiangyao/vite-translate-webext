<script setup lang="ts">
import { CloseOutlined, SearchOutlined } from '@ant-design/icons-vue'

interface Props {
  placeholder?: string
  autocomplete?: string
}

interface Emits {
  search: []
}

defineOptions({ name: 'SearchInput' })
defineProps<Props>()
defineEmits<Emits>()

const inputValue = defineModel<string>('value', { default: '' })

function clear() {
  inputValue.value = ''
}
</script>

<template>
  <div class="relative flex items-center gap-1 py-1">
    <div class="absolute w-full h-1px bg-gray-4 left-0 bottom-0" />
    <input
      v-model="inputValue"
      class="bg-white focus-visible:outline-none flex-1"
      :placeholder="placeholder"
      type="text"
      :autocomplete="autocomplete"
    >

    <div class="w-4 h-4 flex items-center justify-center">
      <CloseOutlined v-show="!!inputValue" @click="clear" />
    </div>

    <div class="w-4 h-4 flex items-center justify-center">
      <SearchOutlined @click="$emit('search')" />
    </div>
  </div>
</template>
