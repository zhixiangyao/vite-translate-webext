<script lang="ts" setup>
import type { ItemType, MenuProps } from 'ant-design-vue'
import { Menu, theme } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { views } from '~/options/router'

defineOptions({ name: 'LayoutNav' })
const props = defineProps<{ collapsed?: boolean }>()

const items = views.map<ItemType>(view => ({
  key: view.name,
  icon: view.icon,
  label: view.title,
  title: view.title,
}))

const { token } = theme.useToken()
const route = useRoute()
const router = useRouter()
const selectedKeys = ref<string[]>([])

const handleClick: MenuProps['onClick'] = (menuInfo) => {
  router.push({ name: menuInfo.key.toString(), query: { collapsed: String(props.collapsed) } })
}

watch(route, to => to.name && (selectedKeys.value = [to.name.toString()]), { immediate: true })
</script>

<template>
  <nav :style="{ backgroundColor: token.colorBgContainer }">
    <slot name="top" />
    <Menu
      :selected-keys="selectedKeys"
      class="!border-none"
      mode="inline"
      :items="items"
      :inline-collapsed="collapsed"
      @click="handleClick"
    />
    <slot name="bottom" />
  </nav>
</template>

<style scoped>
nav {
  @apply grid-col-start-1 grid-col-end-2 grid-row-start-1 grid-row-end-4;
  @apply flex flex-col flex-shrink-0;
}
</style>
