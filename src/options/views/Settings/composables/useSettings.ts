import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { TSetting } from '~/logic/storage'
import { App } from 'ant-design-vue'
import { css as cssBeautify } from 'js-beautify'
import { DEFAULT_SETTING } from '~/constant/map'
import { storageSetting } from '~/logic/storage'

interface FormType {
  apiUrl: TSetting['api']['url']
  apiToken: TSetting['api']['token']
  apiTimeout: TSetting['api']['timeout']
  highlightStyle: TSetting['highlight']['style']
  themeColor: TSetting['theme']['color']
}

const rules = {
  apiUrl: [{ required: true, message: '请输入请求 URL', trigger: 'change' }],
  apiToken: [{ required: true, message: '请输入请求 Token', trigger: 'change' }],
  apiTimeout: [{ required: true, message: '请输入请求 Timeout', trigger: 'change' }],
  highlightStyle: [{ required: true, message: '请输入 Highlight Style', trigger: 'change' }],
  themeColor: [{ required: true, message: '请输入 Theme Color', trigger: 'change' }],
} satisfies Record<keyof FormType, Rule[]>

export function useSettings() {
  const { message } = App.useApp()
  const formRef = ref<FormInstance | null>(null)
  const formState = reactive<FormType>({
    apiUrl: '',
    apiToken: '',
    apiTimeout: 0,
    highlightStyle: '',
    themeColor: '',
  })
  const disabledReset = computed(() => {
    return (
      DEFAULT_SETTING.api.url === formState.apiUrl
      && DEFAULT_SETTING.api.token === formState.apiToken
      && DEFAULT_SETTING.api.timeout === formState.apiTimeout * 1000
      && cssBeautify(DEFAULT_SETTING.highlight.style) === formState.highlightStyle
      && DEFAULT_SETTING.theme.color === formState.themeColor
    )
  })

  const disabledSave = computed(() => {
    return (
      storageSetting.value.api.url === formState.apiUrl
      && storageSetting.value.api.token === formState.apiToken
      && storageSetting.value.api.timeout === formState.apiTimeout * 1000
      && cssBeautify(storageSetting.value.highlight.style) === formState.highlightStyle
      && storageSetting.value.theme.color === formState.themeColor
    )
  })

  async function handleSave() {
    await formRef.value?.validate()
    storageSetting.value.api.url = formState.apiUrl
    storageSetting.value.api.token = formState.apiToken
    storageSetting.value.api.timeout = formState.apiTimeout * 1000
    storageSetting.value.highlight.style = formState.highlightStyle
    storageSetting.value.theme.color = formState.themeColor

    setTimeout(() => message.success('保存成功'), 20)
  }

  async function handleReset() {
    formRef.value?.clearValidate()

    formState.apiUrl = DEFAULT_SETTING.api.url
    formState.apiToken = DEFAULT_SETTING.api.token
    formState.apiTimeout = DEFAULT_SETTING.api.timeout / 1000
    formState.highlightStyle = cssBeautify(DEFAULT_SETTING.highlight.style)
    formState.themeColor = DEFAULT_SETTING.theme.color

    storageSetting.value.api.url = DEFAULT_SETTING.api.url
    storageSetting.value.api.token = DEFAULT_SETTING.api.token
    storageSetting.value.api.timeout = DEFAULT_SETTING.api.timeout
    storageSetting.value.highlight.style = DEFAULT_SETTING.highlight.style
    storageSetting.value.theme.color = DEFAULT_SETTING.theme.color

    setTimeout(() => message.success('恢复默认成功'), 20)
  }

  watch(
    storageSetting,
    (setting) => {
      formState.apiUrl = setting.api.url
      formState.apiToken = setting.api.token
      formState.apiTimeout = setting.api.timeout / 1000
      formState.highlightStyle = cssBeautify(setting.highlight.style)
      formState.themeColor = setting.theme.color
    },
    { immediate: true },
  )

  return {
    rules,
    formRef,
    formState,
    disabledSave,
    disabledReset,

    handleSave,
    handleReset,
  }
}
