<script lang="ts" setup>
import { Button, Card, List, ListItem } from 'ant-design-vue'
import { layoutHeaderRightSlotRef } from '~/options/layout/components/LayoutHeader.vue'
import DrawerWordList from './components/DrawerWordList.vue'
import { type Group, listGrid, useBookList } from './composables/useBookList'
import { useDrawerWordList } from './composables/useDrawerWordList'

defineOptions({ name: 'BookList' })

const drawerWordList = useDrawerWordList()
const { groups } = useBookList()
</script>

<template>
  <Teleport v-if="layoutHeaderRightSlotRef" :to="layoutHeaderRightSlotRef">
    <Button type="primary" @click="drawerWordList.handleOpen">
      编辑单词列表
    </Button>
  </Teleport>

  <List class="pb-6" :grid="listGrid" :data-source="groups">
    <template #renderItem="{ item }: { item: Group }">
      <ListItem class="!mb-0 mt-6">
        <Card :title="item.name">
          <div class="flex justify-between items-center">
            <span class="text-xl">{{ item.count }}</span>
          </div>
        </Card>
      </ListItem>
    </template>
  </List>

  <DrawerWordList :use="drawerWordList" />
</template>
