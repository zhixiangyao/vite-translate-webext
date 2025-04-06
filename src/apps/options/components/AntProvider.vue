<script lang="ts" setup>
import type { ConfigProviderProps } from 'ant-design-vue'
import type { AliasToken, SeedToken } from 'ant-design-vue/es/theme/internal'
import { useDark } from '@vueuse/core'
import { App, ConfigProvider, theme } from 'ant-design-vue'
import { storageSettings } from '~/storage'

defineOptions({ name: 'AntProvider' })

const isDark = useDark()
const token = reactive<Partial<AliasToken>>({
  borderRadius: 2,
  colorPrimary: storageSettings.value.theme.color,
})
const seed = computed<SeedToken>(() => ({ ...theme.defaultSeed, ...token }))
const tokenDark = computed(() => theme.darkAlgorithm(seed.value))
const tokenLight = computed(() => theme.defaultAlgorithm(seed.value))
const defaultTheme = computed<ConfigProviderProps['theme']>(() => {
  return {
    token: isDark.value ? tokenDark.value : tokenLight.value,
  }
})

watch(storageSettings, setting => (token.colorPrimary = setting.theme.color))
</script>

<template>
  <ConfigProvider :theme="defaultTheme">
    <App class="min-h-screen min-w-screen">
      <slot />
    </App>
  </ConfigProvider>
</template>
