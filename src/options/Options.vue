<script lang="ts" setup>
import { useUrlSearchParams } from '@vueuse/core'
import { TabPane, Tabs } from 'ant-design-vue'

import BookList from './components/TabBookList/index.vue'
import Setting from './components/TabSetting/index.vue'

enum EnumTabKey {
  BookList = '1',
  Setting = '2',
}

const params = useUrlSearchParams<{ tab: EnumTabKey }>('history', { initialValue: { tab: EnumTabKey.BookList } })
</script>

<template>
  <main class="p-2 text-gray-700 dark:text-gray-200">
    <Tabs v-model:active-key="params.tab">
      <TabPane :key="EnumTabKey.BookList" tab="单词本">
        <BookList />
      </TabPane>
      <TabPane :key="EnumTabKey.Setting" tab="Setting" force-render>
        <Setting />
      </TabPane>
    </Tabs>
  </main>
</template>
