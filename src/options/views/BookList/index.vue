<script lang="ts" setup>
import type { TRecordGroup } from '~/logic/storage'
import { Button, Card, List, ListItem } from 'ant-design-vue'
import { layoutHeaderRightSlotRef } from '~/options/layout/components/LayoutHeader.vue'
import DrawerWordList from './components/DrawerWordList.vue'
import { listGrid, useBookList } from './composables/useBookList'
import { useDrawerWordList } from './composables/useDrawerWordList'

defineOptions({ name: 'BookList' })

const drawerWordList = useDrawerWordList()
const { groups } = useBookList()
</script>

<template>
  <Teleport v-if="layoutHeaderRightSlotRef" :to="layoutHeaderRightSlotRef">
    <Button> 添加组 </Button>

    <Button @click="drawerWordList.handleOpen">
      编辑单词列表
    </Button>
  </Teleport>

  <List class="pb-6" :grid="listGrid" :data-source="groups">
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

  <DrawerWordList :use="drawerWordList" />
</template>
