<script lang="ts" setup>
import { useDark } from '@vueuse/core'
import { theme } from 'ant-design-vue'
import { useRoute } from 'vue-router'

defineOptions({ name: 'LayoutHeader' })

const { token } = theme.useToken()
const route = useRoute()
const isDark = useDark()
</script>

<template>
  <header>
    {{ route.name }}

    <WSwitch v-model:checked="isDark" :color="token.colorPrimary" />
  </header>
</template>

<style scoped>
header {
  @apply grid-col-start-2 grid-col-end-3 grid-row-start-1 grid-row-end-2;
  @apply flex items-center justify-between font-500 p-1;
  background-color: v-bind('token.colorBgContainer');
}
</style>
