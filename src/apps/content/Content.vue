<script setup lang="ts">
import { useDebounceFn, useWindowFocus } from '@vueuse/core'
import { sendMessage } from 'webext-bridge/content-script'
import ModalSearch from '~/components/ModalSearch/index.vue'
import ModalTranslate from '~/components/ModalTranslate/index.vue'
import { useRegisterI18n } from '~/i18n'
import { storageCurrentTab, storageSettings, storageWebsiteList, storageWordList } from '~/storage'
import { highlight, unhighlight } from '~/utils/highlight'

interface Props {
  root?: HTMLElement
  alwaysShow?: boolean
}

const props = defineProps<Props>()

useRegisterI18n()
const modalRef = useTemplateRef('modal-translate')
const debounceHighlight = useDebounceFn(highlight, 500)
const focused = useWindowFocus()
const globalEnable = computed(() => storageSettings.value.globalEnable || props.alwaysShow)
const enable = computed(() => {
  const website = storageWebsiteList.value.find(item => item.url === location.host)

  return website?.enable ?? false
})
const words = computed(() => {
  return storageWordList.value.map(value => value.word).filter(word => !!word)
})
const tabId = ref<number>()
const scope = effectScope()

function updateTabId([id, focused]: [number | undefined, boolean]) {
  if (id && focused && !tabId.value) {
    tabId.value = id
  }
}

function updateIcon() {
  if (focused.value === false || tabId.value === void 0) {
    return
  }

  sendMessage('event-icon', { show: enable.value && globalEnable.value, tabId: tabId.value }, 'background').catch()
}

function updatePage() {
  if (!focused.value) {
    return
  }

  if (enable.value && globalEnable.value) {
    debounceHighlight(words.value)
  }
  else {
    unhighlight()
  }
}

function updateStyle() {
  if (!focused.value) {
    return
  }

  const id = `style-${__NAME__}`
  const oldStyle = document.head.querySelector(`#${id}`)
  oldStyle && document.head.removeChild(oldStyle)

  const style = document.createElement('style')
  style.id = id
  style.innerHTML = storageSettings.value.highlight.style
  document.head.appendChild(style)
}

function handleSearch(text: string, left: number, top: number) {
  modalRef.value?.show(text, left, top)
}

scope.run(() => {
  /** 更新 tabId */
  watch([() => storageCurrentTab.value.id, focused], updateTabId)
  /** 更新 icon */
  watch([globalEnable, enable, focused, tabId], updateIcon, { immediate: true })
  /** 更新 page */
  watch([globalEnable, enable, focused], updatePage, { immediate: true })
  watch([globalEnable, words, focused], updatePage, { deep: true })
  /** 更新 style */
  watch([() => storageSettings.value.highlight, focused], updateStyle, { immediate: true })
})

onUnmounted(scope.stop)
</script>

<template>
  <template v-if="globalEnable">
    <ModalTranslate ref="modal-translate" :root="root" />

    <ModalSearch :disabled="!!modalRef?.state.open" :root="root" @search="handleSearch" />
  </template>
</template>
