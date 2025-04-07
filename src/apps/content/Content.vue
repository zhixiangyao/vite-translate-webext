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
}

defineProps<Props>()

useRegisterI18n()
const modalRef = useTemplateRef('modal-translate')
const debounceHighlight = useDebounceFn(highlight, 500)
const focused = useWindowFocus()
const show = computed(() => {
  const website = storageWebsiteList.value.find(item => item.url === location.host)

  return website?.enable ?? false
})
const words = computed(() => {
  return storageWordList.value.map(value => value.word).filter(word => !!word)
})
const tabId = ref<number>()
const scope = effectScope()

/** 更新 tabId 只要一次 */
function updateTabId([id, focused]: [number | undefined, boolean]) {
  if (id && focused && !tabId.value) {
    tabId.value = id
  }
}

/** 更新 icon 要实时 */
function updateIcon() {
  if (focused.value === false || tabId.value === void 0) {
    return
  }

  sendMessage('event-icon', { show: show.value, tabId: tabId.value }, 'background').catch()
}

/** 更新 page 要实时 */
async function updatePage() {
  if (!focused.value) {
    return
  }

  if (show.value) {
    debounceHighlight(words.value)
  }
  else {
    unhighlight()
  }
}

/** 更新 style 要实时 */
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

function search(text: string, left: number, top: number) {
  modalRef.value?.show(text, left, top)
}

scope.run(() => {
  watch([() => storageCurrentTab.value.id, focused], updateTabId)
  watch([show, focused, tabId], updateIcon, { immediate: true })
  watch([show, focused], updatePage, { immediate: true })
  watch([words, focused], updatePage, { deep: true })
  watch([() => storageSettings.value.highlight, focused], updateStyle, { immediate: true })
})

onUnmounted(scope.stop)
</script>

<template>
  <ModalTranslate ref="modal-translate" :root="root" />

  <ModalSearch :disabled="!!modalRef?.state.open" :root="root" @search="search" />
</template>
