<script setup lang="ts">
import type { ConfigProviderProps } from 'ant-design-vue'
import type { SeedToken } from 'ant-design-vue/es/theme/internal'
import { useDark } from '@vueuse/core'
import { App, ConfigProvider, theme } from 'ant-design-vue'

const tokenDark = theme.darkAlgorithm({
  ...theme.defaultSeed,
  borderRadius: 2,
  colorPrimary: '#A0D911',
} satisfies SeedToken)
const tokenLight = theme.defaultAlgorithm({
  ...theme.defaultSeed,
  borderRadius: 2,
  colorPrimary: '#A0D911',
} satisfies SeedToken)

const isDark = useDark()
const defaultTheme = computed<ConfigProviderProps['theme']>(() => ({
  token: isDark.value ? tokenDark : tokenLight,
}))
</script>

<template>
  <ConfigProvider :theme="defaultTheme">
    <App>
      <router-view />
    </App>
  </ConfigProvider>
</template>

<style>
html {
  --dark-bg-color: #000;
  --light-bg-color: #fafafa;

  #app {
    background-color: var(--light-bg-color);
  }

  &.dark #app {
    background-color: var(--dark-bg-color);
  }
}
</style>
