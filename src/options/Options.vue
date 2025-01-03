<script setup lang="ts">
import AntProvider from '~/options/components/AntProvider.vue'
</script>

<template>
  <AntProvider>
    <router-view />
  </AntProvider>
</template>

<style>
html {
  --dark-bg-color: #000;
  --light-bg-color: #f5f5f5;

  #app {
    background-color: var(--light-bg-color);
  }

  &.dark #app {
    background-color: var(--dark-bg-color);
  }
}
</style>
