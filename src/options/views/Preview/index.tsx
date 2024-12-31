import { useStyleTag } from '@vueuse/core'
import { highlight, storageSetting, storageWordList } from '~/logic'
import ShadowHost from './components/ShadowHost.vue'

export default defineComponent({
  name: 'Preview',
  setup() {
    const previewContainer = ref<HTMLElement>()
    const { css } = useStyleTag(storageSetting.value.highlight.style)
    const words = computed(() => {
      return storageWordList.value.map(value => value.word).filter(word => !!word)
    })

    watch(
      () => storageSetting.value.highlight.style,
      value => (css.value = value),
    )

    watch(() => words.value, highlight, { deep: true, immediate: true })

    return () => (
      <>
        {previewContainer.value && <ShadowHost root={previewContainer.value} />}

        <div
          ref={previewContainer}
          class="p-4 items-center h-full border border-dashed border-red-6 rounded-sm text-size-3xl"
        >
          If you directly open the above index.html in your browser, you will find that it throws an error because ES
          modules cannot work over the file:// protocol, which is the protocol the browser uses when you open a local
          file. Due to security reasons, ES modules can only work over the http:// protocol, which is what the browsers
          use when opening pages on the web. In order for ES modules to work on our local machine, we need to serve the
          index.html over the http:// protocol, with a local HTTP server. To start a local HTTP server, first make sure
          you have Node.js installed, then run npx serve from the command line in the same directory where your HTML
          file is. You can also use any other HTTP server that can serve static files with the correct MIME types.
        </div>
      </>
    )
  },
})
