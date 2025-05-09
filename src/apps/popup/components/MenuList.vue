<script setup lang="ts">
import type { TRecordWebsite } from '~/storage'
import { useLang } from '~/composables/useLang'
import { storageSettings, storageWebsiteList } from '~/storage'

defineOptions({ name: 'MenuList' })

const lang = useLang()
const host = ref('')
const website = computed<TRecordWebsite | undefined>(() =>
  host.value ? storageWebsiteList.value.find(item => item.url === host.value) : void 0,
)

function handleOpenDashboard() {
  browser.runtime.openOptionsPage()
}

async function handleOpenWebsiteList() {
  const optionsUrl = `${browser.runtime.getURL('/dist/options/index.html#/website-list')}`

  await browser.tabs.create({ url: optionsUrl })
}

async function handleOpenSettings() {
  const optionsUrl = `${browser.runtime.getURL('/dist/options/index.html#/settings')}`

  await browser.tabs.create({ url: optionsUrl })
}

function handleGlobalEnable() {
  storageSettings.value.globalEnable = !storageSettings.value.globalEnable
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

  <WButton dark align="left" class="w-full" @click="handleOpenWebsiteList">
    {{ lang('Website List') }}
  </WButton>

  <WButton dark align="left" class="w-full" @click="handleOpenSettings">
    {{ lang('Settings') }}
  </WButton>

  <WButton
    dark
    align="left"
    class="w-full global-enable"
    :class="{ activity: storageSettings.globalEnable }"
    @click="handleGlobalEnable"
  >
    {{ lang('Global Enable') }}
  </WButton>

  <WButton
    v-if="host && storageSettings.globalEnable"
    dark
    align="left"
    class="w-full enabled"
    :class="{ activity: website?.enable }"
    @click="handleEnable"
  >
    {{ lang('Enable') }}
  </WButton>
</template>

<style scoped>
button.global-enable,
button.enabled {
  position: relative;

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
