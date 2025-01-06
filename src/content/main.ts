import { useDebounceFn } from '@vueuse/core'
import { sendMessage } from 'webext-bridge/content-script'
import { highlight, unhighlight } from '~/logic/highlight'
import { storageActivityWebsiteMap, storageSetting, storageWordList } from '~/logic/storage'

import App from './Content.vue'
import '~/styles'

const debounceHighlight = useDebounceFn(highlight, 500)

const enable = computed(() => {
  return location.protocol.includes('http') && !!storageActivityWebsiteMap.value[location.host]
})
const words = computed(() => {
  return storageWordList.value.map(value => value.word).filter(word => !!word)
})

/** 创建 root 节点 */
function createRoot(target: HTMLElement) {
  const container = document.createElement('div')
  const root = document.createElement('div')
  const styleEl = document.createElement('link')
  const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container

  container.setAttribute('id', __NAME__)
  container.setAttribute('style', 'display: unset; padding: unset; margin: unset;')
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))

  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
  target.appendChild(container)

  return root
}

/** 更新 page 要实时 & 单词本更新时 & 首次加载要执行一次 */
async function updatePage() {
  if (enable.value) {
    debounceHighlight(words.value)
  }
  else {
    unhighlight()
  }
}

/** 更新 icon 要实时 */
async function updateIcon(show: boolean) {
  sendMessage('event-activity', { show }, 'background')
}

/** 更新 style 要实时 */
function updateStyle(highlight: typeof storageSetting.value.highlight) {
  const id = `style-${__NAME__}`
  const oldStyle = document.head.querySelector(id)
  oldStyle && document.head.removeChild(oldStyle)

  const style = document.createElement('style')
  style.id = id
  style.innerHTML = highlight.style
  document.head.appendChild(style)
}

watch(() => enable.value, updateIcon, { immediate: true })
watch(() => enable.value, updatePage, { immediate: true })
watch(() => words.value, updatePage, { deep: true })
watch(() => storageSetting.value.highlight, updateStyle, { immediate: true })

const app = createApp(App)
app.mount(createRoot(document.querySelector('html')!))
