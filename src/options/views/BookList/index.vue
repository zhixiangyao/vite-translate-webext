<script lang="ts" setup>
import type { ListGridType } from 'ant-design-vue/es/list'
import type { TRecordGroup } from '~/logic/storage'
import { Button, Card, List, ListItem } from 'ant-design-vue'
import { layoutHeaderRightSlotRef } from '~/options/layout/components/LayoutHeader.vue'
import DrawerUpdateGroup from './components/DrawerUpdateGroup.vue'
import DrawerWordList from './components/DrawerWordList.vue'
import { useDrawerUpdateGroup } from './composables/useDrawerUpdateGroup'
import { useDrawerWordList } from './composables/useDrawerWordList'

defineOptions({ name: 'BookList' })

const listGrid: ListGridType = { sm: 1, md: 2, lg: 3, xl: 4, xxl: 5 }

const drawerWordList = useDrawerWordList()
const drawerUpdateGroup = useDrawerUpdateGroup()
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
        <Card :title="item.name">
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
