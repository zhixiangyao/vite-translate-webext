<script lang="ts" setup>
import { Select, theme } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import { views } from '~/apps/options/router'
import SwitchTheme from '~/components/SwitchTheme/index.vue'
import { useLang } from '~/composables/useLang'
import { useLangSwitch } from '~/composables/useLangSwitch'

defineOptions({ name: 'LayoutHeader' })

const { token } = theme.useToken()
const route = useRoute()
const langSwitch = useLangSwitch()
const lang = useLang()
const view = computed(() => views.find(view => view.name === route.name))
const title = computed(() => view.value?.title ?? route.name?.toString() ?? '')
</script>

<script lang="ts">
export const layoutHeaderRightSlotRef = ref<HTMLDivElement>()
</script>

<template>
  <header :style="{ backgroundColor: token.colorBgContainer }">
    <div :title="lang(title)">
      {{ lang(title) }}
    </div>

    <div class="flex gap-2 items-center">
      <div ref="layoutHeaderRightSlotRef" class="flex gap-2 items-center" />

      <Select
        v-model:value="langSwitch"
        size="small"
        class="w-[85px]"
        :options="[
          { label: 'English', value: 'en' },
          { label: '中文', value: 'zh' },
        ]"
      />
      <SwitchTheme />
    </div>
  </header>
</template>

<style scoped>
header {
  @apply grid-col-start-2 grid-col-end-3 grid-row-start-1 grid-row-end-2;
  @apply flex items-center justify-between font-500 p-1;
}
</style>
