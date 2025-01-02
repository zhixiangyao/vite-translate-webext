<script lang="ts" setup>
import { theme } from 'ant-design-vue'

defineOptions({ name: 'LayoutMain' })

const { token } = theme.useToken()
</script>

<template>
  <main>
    <router-view />
  </main>
</template>

<style scoped>
main {
  @apply grid-col-start-2 grid-col-end-3 grid-row-start-2 grid-row-end-3;
  @apply p-1 overflow-auto;
  background-color: v-bind('token.colorBgContainer');
}
</style>
