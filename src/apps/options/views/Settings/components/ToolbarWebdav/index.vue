<script lang="ts" setup>
import { Button } from 'ant-design-vue'
import { useLang } from '~/composables/useLang'
import ModalBackupsList from './components/ModalBackupsList.vue'
import { useToolbarWebdav } from './composables/useToolbarWebdav'

interface Props {
  disabled?: boolean
  url?: string
  username?: string
  password?: string
  path?: string
}

defineOptions({ name: 'ToolbarWebdav' })
const props = defineProps<Props>()

const lang = useLang()
const webdav = useToolbarWebdav({
  url: computed(() => props.url),
  username: computed(() => props.username),
  password: computed(() => props.password),
  path: computed(() => props.path),
})
const { loading, open, folderList } = webdav
</script>

<template>
  <div class="flex gap-2">
    <Button :disabled="!disabled" @click="webdav.handleExport">
      {{ webdav.disabled.value ? lang('Export to Local') : lang('Export to Webdav') }}
    </Button>

    <Button :disabled="webdav.disabled.value || !disabled" :loading="loading" @click="webdav.handleShowBackups">
      {{ lang('Show Backups') }}
    </Button>
  </div>

  <ModalBackupsList v-model:open="open" :list="folderList" @import="webdav.handleImport" @delete="webdav.handleDelete" />
</template>
