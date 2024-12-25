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
    <nav>
      <Menu
        v-model:selected-keys="state.selectedKeys"
        class="h-full bg-#f0f0f0 !border-none"
        mode="vertical"
        :items="items"
        @click="handleClick"
      />
    </nav>

    <header />

    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout {
  grid-template-columns: 200px 1fr;
  grid-template-rows: 48px 1fr;

  @apply h-screen w-screen;
  @apply grid gap-1;

  > nav {
    @apply grid-col-start-1 grid-col-end-2 grid-row-start-1 grid-row-end-3;
    @apply flex flex-col justify-between flex-shrink-0;
  }

  > header {
    @apply grid-col-start-2 grid-col-end-3 grid-row-start-1 grid-row-end-2;
    @apply bg-gray-100 p-1;
  }

  > main {
    @apply grid-col-start-2 grid-col-end-3 grid-row-start-2 grid-row-end-3;
    @apply overflow-auto p-1;
  }
}
</style>
