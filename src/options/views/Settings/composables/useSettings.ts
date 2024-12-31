import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { App } from 'ant-design-vue'
import { css as cssBeautify } from 'js-beautify'
import { defaultStorageSetting, storageSetting } from '~/logic'

interface FormType {
  apiUrl: string
  apiToken: string
  apiTimeout: number
  highlightStyle: string
}

const rules = {
  apiUrl: [{ required: true, message: '请输入请求 URL', trigger: 'change' }],
  apiToken: [{ required: true, message: '请输入请求 Token', trigger: 'change' }],
  apiTimeout: [{ required: true, message: '请输入请求 Timeout', trigger: 'change' }],
  highlightStyle: [{ required: true, message: '请输入 Highlight Style', trigger: 'change' }],
} satisfies Record<keyof FormType, Rule[]>

export function useSettings() {
  const { message } = App.useApp()
  const formRef = ref<FormInstance | null>(null)
  const formState = reactive<FormType>({
    apiUrl: storageSetting.value.api.url,
    apiToken: storageSetting.value.api.token,
    apiTimeout: storageSetting.value.api.timeout / 1000,
    highlightStyle: cssBeautify(storageSetting.value.highlight.style),
  })
  const disabledSave = computed(() => {
    return (
      defaultStorageSetting.api.url === formState.apiUrl
      && defaultStorageSetting.api.token === formState.apiToken
      && defaultStorageSetting.api.timeout === formState.apiTimeout * 1000
      && cssBeautify(defaultStorageSetting.highlight.style) === formState.highlightStyle
    )
  })

  async function handleSave() {
    await formRef.value?.validate()
    const data = toRaw(formState)
    storageSetting.value.api.url = data.apiUrl
    storageSetting.value.api.token = data.apiToken
    storageSetting.value.api.timeout = data.apiTimeout * 1000
    storageSetting.value.highlight.style = data.highlightStyle
    message.success('保存成功')
  }

  async function handleReset() {
    formRef.value?.clearValidate()

    formState.apiUrl = defaultStorageSetting.api.url
    formState.apiToken = defaultStorageSetting.api.token
    formState.apiTimeout = defaultStorageSetting.api.timeout / 1000
    formState.highlightStyle = cssBeautify(defaultStorageSetting.highlight.style)

    storageSetting.value.api.url = defaultStorageSetting.api.url
    storageSetting.value.api.token = defaultStorageSetting.api.token
    storageSetting.value.api.timeout = defaultStorageSetting.api.timeout
    storageSetting.value.highlight.style = defaultStorageSetting.highlight.style
    message.success('恢复默认成功')
  }

  return {
    rules,
    formRef,
    formState,
    disabledSave,

    handleSave,
    handleReset,
  }
}
