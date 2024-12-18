import { sendMessage } from 'webext-bridge/content-script'
import '@unocss/reset/tailwind.css'
import 'uno.css'

import Tooltip from './components/Tooltip.vue'
import { highlight, setupApp, storageActivityWebsiteMap, storageWordList, unhighlight } from '~/logic'

const enable = computed(() => {
  return location.protocol.includes('http') && !!storageActivityWebsiteMap.value[location.host]
})

/** 创建 root 节点 */
function createRoot() {
  const container = document.createElement('div')
  container.id = __NAME__
  const root = document.createElement('div')
  const styleEl = document.createElement('link')
  const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
  document.body.appendChild(container)

  return root
}

/** 更新 page 只有首次加载完毕才会执行 */
async function updatePage() {
  const words = storageWordList.value.map(value => value.word)

  if (enable.value) {
    highlight(words, 'color: red; font-weight: bold')
  }
  else {
    unhighlight()
  }
}

/** 更新 icon 要实时 */
async function updateIcon() {
  if (enable.value) {
    sendMessage('event-activity', { show: true }, 'background')
  }
  else {
    sendMessage('event-activity', { show: false }, 'background')
  }
}

watch(() => enable.value, updateIcon, { immediate: true })

window.addEventListener('load', updatePage)
const app = createApp(Tooltip)
setupApp(app, { context: 'content' })
app.mount(createRoot())
