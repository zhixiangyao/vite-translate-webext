import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { TSettings } from '~/logic/storage'
import { App } from 'ant-design-vue'
import { css as cssBeautify } from 'js-beautify'
import { DEFAULT_SETTINGS } from '~/constant/map'
import { storageSettings } from '~/logic/storage'

interface FormType {
  apiUrl: TSettings['api']['url']
  apiToken: TSettings['api']['token']
  apiTimeout: TSettings['api']['timeout']
  highlightStyle: TSettings['highlight']['style']
  themeColor: TSettings['theme']['color']
}

const rules = {
  apiUrl: [{ required: true, message: 'Please enter the request URL', trigger: 'change' }],
  apiToken: [{ required: true, message: 'Please enter the request Token', trigger: 'change' }],
  apiTimeout: [{ required: true, message: 'Please enter the request Timeout', trigger: 'change' }],
  highlightStyle: [{ required: true, message: 'Please enter the Highlight Style', trigger: 'change' }],
  themeColor: [{ required: true, message: 'Please enter the Theme Color', trigger: 'change' }],
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
      DEFAULT_SETTINGS.api.url === formState.apiUrl
      && DEFAULT_SETTINGS.api.token === formState.apiToken
      && DEFAULT_SETTINGS.api.timeout === formState.apiTimeout * 1000
      && cssBeautify(DEFAULT_SETTINGS.highlight.style) === formState.highlightStyle
      && DEFAULT_SETTINGS.theme.color === formState.themeColor
    )
  })

  const disabledSave = computed(() => {
    return (
      storageSettings.value.api.url === formState.apiUrl
      && storageSettings.value.api.token === formState.apiToken
      && storageSettings.value.api.timeout === formState.apiTimeout * 1000
      && cssBeautify(storageSettings.value.highlight.style) === formState.highlightStyle
      && storageSettings.value.theme.color === formState.themeColor
    )
  })

  async function handleSave() {
    await formRef.value?.validate()
    storageSettings.value.api.url = formState.apiUrl
    storageSettings.value.api.token = formState.apiToken
    storageSettings.value.api.timeout = formState.apiTimeout * 1000
    storageSettings.value.highlight.style = formState.highlightStyle
    storageSettings.value.theme.color = formState.themeColor

    setTimeout(() => message.success('Save success'), 20)
  }

  async function handleReset() {
    formRef.value?.clearValidate()

    formState.apiUrl = DEFAULT_SETTINGS.api.url
    formState.apiToken = DEFAULT_SETTINGS.api.token
    formState.apiTimeout = DEFAULT_SETTINGS.api.timeout / 1000
    formState.highlightStyle = cssBeautify(DEFAULT_SETTINGS.highlight.style)
    formState.themeColor = DEFAULT_SETTINGS.theme.color

    storageSettings.value.api.url = DEFAULT_SETTINGS.api.url
    storageSettings.value.api.token = DEFAULT_SETTINGS.api.token
    storageSettings.value.api.timeout = DEFAULT_SETTINGS.api.timeout
    storageSettings.value.highlight.style = DEFAULT_SETTINGS.highlight.style
    storageSettings.value.theme.color = DEFAULT_SETTINGS.theme.color

    setTimeout(() => message.success('Restore defaults success'), 20)
  }

  watch(
    storageSettings,
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
