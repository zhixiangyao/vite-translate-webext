import type { ModalFuncProps } from 'ant-design-vue'
import { useStyleTag } from '@vueuse/core'
import { App } from 'ant-design-vue'

const customCSS = `
.ant-modal-confirm-body .ant-modal-confirm-content { 
  max-width: unset !important;
}
`.trim()

interface ConfirmParams {
  title: ModalFuncProps['title']
  content?: ModalFuncProps['content']
  width?: ModalFuncProps['width']
  footer?: ModalFuncProps['footer']
}

export function useCustomModal() {
  const contentStyleTag = useStyleTag(customCSS)
  const { modal } = App.useApp()

  const confirm = (params: ConfirmParams) => {
    params.content && contentStyleTag.load()

    const instance = modal.confirm({
      width: params.width,
      closable: true,
      icon: null,
      title: params.title,
      content: params.content,
      footer: params.footer,
    })

    return {
      close() {
        instance.destroy()
        params.content && contentStyleTag.unload()
      },
    }
  }

  return { confirm }
}
