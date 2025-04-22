<script lang="ts" setup>
import type { StyleValue } from 'vue'
import { EnumLayout } from '~/constant/enum'
import { storageSettings } from '~/storage'
import HeaderBottom from './components/HeaderBottom.vue'
import HeaderTop from './components/HeaderTop.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutMain from './components/LayoutMain.vue'
import LayoutNav from './components/LayoutNav.vue'
import { useCollapsed } from './composables/useCollapsed'
import { useView } from './composables/useView'

defineOptions({ name: 'Layout' })

const collapsed = useCollapsed()
const view = useView()
const cachedViewNames = computed(() => view.list.value.map(item => item.name))
const layoutClassMap = computed(() => {
  if (storageSettings.value.theme.layout === EnumLayout.RIGHT) {
    return {
      nav: 'grid-col-start-2 grid-col-end-3 grid-row-start-1 grid-row-end-3',
      header: 'grid-col-start-1 grid-col-end-2 grid-row-start-1 grid-row-end-2',
      main: 'grid-col-start-1 grid-col-end-2 grid-row-start-2 grid-row-end-3',
    }
  }

  return {
    nav: 'grid-col-start-1 grid-col-end-2 grid-row-start-1 grid-row-end-3',
    header: 'grid-col-start-2 grid-col-end-3 grid-row-start-1 grid-row-end-2',
    main: 'grid-col-start-2 grid-col-end-3 grid-row-start-2 grid-row-end-3',
  }
})
const layoutStyle = computed<StyleValue>(() => {
  const width = collapsed.value ? 80 : 200

  return {
    gridTemplateColumns: storageSettings.value.theme.layout === EnumLayout.RIGHT ? `1fr ${width}px` : `${width}px  1fr`,
    gridTemplateRows: '40px 1fr',
  }
})
</script>

<template>
  <div class="h-screen w-screen grid gap-1" :style="layoutStyle">
    <LayoutNav :collapsed="collapsed" :class="layoutClassMap.nav">
      <template #top>
        <HeaderTop :collapsed="collapsed" />
      </template>

      <template #bottom>
        <HeaderBottom v-model:collapsed="collapsed" />
      </template>
    </LayoutNav>

    <LayoutHeader :class="layoutClassMap.header" :use="view" />

    <LayoutMain :class="layoutClassMap.main" :cached-view-names="cachedViewNames" />
  </div>
</template>
