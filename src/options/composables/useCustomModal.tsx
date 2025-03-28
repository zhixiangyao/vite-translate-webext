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
  onOk?: () => Promise<void>
  afterClose?: () => void
}

export function useCustomModal() {
  const contentStyleTag = useStyleTag(customCSS)
  const { modal } = App.useApp()

  const confirm = (params: ConfirmParams) => {
    params.content && contentStyleTag.load()

    modal.confirm({
      width: params.width,
      closable: true,
      icon: null,
      title: params.title,
      content: params.content,
      async onOk() {
        return params.onOk?.()
      },
      footer: params.footer,
      afterClose: () => {
        params.content && contentStyleTag.unload()
        params.afterClose?.()
      },
    })
  }

  return { confirm }
}
