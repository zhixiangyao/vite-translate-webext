<script lang="ts" setup>
import type { FileStat } from 'webdav'
import { Empty, Modal } from 'ant-design-vue'

interface Props {
  loading: boolean
  list: FileStat[]
}

interface Emits {
  ok: []
}

defineOptions({ name: 'ModalBackupList' })
defineProps<Props>()
defineEmits<Emits>()
const open = defineModel<boolean>('open')
</script>

<template>
  <Modal
    v-model:open="open"
    destroy-on-close
    :ok-button-props="{ loading, disabled: list.length === 0 }"
    cancel-text="Close"
    @ok="$emit('ok')"
  >
    <template #title>
      Backup List
    </template>

    <template v-if="list.length === 0">
      <Empty />
    </template>
    <template v-else>
      <p v-for="(item, index) of list" :key="index">
        {{ item.basename }}
      </p>
    </template>
  </Modal>
</template>
