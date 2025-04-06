<script setup lang="ts">
import type { TRecordWebsite } from '~/storage'
import { useLang } from '~/composables/useLang'
import { storageWebsiteList } from '~/storage'

defineOptions({ name: 'MenuList' })

const lang = useLang()
const host = ref('')
const website = computed<TRecordWebsite | undefined>(() =>
  host.value ? storageWebsiteList.value.find(item => item.url === host.value) : void 0,
)

function handleOpenDashboard() {
  browser.runtime.openOptionsPage()
}

function handleEnable() {
  if (!host.value || !storageWebsiteList.value)
    return

  const i = storageWebsiteList.value.findIndex(item => item.url === host.value)

  if (i !== -1) {
    storageWebsiteList.value[i].enable = !storageWebsiteList.value[i].enable
  }
  else {
    storageWebsiteList.value.push({ url: host.value, enable: true })
  }
}

async function updateKey() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true })

  if (!tab.url)
    return

  const url = new URL(tab.url)

  if (url.protocol.includes('http')) {
    host.value = url.host
  }
}

onMounted(updateKey)
</script>

<template>
  <WButton dark align="left" class="w-full" @click="handleOpenDashboard">
    {{ lang('Dashboard') }}
  </WButton>

  <WButton
    v-if="host"
    dark
    align="left"
    class="w-full relative"
    :class="{ activity: website?.enable }"
    @click="handleEnable"
  >
    {{ lang('Enable') }}
  </WButton>
</template>

<style scoped>
button:nth-of-type(2) {
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
</style>
