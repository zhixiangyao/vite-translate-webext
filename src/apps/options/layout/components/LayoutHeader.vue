<script lang="ts" setup>
import { useDark } from '@vueuse/core'
import { theme } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import { views } from '~/apps/options/router'

defineOptions({ name: 'LayoutHeader' })

const { token } = theme.useToken()
const route = useRoute()
const isDark = useDark()
const view = computed(() => views.find(view => view.name === route.name))
</script>

<script lang="ts">
export const layoutHeaderRightSlotRef = ref<HTMLDivElement>()
</script>

<template>
  <header :style="{ backgroundColor: token.colorBgContainer }">
    <div :title="route.name?.toString()">
      {{ view?.title ?? route.name }}
    </div>

    <div class="flex gap-4 items-center">
      <div ref="layoutHeaderRightSlotRef" class="flex gap-2 items-center" />

      <WSwitch v-model:checked="isDark" :color="token.colorPrimary" />
    </div>
  </header>
</template>

<style scoped>
header {
  @apply grid-col-start-2 grid-col-end-3 grid-row-start-1 grid-row-end-2;
  @apply flex items-center justify-between font-500 p-1;
}
</style>
