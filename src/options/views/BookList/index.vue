<script lang="ts" setup>
import type { ListGridType } from 'ant-design-vue/es/list'
import { EditOutlined } from '@ant-design/icons-vue'
import { Button, Card, List, ListItem, theme } from 'ant-design-vue'
import { storageGroupList, storageWordList, type TRecordGroup } from '~/logic/storage'
import ButtonLongPress from '~/options/components/ButtonLongPress.vue'
import { layoutHeaderRightSlotRef } from '~/options/layout/components/LayoutHeader.vue'
import DrawerUpdateGroup from './components/DrawerUpdateGroup.vue'
import DrawerWordList from './components/DrawerWordList.vue'
import { useDrawerUpdateGroup } from './composables/useDrawerUpdateGroup'
import { useDrawerWordList } from './composables/useDrawerWordList'

defineOptions({ name: 'BookList' })

const listGrid: ListGridType = { sm: 1, md: 2, lg: 3, xl: 4, xxl: 5 }
const { token } = theme.useToken()
const drawerWordList = useDrawerWordList()
const drawerUpdateGroup = useDrawerUpdateGroup()

function handleDeleteGroup(name: TRecordGroup['name']) {
  const index = storageGroupList.value.findIndex(group => group.name === name)
  if (index !== -1) {
    storageGroupList.value.splice(index, 1)
    storageWordList.value.forEach((word) => {
      if (word.group === name)
        word.group = void 0
    })
  }
}
</script>

<template>
  <Teleport v-if="layoutHeaderRightSlotRef" :to="layoutHeaderRightSlotRef">
    <Button @click="() => drawerUpdateGroup.handleOpen()">
      添加组
    </Button>

    <Button @click="drawerWordList.handleOpen">
      编辑单词列表
    </Button>
  </Teleport>

  <List class="pb-6" :grid="listGrid" :data-source="drawerUpdateGroup.groupList.value">
    <template #renderItem="{ item }: { item: TRecordGroup }">
      <ListItem class="!mb-0 mt-6">
        <Card>
          <template #title>
            <div class="flex gap-2 items-center">
              <WIconWrapper :color="token.colorPrimary">
                <EditOutlined />
              </WIconWrapper>
              <span class="text-sm">{{ item.name }}</span>
            </div>
          </template>
          <template #extra>
            <ButtonLongPress
              danger
              type="link"
              class="p-0"
              :delay="2000"
              title="长按删除"
              @press="() => handleDeleteGroup(item.name)"
            >
              删除
            </ButtonLongPress>
          </template>
          <div class="flex justify-between items-center">
            <span class="text-xl">{{ item.list.length }}</span>
          </div>
        </Card>
      </ListItem>
    </template>
  </List>

  <DrawerUpdateGroup :use="drawerUpdateGroup" />
  <DrawerWordList :use="drawerWordList" />
</template>
