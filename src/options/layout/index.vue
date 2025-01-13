<script lang="ts" setup>
import { useUrlSearchParams } from '@vueuse/core'
import HeaderBottom from './components/HeaderBottom.vue'
import HeaderTop from './components/HeaderTop.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutMain from './components/LayoutMain.vue'
import LayoutNav from './components/LayoutNav.vue'

defineOptions({ name: 'Layout' })

const params = useUrlSearchParams<{ collapsed: 'true' | 'false' }>('hash', { initialValue: { collapsed: 'false' } })
const collapsed = computed<boolean>({
  get() {
    return params.collapsed === 'true'
  },
  set(bool) {
    params.collapsed = bool ? 'true' : 'false'
  },
})
</script>

<template>
  <div class="layout">
    <LayoutNav :collapsed="collapsed">
      <template #top>
        <HeaderTop :collapsed="collapsed" />
      </template>

      <template #bottom>
        <HeaderBottom v-model:collapsed="collapsed" />
      </template>
    </LayoutNav>

    <LayoutHeader />

    <LayoutMain />
  </div>
</template>

<style scoped>
.layout {
  @apply h-screen w-screen;
  @apply grid gap-1;
  grid-template-columns: v-bind('`${collapsed ? 80 : 200}px 1fr`');

  grid-template-rows: 48px 1fr;
}
</style>
