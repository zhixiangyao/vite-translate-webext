<script lang="ts" setup>
import HeaderTop from './components/HeaderTop.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutMain from './components/LayoutMain.vue'
import LayoutNav from './components/LayoutNav.vue'

defineOptions({ name: 'Layout' })
</script>

<template>
  <div class="layout">
    <LayoutNav>
      <template #top>
        <HeaderTop />
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
  grid-template-columns: 200px 1fr;
  grid-template-rows: 48px 1fr;
}
</style>
