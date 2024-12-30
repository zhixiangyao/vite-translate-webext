<script lang="ts" setup>
defineOptions({ name: 'ShadowHost' })

const props = defineProps<{ root?: HTMLElement | null }>()

const Content = defineAsyncComponent({
  loader: () => import('~/content/Content.vue'),
})

const ref = useTemplateRef('ref')

const id = __NAME__

function init(root: HTMLElement) {
  const shadowRoot = ref.value!.attachShadow({ mode: __DEV__ ? 'open' : 'closed' })

  const content = document.createElement('div')
  const styleEl = document.createElement('link')

  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))

  shadowRoot.appendChild(styleEl)
  shadowRoot.appendChild(content)
  const app = createApp(h(Content, { root }))
  app.mount(content)
}

const { stop } = watch(
  () => props.root,
  (root) => {
    if (root) {
      stop()
      init(root)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div :id="id" ref="ref" />
</template>
