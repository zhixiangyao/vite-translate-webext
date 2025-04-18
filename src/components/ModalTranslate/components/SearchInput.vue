<script lang="ts" setup>
import { CloseOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { useLang } from '~/composables/useLang'

interface Props {
  placeholder?: string
  autocomplete?: string
  disabled?: boolean
}

interface Emits {
  search: []
}

defineOptions({ name: 'SearchInput' })
const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const inputValue = defineModel<string>('value', { default: '' })

const lang = useLang()

function clear() {
  inputValue.value = ''
}

function search() {
  if (props.disabled)
    return
  emit('search')
}
</script>

<template>
  <div class="v-search-input">
    <div class="absolute w-full h-1px bg-gray-4 left-0 bottom-0" />
    <input
      v-model="inputValue"
      class="bg-white focus-visible:outline-none flex-1"
      :placeholder="placeholder"
      type="text"
      :autocomplete="autocomplete"
      @keydown="e => e.key === 'Enter' && search()"
    >

    <WIconWrapper v-if="!!inputValue" class="clear invisible">
      <CloseOutlined :title="lang('Click to clear')" @click="clear" />
    </WIconWrapper>

    <WIconWrapper :disabled="disabled">
      <SearchOutlined :title="lang('Click to search')" @click="search" />
    </WIconWrapper>
  </div>
</template>

<style scoped>
.v-search-input {
  @apply relative flex items-center gap-1 py-1;

  &:hover > .clear {
    @apply visible;
  }
}
</style>
