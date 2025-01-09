<script lang="ts" setup>
import type { ListGridType } from 'ant-design-vue/es/list'
import { Button, Card, List, ListItem } from 'ant-design-vue'
import DrawerWordList from './components/DrawerWordList.vue'
import { type Group, useBookList } from './composables/useBookList'
import { useDrawerWordList } from './composables/useDrawerWordList'

defineOptions({ name: 'BookList' })

const drawerWordList = useDrawerWordList()
const { groups } = useBookList()

const listGrid: ListGridType = {
  xs: 1,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
  xxl: 5,
}
</script>

<template>
  <List class="pb-6" :grid="listGrid" :data-source="groups">
    <template #renderItem="{ item }: { item: Group }">
      <ListItem class="!mb-0 mt-6">
        <Card :title="item.name">
          <div class="flex justify-between items-center">
            <span class="text-xl">{{ item.count }}</span>

            <Button @click="drawerWordList.open.value = true">
              编辑
            </Button>
          </div>
        </Card>
      </ListItem>
    </template>
  </List>

  <DrawerWordList :use="drawerWordList" />
</template>
