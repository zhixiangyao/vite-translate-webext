<script lang="ts" setup>
import HeaderBottom from './components/HeaderBottom.vue'
import HeaderTop from './components/HeaderTop.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutMain from './components/LayoutMain.vue'
import LayoutNav from './components/LayoutNav.vue'
import LayoutViewTab from './components/LayoutViewTab.vue'
import { useCollapsed } from './composables/useCollapsed'
import { useView } from './composables/useView'

defineOptions({ name: 'Layout' })

const collapsed = useCollapsed()
const view = useView()
const cachedViewNames = computed(() => view.list.value.map(item => item.name))
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

    <LayoutViewTab :use="view" />

    <LayoutMain :cached-view-names="cachedViewNames" />
  </div>
</template>

<style scoped>
.layout {
  @apply h-screen w-screen;
  @apply grid gap-1;
  grid-template-columns: v-bind('`${collapsed ? 80 : 200}px 1fr`');
  grid-template-rows: 40px 30px 1fr;
}
</style>
