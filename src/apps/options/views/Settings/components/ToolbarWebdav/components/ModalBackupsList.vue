<script lang="ts" setup>
import type { FileStat } from 'webdav'
import { Button, Empty, Modal } from 'ant-design-vue'
import { useLang } from '~/composables/useLang'

interface Props {
  list: FileStat[]
}

interface Emits {
  delete: [item: FileStat]
  import: [item: FileStat]
}

defineOptions({ name: 'ModalBackupsList' })
defineProps<Props>()
defineEmits<Emits>()
const open = defineModel<boolean>('open')

const lang = useLang()
</script>

<template>
  <Modal v-model:open="open" cancel-text="Close" :width="600" :mask-closable="false">
    <template #title>
      {{ lang('Backups List') }}
    </template>

    <template v-if="list.length === 0">
      <Empty />
    </template>
    <template v-else>
      <div class="flex flex-col gap-1">
        <div v-for="(item, index) of list" :key="index" class="flex justify-between items-center">
          <div class="flex gap-8">
            <span>{{ item.basename }}</span>
            <span>{{ (item.size / 1024).toFixed(2) }}KB</span>
          </div>

          <div class="flex gap-1 items-center">
            <Button size="small" @click="$emit('import', item)">
              {{ lang('Import') }}
            </Button>

            <Button size="small" danger @click="$emit('delete', item)">
              {{ lang('Delete') }}
            </Button>
          </div>
        </div>
      </div>
    </template>

    <template #footer />
  </Modal>
</template>
