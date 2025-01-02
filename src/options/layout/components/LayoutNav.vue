<script lang="ts" setup>
import type { ItemType, MenuProps } from 'ant-design-vue'
import { Menu } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { views } from '../../router'

defineOptions({ name: 'LayoutNav' })

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
  <nav>
    <Menu
      v-model:selected-keys="state.selectedKeys"
      class="h-full !border-none"
      mode="vertical"
      :items="items"
      @click="handleClick"
    />
  </nav>
</template>

<style scoped>
nav {
  @apply grid-col-start-1 grid-col-end-2 grid-row-start-1 grid-row-end-3;
  @apply flex flex-col justify-between flex-shrink-0;
}
</style>
