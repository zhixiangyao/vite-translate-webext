import App from '~/apps/content/Content.vue'
import '~/styles'

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

const app = createApp(App)
app.mount(createRoot(document.querySelector('html')!))
