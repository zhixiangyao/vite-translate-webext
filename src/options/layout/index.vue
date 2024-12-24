<script lang="ts" setup>
import type { ItemType, MenuProps } from 'ant-design-vue'
import { Menu } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { views } from '../router'

const route = useRoute()
const router = useRouter()
const selectedKeys = ref<string[]>([route.name!.toString()])
const items = views.map<ItemType>(view => ({
  key: view.name,
  icon: view.icon,
  label: view.title,
  title: view.title,
}))
const handleClick: MenuProps['onClick'] = (menuInfo) => {
  router.push({ name: menuInfo.key.toString() })
}
</script>

<template>
  <div class="layout">
    <Menu v-model:selected-keys="selectedKeys" mode="vertical" :items="items" @click="handleClick" />

    <main class="p-2 text-gray-700 dark:text-gray-200">
      <router-view />
    </main>
  </div>
</template>

<style>
.layout {
  grid-template-columns: 200px 1fr;

  @apply grid h-screen w-screen;
}
</style>
