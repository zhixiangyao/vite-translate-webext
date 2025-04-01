import { useDebounceFn, useStyleTag } from '@vueuse/core'
import { theme } from 'ant-design-vue'
import { storageSettings, storageWordList } from '~/logic/storage'
import { highlight } from '~/utils/highlight'
import ShadowHost from './components/ShadowHost.vue'

const debounceHighlight = useDebounceFn(highlight, 50)

export default defineComponent({
  name: 'Preview',
  setup() {
    const { token } = theme.useToken()
    const previewContainer = ref<HTMLElement>()
    const { css } = useStyleTag(storageSettings.value.highlight.style)
    const words = computed(() => {
      return storageWordList.value.map(value => value.word).filter(word => !!word)
    })

    watch(
      () => storageSettings.value.highlight.style,
      value => (css.value = value),
    )

    watch(() => words.value, debounceHighlight, { deep: true, immediate: true })

    return () => (
      <>
        {previewContainer.value && <ShadowHost root={previewContainer.value} />}

        <div
          ref={previewContainer}
          class="p-4 items-center h-full border border-dashed rounded-sm text-size-sm md:text-size-lg lg:text-size-xl xl:text-size-2xl"
          style={{ borderColor: token.value.colorPrimary }}
        >
          If you directly open the above index.html in your browser, you will find that it throws an error because ES
          modules cannot work over the file:// protocol, which is the protocol the browser uses when you open a local
          file. Due to security reasons, ES modules can only work over the http:// protocol, which is what the browsers
          use when opening pages on the web. In order for ES modules to work on our local machine, we need to serve the
          index.html over the http:// protocol, with a local HTTP server. To start a local HTTP server, first make sure
          you have Node.js installed, then run npx serve from the command line in the same directory where your HTML
          file is. You can also use any other HTTP server that can serve static files with the correct MIME types.
          <br />
          <br />
          如果在浏览器中直接打开上面的 index.html, 会发现出现错误, 因为 ES 模块不能通过 file:// 协议工作,
          而该协议是浏览器打开本地文件时使用的协议. 出于安全考虑, ES 模块只能通过 http:// 协议工作,
          即浏览器打开网页时使用的协议. 为了让 ES 模块在本地计算机上运行, 我们需要使用本地 HTTP 服务器通过 http://
          协议提供 index.html. 要启动本地 HTTP 服务器, 首先要确保已安装 Node.js, 然后在与 HTML
          文件所在目录相同的命令行下运行 npx serve. 您也可以使用任何其他能以正确 MIME 类型提供静态文件的 HTTP 服务器.
        </div>
      </>
    )
  },
})
