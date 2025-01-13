<script setup lang="ts">
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import { theme } from 'ant-design-vue'

defineOptions({ name: 'HeaderBottom' })

const { token } = theme.useToken()
const collapsed = defineModel<boolean>('collapsed', { default: false })
</script>

<template>
  <div class="header-bottom" @click="collapsed = !collapsed">
    <MenuUnfoldOutlined v-if="collapsed" :style="{ color: token.colorPrimary }" />
    <MenuFoldOutlined v-else :style="{ color: token.colorPrimary }" />
  </div>
</template>

<style scoped>
.header-bottom {
  @apply flex justify-center items-center;
  @apply mt-auto px-1 h-10 cursor-pointer select-none;
  @apply border-t-4 border-t-solid;
}

html .header-bottom {
  border-top-color: var(--light-bg-color);
}

html.dark .header-bottom {
  border-top-color: var(--dark-bg-color);
}
</style>
