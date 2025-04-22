<script lang="ts" setup>
import type { ListGridType } from 'ant-design-vue/es/list'
import type { TRecordGroup } from '~/storage'
import { EditOutlined } from '@ant-design/icons-vue'
import { Button, Card, List, ListItem, theme } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import ButtonLongPress from '~/apps/options/components/ButtonLongPress.vue'
import { layoutHeaderRightSlotRef } from '~/apps/options/layout/components/LayoutHeader.vue'
import { useLang } from '~/composables/useLang'
import { storageGroupList, storageWordList } from '~/storage'
import DrawerUpdateGroup from './components/DrawerUpdateGroup.vue'
import { useDrawerUpdateGroup } from './composables/useDrawerUpdateGroup'
import { useExportBackups } from './composables/useExportBackups'
import { useRecoverBackups } from './composables/useRecoverBackups'

defineOptions({ name: 'GroupList' })

const listGrid: ListGridType = { sm: 1, md: 2, lg: 3, xl: 4, xxl: 5 }

const lang = useLang()
const route = useRoute()
const { token } = theme.useToken()
const drawerUpdateGroup = useDrawerUpdateGroup()
const exportBackups = useExportBackups()
const recoverBackups = useRecoverBackups()
const showTeleport = computed(() => layoutHeaderRightSlotRef.value && route.name === 'GroupList')

function handleDeleteGroup(record: TRecordGroup) {
  const groupList = storageGroupList.value
  const index = groupList.findIndex(({ uuid }) => record.uuid === uuid)

  if (index !== -1) {
    groupList.splice(index, 1)
    storageWordList.value.forEach((word) => {
      if (word.groupUUID === record.uuid)
        word.groupUUID = void 0
    })
  }
}
</script>

<template>
  <Teleport v-if="showTeleport" :to="layoutHeaderRightSlotRef">
    <Button size="small" @click="() => drawerUpdateGroup.handleOpen()">
      {{ lang('Add Group') }}
    </Button>

    <Button size="small" type="primary" :disabled="exportBackups.disabled.value" @click="exportBackups.handleExport">
      {{ lang('Export') }}
    </Button>

    <Button danger size="small" type="dashed" @click="recoverBackups.handleRecover">
      {{ lang('Recover') }}
    </Button>
  </Teleport>

  <List class="pb-6 overflow-auto" :grid="listGrid" :data-source="storageGroupList">
    <template #renderItem="{ item: record }: { item: TRecordGroup }">
      <ListItem class="!mb-0 mt-6">
        <Card>
          <template #title>
            <div class="flex gap-2 items-center">
              <WIconWrapper :color="token.colorPrimary" @click="() => drawerUpdateGroup.handleOpen(record)">
                <EditOutlined />
              </WIconWrapper>

              <span class="text-sm">{{ record.name }}</span>
            </div>
          </template>

          <template #extra>
            <ButtonLongPress
              danger
              type="link"
              class="p-0"
              :delay="2000"
              :title="lang('Long press to delete')"
              @press="() => handleDeleteGroup(record)"
            >
              {{ lang('Delete') }}
            </ButtonLongPress>
          </template>

          <div class="flex justify-between items-center">
            <span>{{ record.list.length }}</span>
          </div>
        </Card>
      </ListItem>
    </template>
  </List>

  <DrawerUpdateGroup :use="drawerUpdateGroup" />
</template>
