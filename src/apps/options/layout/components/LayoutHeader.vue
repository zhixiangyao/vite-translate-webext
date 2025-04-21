<script lang="ts" setup>
import { theme } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import { views } from '~/apps/options/router'
import SwitchTheme from '~/components/SwitchTheme/index.vue'
import { useLang } from '~/composables/useLang'

defineOptions({ name: 'LayoutHeader' })

const { token } = theme.useToken()
const route = useRoute()

const lang = useLang()
const view = computed(() => views.find(view => view.name === route.name))
const title = computed(() => view.value?.title ?? route.name?.toString() ?? '')
</script>

<script lang="ts">
export const layoutHeaderRightSlotRef = ref<HTMLDivElement>()
</script>

<template>
  <header class="flex items-center justify-between font-500 p-1" :style="{ backgroundColor: token.colorBgContainer }">
    <div :title="lang(title)">
      {{ lang(title) }}
    </div>

    <div class="flex gap-2 items-center">
      <div ref="layoutHeaderRightSlotRef" class="flex gap-2 items-center" />

      <SwitchTheme />
    </div>
  </header>
</template>
