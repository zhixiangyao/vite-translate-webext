<script lang="ts" setup>
import Content from '~/apps/content/Content.vue'
import i18n from '~/i18n'

interface Props {
  root?: HTMLElement
}

defineOptions({ name: 'ShadowHost' })
const props = defineProps<Props>()

const ref = useTemplateRef('ref')

const id = __NAME__

function init(root: Props['root']) {
  const shadowRoot = ref.value!.attachShadow({ mode: __DEV__ ? 'open' : 'closed' })

  const content = document.createElement('div')
  const styleEl = document.createElement('link')

  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))

  shadowRoot.appendChild(styleEl)
  shadowRoot.appendChild(content)

  const app = createApp(h(Content, { root, alwaysShow: true }))

  app.use(i18n)
  app.mount(content)
}

onMounted(() => init(props.root))
</script>

<template>
  <div :id="id" ref="ref" />
</template>
