<script setup lang="ts">
import type { ConfigProviderProps } from 'ant-design-vue'
import type { AliasToken, SeedToken } from 'ant-design-vue/es/theme/internal'
import { useDark } from '@vueuse/core'
import { App, ConfigProvider, theme } from 'ant-design-vue'

defineOptions({ name: 'AntProvider' })

const token: Partial<AliasToken> = {
  borderRadius: 2,
  colorPrimary: '#A0D911',
}
const seed: SeedToken = { ...theme.defaultSeed, ...token }
const tokenDark = theme.darkAlgorithm(seed)
const tokenLight = theme.defaultAlgorithm(seed)

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
