<script lang="ts" setup>
import { theme } from 'ant-design-vue'

defineOptions({ name: 'LayoutMain' })
defineProps<{ cachedViewNames: string[] }>()

const { token } = theme.useToken()
</script>

<template>
  <main class="p-1 overflow-auto" :style="{ backgroundColor: token.colorBgContainer }">
    <router-view v-slot="{ Component, route }">
      <keep-alive :include="cachedViewNames">
        <component :is="Component" :key="route.name" />
      </keep-alive>
    </router-view>
  </main>
</template>
