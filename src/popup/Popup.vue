<script setup lang="ts">
import { Button, Switch } from 'ant-design-vue'

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
    <div v-if="key">
      <Switch v-model:checked="storageActivityWebsiteMap[key]" />
    </div>

    <div>
      <Button type="primary" class="mt-2 w-full" @click="openOptionsPage">
        Open Options
      </Button>
    </div>
  </main>
</template>
