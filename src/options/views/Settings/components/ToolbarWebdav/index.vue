<script lang="ts" setup>
import { Button } from 'ant-design-vue'
import ModalBackupList from './components/ModalBackupList.vue'
import ModalCreateFolder from './components/ModalCreateFolder.vue'
import { useToolbarWebdav } from './composables/useToolbarWebdav'

interface Props {
  disabled?: boolean
  url?: string
  username?: string
  password?: string
}

defineOptions({ name: 'ToolbarWebdav' })
const props = defineProps<Props>()

const webdav = useToolbarWebdav({
  url: computed(() => props.url),
  username: computed(() => props.username),
  password: computed(() => props.password),
})
</script>

<template>
  <div class="flex gap-2">
    <Button :disabled="webdav.disabled.value || !disabled" @click="webdav.handleExport">
      Export
    </Button>

    <Button :disabled="webdav.disabled.value || !disabled" @click="webdav.handleShowBackups">
      Show Backups
    </Button>
  </div>

  <ModalCreateFolder
    v-model:open="webdav.stateCreateFolder.open"
    :loading="webdav.stateCreateFolder.loading"
    @ok="webdav.handleCreateFolder"
  />

  <ModalBackupList
    v-model:open="webdav.stateBackupList.open"
    :loading="webdav.stateBackupList.loading"
    :list="webdav.stateBackupList.list"
    @ok="webdav.handleBackupList"
  />
</template>
