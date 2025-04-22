<script setup lang="ts">
import AntProvider from '~/apps/options/components/AntProvider.vue'
import { useLang } from '~/composables/useLang'
import { useRegisterI18n } from '~/i18n'

useRegisterI18n()
const lang = useLang()

watch(
  () => lang('Dashboard'),
  value => (document.title = value),
  { immediate: true },
)
</script>

<template>
  <AntProvider>
    <router-view />
  </AntProvider>
</template>

<style>
:root {
  --dark-bg-color: #181818;
  --dark-second-bg-color: #282828;
  --light-bg-color: #f0f0f0;
}

html {
  overflow: hidden;
}

html #app {
  background-color: var(--light-bg-color);
}

html.dark #app {
  background-color: var(--dark-bg-color);
}

html.dark * {
  scrollbar-color: var(--dark-bg-color) var(--dark-second-bg-color);
}
</style>
