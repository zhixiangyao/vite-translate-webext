<script lang="ts" setup>
import type { ItemType, MenuProps } from 'ant-design-vue'
import { Menu } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { views } from '../router'

const items = views.map<ItemType>(view => ({
  key: view.name,
  icon: view.icon,
  label: view.title,
  title: view.title,
}))

const route = useRoute()
const router = useRouter()
const state = reactive({
  selectedKeys: [route.name!.toString()],
})

const handleClick: MenuProps['onClick'] = (menuInfo) => {
  router.push({ name: menuInfo.key.toString() })
}
</script>

<template>
  <div class="layout">
    <nav class="nav">
      <Menu
        v-model:selected-keys="state.selectedKeys"
        class="h-full bg-#f0f0f0 !border-none"
        mode="vertical"
        :items="items"
        @click="handleClick"
      />
    </nav>

    <main class="p-2 text-gray-700 dark:text-gray-200 flex-shrink-0">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout {
  grid-template-columns: 200px 1fr;

  @apply grid h-screen w-screen;

  .nav {
    @apply flex flex-col justify-between flex-shrink-0;

    :deep(.ant-menu-item.ant-menu-item-selected) {
      @apply bg-sky-200;
    }
  }
}
</style>
