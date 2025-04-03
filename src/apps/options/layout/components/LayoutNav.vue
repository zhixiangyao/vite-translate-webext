<script lang="ts" setup>
import type { ItemType, MenuProps } from 'ant-design-vue'
import { Menu, theme } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { views } from '~/apps/options/router'
import { useLang } from '~/composables/useLang'

defineOptions({ name: 'LayoutNav' })
defineProps<{ collapsed?: boolean }>()

const { token } = theme.useToken()
const lang = useLang()
const route = useRoute()
const router = useRouter()
const selectedKeys = ref<string[]>([])
const items = computed(() =>
  views.map<ItemType>(view => ({
    key: view.name,
    icon: view.icon,
    label: lang(view.title),
    title: lang(view.title),
  })),
)

const handleClick: MenuProps['onClick'] = (menuInfo) => {
  router.push({ name: menuInfo.key.toString() })
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

  :deep(.ant-menu-title-content) {
    @apply select-none;
  }
}
</style>
