<script setup lang="ts">
import { storageActivityWebsiteMap } from '~/logic/storage'

const key = ref('')

function handleOpenOptionsPage() {
  browser.runtime.openOptionsPage()
}

function handleEnable() {
  if (!key.value || !storageActivityWebsiteMap.value)
    return

  storageActivityWebsiteMap.value[key.value] = !storageActivityWebsiteMap.value[key.value]
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
  <main class="popup">
    <WButton dark align="left" class="w-full" @click="handleOpenOptionsPage">
      Open Options
    </WButton>

    <WButton
      v-if="key"
      dark
      align="left"
      class="w-full relative"
      :class="{ activity: storageActivityWebsiteMap[key] }"
      @click="handleEnable"
    >
      Enable
    </WButton>
  </main>
</template>

<style scoped>
main.popup {
  @apply w-[160px] p-1 bg-black flex flex-col gap-1;

  > button:nth-of-type(2) {
    &::after {
      content: '';
      top: 50%;
      right: 16px;
      transform: translateY(-50%);

      @apply absolute w-2 h-2 bg-gray rounded-full;
    }

    &.activity::after {
      @apply bg-green;
    }
  }
}
</style>
