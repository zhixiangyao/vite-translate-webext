<script setup lang="ts">
import { useDebounceFn, useWindowFocus } from '@vueuse/core'
import { sendMessage } from 'webext-bridge/content-script'
import ModalSearch from '~/components/ModalSearch/index.vue'
import ModalTranslate from '~/components/ModalTranslate/index.vue'
import { highlight, unhighlight } from '~/logic/highlight'
import { storageCurrentTab, storageSettings, storageWebsiteList, storageWordList } from '~/logic/storage'

defineProps<{ root?: HTMLElement }>()

const ref = useTemplateRef('modal-translate')
const debounceHighlight = useDebounceFn(highlight, 500)
const focused = useWindowFocus()
const enable = computed(() => {
  if (!location.protocol.includes('http'))
    return false
  const website = storageWebsiteList.value.find(item => item.url === location.host)

  return website?.enable ?? false
})
const words = computed(() => {
  return storageWordList.value.map(value => value.word).filter(word => !!word)
})

/** 更新 page 要实时 */
async function updatePage() {
  if (!focused.value) {
    return
  }

  if (enable.value) {
    debounceHighlight(words.value)
  }
  else {
    unhighlight()
  }
}

/** 更新 icon 要实时 */
async function updateIcon() {
  const tabId = storageCurrentTab.value.id

  if (focused.value === false || tabId === void 0) {
    return
  }

  try {
    await sendMessage('event-activity', { show: enable.value, tabId }, 'background')
  }
  catch (err) {
    console.error('Message failed [event-activity]:', err)
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
  ref.value?.show(text, left, top)
}

watch([enable, focused], updateIcon, { immediate: true })
watch([enable, focused], updatePage, { immediate: true })
watch([words, focused], updatePage, { deep: true })
watch([() => storageSettings.value.highlight, focused], updateStyle, { immediate: true })
</script>

<template>
  <ModalTranslate ref="modal-translate" :root="root" />

  <ModalSearch :disabled="!!ref?.state.open" :root="root" @search="search" />
</template>
