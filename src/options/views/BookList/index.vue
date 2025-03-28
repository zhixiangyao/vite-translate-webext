<script lang="ts" setup>
import type { ListGridType } from 'ant-design-vue/es/list'
import type { TRecordGroup } from '~/logic/storage'
import { EditOutlined } from '@ant-design/icons-vue'
import { Button, Card, List, ListItem, theme } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import { storageGroupList, storageWordList } from '~/logic/storage'
import ButtonLongPress from '~/options/components/ButtonLongPress.vue'
import { layoutHeaderRightSlotRef } from '~/options/layout/components/LayoutHeader.vue'
import DrawerUpdateGroup from './components/DrawerUpdateGroup.vue'
import DrawerWordList from './components/DrawerWordList.vue'
import { useDrawerUpdateGroup } from './composables/useDrawerUpdateGroup'
import { useDrawerWordList } from './composables/useDrawerWordList'
import { useExportBackups } from './composables/useExportBackups'
import { useRecoverBackups } from './composables/useRecoverBackups'

defineOptions({ name: 'BookList' })

const listGrid: ListGridType = { sm: 1, md: 2, lg: 3, xl: 4, xxl: 5 }
const route = useRoute()
const { token } = theme.useToken()
const drawerWordList = useDrawerWordList()
const drawerUpdateGroup = useDrawerUpdateGroup()
const exportBackups = useExportBackups()
const recoverBackups = useRecoverBackups()
const showTeleport = computed(() => layoutHeaderRightSlotRef.value && route.name === 'BookList')

function handleDeleteGroup(group: TRecordGroup) {
  const groupList = storageGroupList.value
  const index = groupList.findIndex(({ uuid }) => group.uuid === uuid)

  if (index !== -1) {
    groupList.splice(index, 1)
    storageWordList.value.forEach((word) => {
      if (word.groupUUID === group.uuid)
        word.groupUUID = void 0
    })
  }
}
</script>

<template>
  <Teleport v-if="showTeleport" :to="layoutHeaderRightSlotRef">
    <Button size="small" @click="() => drawerUpdateGroup.handleOpen()">
      Add Group
    </Button>

    <Button size="small" @click="drawerWordList.handleOpen">
      Edit Book List
    </Button>

    <Button size="small" type="primary" :disabled="exportBackups.disabled.value" @click="exportBackups.handleExport">
      Export Backup
    </Button>

    <Button danger size="small" type="dashed" @click="recoverBackups.handleRecover">
      Restore Backup
    </Button>
  </Teleport>

  <List class="pb-6" :grid="listGrid" :data-source="storageGroupList">
    <template #renderItem="{ item: group }: { item: TRecordGroup }">
      <ListItem class="!mb-0 mt-6">
        <Card>
          <template #title>
            <div class="flex gap-2 items-center">
              <WIconWrapper :color="token.colorPrimary" @click="() => drawerUpdateGroup.handleOpen(group)">
                <EditOutlined />
              </WIconWrapper>

              <span class="text-sm">{{ group.name }}</span>
            </div>
          </template>

          <template #extra>
            <ButtonLongPress
              danger
              type="link"
              class="p-0"
              :delay="2000"
              title="Long press to delete"
              @press="() => handleDeleteGroup(group)"
            >
              Delete
            </ButtonLongPress>
          </template>

          <div class="flex justify-between items-center">
            <span class="text-xl">{{ group.list.length }}</span>
          </div>
        </Card>
      </ListItem>
    </template>
  </List>

  <DrawerUpdateGroup :use="drawerUpdateGroup" />
  <DrawerWordList :use="drawerWordList" />
</template>
