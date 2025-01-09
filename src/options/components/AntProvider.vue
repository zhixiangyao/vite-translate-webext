<script setup lang="ts">
import type { ConfigProviderProps } from 'ant-design-vue'
import type { SeedToken } from 'ant-design-vue/es/theme/internal'
import { useDark } from '@vueuse/core'
import { App, ConfigProvider, theme } from 'ant-design-vue'

defineOptions({ name: 'AntProvider' })

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
    <App class="min-h-screen min-w-screen">
      <slot />
    </App>
  </ConfigProvider>
</template>
