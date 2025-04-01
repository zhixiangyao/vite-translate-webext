<script lang="ts" setup>
import { theme } from 'ant-design-vue'

defineOptions({ name: 'LayoutMain' })
defineProps<{ cachedViewNames: string[] }>()

const { token } = theme.useToken()
</script>

<template>
  <main :style="{ backgroundColor: token.colorBgContainer }">
    <router-view v-slot="{ Component, route }">
      <keep-alive :include="cachedViewNames">
        <component :is="Component" :key="route.name" />
      </keep-alive>
    </router-view>
  </main>
</template>

<style scoped>
main {
  @apply grid-col-start-2 grid-col-end-3 grid-row-start-3 grid-row-end-4;
  @apply p-1 overflow-auto;
}
</style>
