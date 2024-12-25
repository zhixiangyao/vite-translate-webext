<script setup lang="ts">
import type { ConfigProviderProps } from 'ant-design-vue'
import { App, ConfigProvider } from 'ant-design-vue'

const theme: ConfigProviderProps['theme'] = {
  token: {
    borderRadius: 0,
  },
}
</script>

<template>
  <ConfigProvider :theme="theme">
    <App>
      <router-view />
    </App>
  </ConfigProvider>
</template>
