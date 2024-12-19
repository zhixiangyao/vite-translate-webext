<script setup lang="ts">
import { Switch } from 'ant-design-vue'

import { storageActivityWebsiteMap } from '~/logic'

const key = ref('')

function openOptionsPage() {
  browser.runtime.openOptionsPage()
}

async function updateKey() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true })

  if (!tab.url)
    return

  const { host, protocol } = new URL(tab.url)

  if (protocol.includes('http')) {
    key.value = host
  }
}

onMounted(updateKey)
</script>

<template>
  <main class="w-[160px] p-2 text-gray-700">
    <WButton class="mb-2 w-full" @click="openOptionsPage">
      Open Options
    </WButton>

    <Switch v-if="key" v-model:checked="storageActivityWebsiteMap[key]" />
  </main>
</template>
