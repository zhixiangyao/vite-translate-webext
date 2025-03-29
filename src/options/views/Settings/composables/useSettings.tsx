import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
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
  WebdavUrl: TSettings['Webdav']['url']
  WebdavUsername: TSettings['Webdav']['username']
  WebdavPassword: TSettings['Webdav']['password']
  WebdavPath: TSettings['Webdav']['path']
}

export type TFormTypeKeys = keyof TFormType

const rules = {
  apiUrl: [{ required: true, message: 'Please enter the request URL', trigger: 'change' }],
  apiToken: [{ required: true, message: 'Please enter the request Token', trigger: 'change' }],
  apiTimeout: [{ required: true, message: 'Please enter the request Timeout', trigger: 'change' }],
  highlightStyle: [{ required: true, message: 'Please enter the Highlight Style', trigger: 'change' }],
  themeColor: [{ required: true, message: 'Please enter the Theme Color', trigger: 'change' }],
  WebdavUrl: [{ required: false, message: 'Please enter the Webdav URL', trigger: 'change' }],
  WebdavUsername: [{ required: false, message: 'Please enter the Webdav Username', trigger: 'change' }],
  WebdavPassword: [{ required: false, message: 'Please enter the Webdav Password', trigger: 'change' }],
  WebdavPath: [{ required: false, message: 'Please enter the Webdav Path', trigger: 'change' }],
} satisfies Record<keyof TFormType, Rule[]>

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
    WebdavUrl: void 0,
    WebdavUsername: void 0,
    WebdavPassword: void 0,
    WebdavPath: void 0,
  })
  const disabledReset = computed(() => {
    return (
      DEFAULT_SETTINGS.api.url === formState.apiUrl
      && DEFAULT_SETTINGS.api.token === formState.apiToken
      && DEFAULT_SETTINGS.api.timeout === formState.apiTimeout * 1000
      && cssBeautify(DEFAULT_SETTINGS.highlight.style) === formState.highlightStyle
      && DEFAULT_SETTINGS.theme.color === formState.themeColor
      && DEFAULT_SETTINGS.Webdav.url === formState.WebdavUrl
      && DEFAULT_SETTINGS.Webdav.username === formState.WebdavUsername
      && DEFAULT_SETTINGS.Webdav.password === formState.WebdavPassword
      && DEFAULT_SETTINGS.Webdav.path === formState.WebdavPath
    )
  })
  const disabledSave = computed(() => {
    return (
      storageSettings.value.api.url === formState.apiUrl
      && storageSettings.value.api.token === formState.apiToken
      && storageSettings.value.api.timeout === formState.apiTimeout * 1000
      && cssBeautify(storageSettings.value.highlight.style) === formState.highlightStyle
      && storageSettings.value.theme.color === formState.themeColor
      && storageSettings.value.Webdav.url === formState.WebdavUrl
      && storageSettings.value.Webdav.username === formState.WebdavUsername
      && storageSettings.value.Webdav.password === formState.WebdavPassword
      && storageSettings.value.Webdav.path === formState.WebdavPath
    )
  })

  async function handleSave() {
    await formRef.value?.validate()
    storageSettings.value.api.url = formState.apiUrl
    storageSettings.value.api.token = formState.apiToken
    storageSettings.value.api.timeout = formState.apiTimeout * 1000
    storageSettings.value.highlight.style = formState.highlightStyle
    storageSettings.value.theme.color = formState.themeColor
    storageSettings.value.Webdav.url = formState.WebdavUrl
    storageSettings.value.Webdav.username = formState.WebdavUsername
    storageSettings.value.Webdav.password = formState.WebdavPassword
    storageSettings.value.Webdav.path = formState.WebdavPath

    setTimeout(() => message.success('Save success'), 20)
  }

  async function handleResetOk(cb: () => void) {
    formRef.value?.clearValidate()

    storageSettings.value.api.url = DEFAULT_SETTINGS.api.url
    storageSettings.value.api.token = DEFAULT_SETTINGS.api.token
    storageSettings.value.api.timeout = DEFAULT_SETTINGS.api.timeout
    storageSettings.value.highlight.style = DEFAULT_SETTINGS.highlight.style
    storageSettings.value.theme.color = DEFAULT_SETTINGS.theme.color
    storageSettings.value.Webdav.url = DEFAULT_SETTINGS.Webdav.url
    storageSettings.value.Webdav.username = DEFAULT_SETTINGS.Webdav.username
    storageSettings.value.Webdav.password = DEFAULT_SETTINGS.Webdav.password
    storageSettings.value.Webdav.path = DEFAULT_SETTINGS.Webdav.path

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
      formState.WebdavUrl = setting.Webdav.url
      formState.WebdavUsername = setting.Webdav.username
      formState.WebdavPassword = setting.Webdav.password
      formState.WebdavPath = setting.Webdav.path
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
