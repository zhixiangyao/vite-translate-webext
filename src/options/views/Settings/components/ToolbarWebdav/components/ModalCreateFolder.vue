<script lang="ts" setup>
import { Modal } from 'ant-design-vue'
import { folderName } from '../composables/useToolbarWebdav'

interface Props {
  loading: boolean
}

interface Emits {
  ok: []
}

defineOptions({ name: 'ModalCreateFolder' })
defineProps<Props>()
defineEmits<Emits>()
const open = defineModel<boolean>('open')
</script>

<template>
  <Modal v-model:open="open" destroy-on-close :ok-button-props="{ loading }" @ok="$emit('ok')">
    <template #title>
      <div>
        缺少 <code>{{ folderName }}</code> 文件夹, 是否创建?
      </div>
    </template>
  </Modal>
</template>
