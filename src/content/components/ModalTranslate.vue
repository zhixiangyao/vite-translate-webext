<script setup lang="ts">
import type { Data } from '~/content/composables/useTranslate'
import { CloseOutlined, HeartFilled, HeartOutlined, PushpinFilled, PushpinOutlined } from '@ant-design/icons-vue'
import Result from './Result.vue'

interface Props {
  top: string
  left: string
  open: boolean
  result?: Data
  loading: boolean
  favorite: boolean
}

interface Emits {
  close: []
  search: [string]
  add: [string]
  remove: [string]
}

defineOptions({ name: 'ModalTranslate' })
defineProps<Props>()
defineEmits<Emits>()

const text = defineModel<string>('text', { default: '' })
const pin = defineModel<boolean>('pin', { default: false })

const isWord = computed(() => {
  const regex = /^[a-z]+$/i

  return regex.test(text.value)
})
</script>

<template>
  <div v-show="open" class="modal-translate" :style="{ left, top }">
    <header class="header">
      <div class="inline-flex gap-1">
        <PushpinFilled v-if="pin" class="cursor-pointer" @click="pin = false" />
        <PushpinOutlined v-else class="cursor-pointer" @click="pin = true" />

        <template v-if="isWord">
          <HeartFilled v-if="favorite" class="cursor-pointer" @click="$emit('remove', text)" />
          <HeartOutlined v-else class="cursor-pointer" @click="$emit('add', text)" />
        </template>
      </div>

      <CloseOutlined class="cursor-pointer" @click="$emit('close')" />
    </header>

    <main class="px-2">
      <WInput v-model:value="text" placeholder="请输入要翻译的内容" :disabled="!text" @search="$emit('search', text)" />

      <div class="py-2">
        <Result :result="result" :loading="loading" />
      </div>
    </main>
  </div>
</template>

<style scoped>
.modal-translate {
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);

  @apply absolute z-999 min-w-200px max-w-500px bg-white color-black overflow-hidden;

  .header {
    @apply flex justify-between items-center p-2 gap-1 bg-gray-4;
  }
}
</style>
