import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { DefaultOptionType } from 'ant-design-vue/es/select'
import type { TSettings } from '~/logic/storage'
import { App, Button } from 'ant-design-vue'
import { css as cssBeautify } from 'js-beautify'
import { DEFAULT_SETTINGS } from '~/constant/map'
import { storageSettings } from '~/logic/storage'
import { useCustomModal } from '~/options/composables/useCustomModal'

interface TFormType {
  apiUrl: TSettings['api']['url']
  apiToken: TSettings['api']['token']
  apiTimeout: TSettings['api']['timeout']
  highlightStyle: TSettings['highlight']['style']
  themeColor: TSettings['theme']['color']
  cloudType: TSettings['cloud']['type']
  cloudUrl: TSettings['cloud']['url']
  cloudUsername: TSettings['cloud']['username']
  cloudPassword: TSettings['cloud']['password']
  cloudPath: TSettings['cloud']['path']
}

export type TFormTypeKeys = keyof TFormType

const rules = {
  apiUrl: [{ required: true, message: 'Please enter the request URL', trigger: 'change' }],
  apiToken: [{ required: true, message: 'Please enter the request Token', trigger: 'change' }],
  apiTimeout: [{ required: true, message: 'Please enter the request Timeout', trigger: 'change' }],
  highlightStyle: [{ required: true, message: 'Please enter the Highlight Style', trigger: 'change' }],
  themeColor: [{ required: true, message: 'Please enter the Theme Color', trigger: 'change' }],
  cloudType: [{ required: false, message: 'Please select the Cloud Type', trigger: 'change' }],
  cloudUrl: [{ required: false, message: 'Please enter the Cloud URL', trigger: 'change' }],
  cloudUsername: [{ required: false, message: 'Please enter the Cloud Username', trigger: 'change' }],
  cloudPassword: [{ required: false, message: 'Please enter the Cloud Password', trigger: 'change' }],
  cloudPath: [{ required: false, message: 'Please enter the Cloud Path', trigger: 'change' }],
} satisfies Record<keyof TFormType, Rule[]>

const options = {
  cloudType: [{ label: 'webdav', value: 'webdav' }],
} satisfies Record<string, DefaultOptionType[]>

export function useSettings() {
  const { message } = App.useApp()
  const customModal = useCustomModal()
  const formRef = ref<FormInstance | null>(null)
  const formState = reactive<TFormType>({
    apiUrl: '',
    apiToken: '',
    apiTimeout: 0,
    highlightStyle: '',
    themeColor: '',
    cloudType: void 0,
    cloudUrl: void 0,
    cloudUsername: void 0,
    cloudPassword: void 0,
    cloudPath: void 0,
  })
  const disabledReset = computed(() => {
    return (
      DEFAULT_SETTINGS.api.url === formState.apiUrl
      && DEFAULT_SETTINGS.api.token === formState.apiToken
      && DEFAULT_SETTINGS.api.timeout === formState.apiTimeout * 1000
      && cssBeautify(DEFAULT_SETTINGS.highlight.style) === formState.highlightStyle
      && DEFAULT_SETTINGS.theme.color === formState.themeColor
      && DEFAULT_SETTINGS.cloud.type === formState.cloudType
      && DEFAULT_SETTINGS.cloud.url === formState.cloudUrl
      && DEFAULT_SETTINGS.cloud.username === formState.cloudUsername
      && DEFAULT_SETTINGS.cloud.password === formState.cloudPassword
      && DEFAULT_SETTINGS.cloud.path === formState.cloudPath
    )
  })
  const disabledSave = computed(() => {
    return (
      storageSettings.value.api.url === formState.apiUrl
      && storageSettings.value.api.token === formState.apiToken
      && storageSettings.value.api.timeout === formState.apiTimeout * 1000
      && cssBeautify(storageSettings.value.highlight.style) === formState.highlightStyle
      && storageSettings.value.theme.color === formState.themeColor
      && storageSettings.value.cloud.type === formState.cloudType
      && storageSettings.value.cloud.url === formState.cloudUrl
      && storageSettings.value.cloud.username === formState.cloudUsername
      && storageSettings.value.cloud.password === formState.cloudPassword
      && storageSettings.value.cloud.path === formState.cloudPath
    )
  })

  async function handleSave() {
    await formRef.value?.validate()
    storageSettings.value.api.url = formState.apiUrl
    storageSettings.value.api.token = formState.apiToken
    storageSettings.value.api.timeout = formState.apiTimeout * 1000
    storageSettings.value.highlight.style = formState.highlightStyle
    storageSettings.value.theme.color = formState.themeColor
    storageSettings.value.cloud.type = formState.cloudType
    storageSettings.value.cloud.url = formState.cloudUrl
    storageSettings.value.cloud.username = formState.cloudUsername
    storageSettings.value.cloud.password = formState.cloudPassword
    storageSettings.value.cloud.path = formState.cloudPath

    setTimeout(() => message.success('Save success'), 20)
  }

  async function handleResetOk(cb: () => void) {
    formRef.value?.clearValidate()

    storageSettings.value.api.url = DEFAULT_SETTINGS.api.url
    storageSettings.value.api.token = DEFAULT_SETTINGS.api.token
    storageSettings.value.api.timeout = DEFAULT_SETTINGS.api.timeout
    storageSettings.value.highlight.style = DEFAULT_SETTINGS.highlight.style
    storageSettings.value.theme.color = DEFAULT_SETTINGS.theme.color
    storageSettings.value.cloud.type = DEFAULT_SETTINGS.cloud.type
    storageSettings.value.cloud.url = DEFAULT_SETTINGS.cloud.url
    storageSettings.value.cloud.username = DEFAULT_SETTINGS.cloud.username
    storageSettings.value.cloud.password = DEFAULT_SETTINGS.cloud.password
    storageSettings.value.cloud.path = DEFAULT_SETTINGS.cloud.path

    cb()

    setTimeout(() => message.success('Restore defaults success'), 20)
  }

  async function handleReset() {
    const { close } = customModal.confirm({
      title: (
        <div>
          Sure you want to&nbsp;
          <b class="text-red">Restore Defaults</b>
          ?
        </div>
      ),
      footer: (
        <div class="mt-3 flex justify-end gap-2">
          <Button onClick={() => close()}>Cancel</Button>

          <Button type="primary" onClick={() => handleResetOk(close)}>
            Ok
          </Button>
        </div>
      ),
    })
  }

  watch(
    storageSettings,
    (setting) => {
      formState.apiUrl = setting.api.url
      formState.apiToken = setting.api.token
      formState.apiTimeout = setting.api.timeout / 1000
      formState.highlightStyle = cssBeautify(setting.highlight.style)
      formState.themeColor = setting.theme.color
      formState.cloudType = setting.cloud.type
      formState.cloudUrl = setting.cloud.url
      formState.cloudUsername = setting.cloud.username
      formState.cloudPassword = setting.cloud.password
      formState.cloudPath = setting.cloud.path
    },
    { immediate: true },
  )

  return {
    rules,
    options,
    formRef,
    formState,
    disabledSave,
    disabledReset,

    handleSave,
    handleReset,
  }
}
