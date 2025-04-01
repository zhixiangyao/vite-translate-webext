<script setup lang="ts">
import AntProvider from '~/apps/options/components/AntProvider.vue'
</script>

<template>
  <AntProvider>
    <router-view />
  </AntProvider>
</template>

<style>
:root {
  --dark-bg-color: #000;
  --dark-second-bg-color: #282828;
  --light-bg-color: #f5f5f5;
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
