<script setup lang="ts">
import { CloseOutlined, PushpinFilled, PushpinOutlined } from '@ant-design/icons-vue'
import Result from './Result.vue'

interface Props {
  top: string
  left: string
  open: boolean
}

interface Emits {
  close: []
}

defineOptions({ name: 'ModalTranslate' })
defineProps<Props>()
defineEmits<Emits>()

const text = defineModel<string>('text', { default: '' })
const pin = defineModel<boolean>('pin', { default: false })
const result = ref<Record<string, string> | undefined>()
const loading = ref(false)

async function handleSearch() {
  try {
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 300))
    result.value = {
      a: '123',
    }
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    v-show="open"
    class="absolute z-999 min-w-200px max-w-500px bg-white color-black rounded-sm overflow-hidden"
    :style="{ left, top }"
  >
    <header class="flex justify-between items-center p-2 gap-1 bg-gray-4">
      <PushpinFilled v-if="pin" class="cursor-pointer" @click="pin = false" />
      <PushpinOutlined v-else class="cursor-pointer" @click="pin = true" />
      <CloseOutlined class="cursor-pointer" @click="$emit('close')" />
    </header>

    <main class="px-2">
      <SearchInput v-model:value="text" placeholder="Please Input" @search="handleSearch" />

      <div class="py-2">
        <Result :result="result" :loading="loading" />
      </div>
    </main>
  </div>
</template>
