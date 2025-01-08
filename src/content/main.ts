import { useDebounceFn, useWindowFocus } from '@vueuse/core'
import { sendMessage } from 'webext-bridge/content-script'
import { highlight, unhighlight } from '~/logic/highlight'
import { storageActivityWebsiteMap, storageSetting, storageWordList } from '~/logic/storage'

import App from './Content.vue'
import '~/styles'

const debounceHighlight = useDebounceFn(highlight, 500)

const focused = useWindowFocus()
const enable = computed(() => {
  return location.protocol.includes('http') && !!storageActivityWebsiteMap.value[location.host]
})
const words = computed(() => {
  return storageWordList.value.map(value => value.word).filter(word => !!word)
})

/** 创建 root 节点 */
function createRoot(target: HTMLElement) {
  const div = document.createElement('div')
  const divShadowRoot = div.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || div
  const link = document.createElement('link')
  const style = document.createElement('style')
  const root = document.createElement('div')

  div.setAttribute('id', __NAME__)
  div.setAttribute('style', 'display: unset; padding: unset; margin: unset;')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  style.textContent = ':host { font-size: 14px; }'

  divShadowRoot.appendChild(style)
  divShadowRoot.appendChild(link)
  divShadowRoot.appendChild(root)
  target.appendChild(div)

  return root
}

/** 更新 page 要实时 & 单词本更新时 & 首次加载要执行一次, 可见时有效 */
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

/** 更新 icon 要实时, 可见时有效 */
async function updateIcon() {
  if (!focused.value) {
    return
  }

  sendMessage('event-activity', { show: enable.value }, 'background')
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

watch([enable, focused], updateIcon, { immediate: true })
watch([enable, focused], updatePage, { immediate: true })
watch([words, focused], updatePage, { deep: true })
watch(() => storageSetting.value.highlight, updateStyle, { immediate: true })

const app = createApp(App)
app.mount(createRoot(document.querySelector('html')!))
