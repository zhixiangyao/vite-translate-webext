<script setup lang="ts">
import { useRegisterI18n } from '~/i18n'
import MenuList from './components/MenuList.vue'

useRegisterI18n()
</script>

<template>
  <main class="w-[160px] p-1 bg-black flex flex-col gap-1">
    <MenuList />
  </main>
</template>
