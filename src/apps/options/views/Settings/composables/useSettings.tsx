import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { TSettings } from '~/logic/storage'
import { App, Button } from 'ant-design-vue'
import { css as cssBeautify } from 'js-beautify'
import { useCustomModal } from '~/apps/options/composables/useCustomModal'
import { DEFAULT_SETTINGS } from '~/constant/map'
import { storageSettings } from '~/logic/storage'

interface TFormType {
  apiUrl: TSettings['api']['url']
  apiToken: TSettings['api']['token']
  apiTimeout: TSettings['api']['timeout']
  highlightStyle: TSettings['highlight']['style']
  themeColor: TSettings['theme']['color']
  webdavUrl: TSettings['webdav']['url']
  webdavUsername: TSettings['webdav']['username']
  webdavPassword: TSettings['webdav']['password']
  webdavPath: TSettings['webdav']['path']
}

export type TFormTypeKeys = keyof TFormType

const rules = {
  apiUrl: [{ required: true, message: 'Please enter the request URL', trigger: 'change' }],
  apiToken: [{ required: true, message: 'Please enter the request Token', trigger: 'change' }],
  apiTimeout: [{ required: true, message: 'Please enter the request Timeout', trigger: 'change' }],
  highlightStyle: [{ required: true, message: 'Please enter the Highlight Style', trigger: 'change' }],
  themeColor: [{ required: true, message: 'Please enter the Theme Color', trigger: 'change' }],
  webdavUrl: [{ required: false, message: 'Please enter the webdav URL', trigger: 'change' }],
  webdavUsername: [{ required: false, message: 'Please enter the webdav Username', trigger: 'change' }],
  webdavPassword: [{ required: false, message: 'Please enter the webdav Password', trigger: 'change' }],
  webdavPath: [{ required: false, message: 'Please enter the webdav Path', trigger: 'change' }],
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
    webdavUrl: void 0,
    webdavUsername: void 0,
    webdavPassword: void 0,
    webdavPath: void 0,
  })
  const disabledReset = computed(() => {
    return (
      DEFAULT_SETTINGS.api.url === formState.apiUrl
      && DEFAULT_SETTINGS.api.token === formState.apiToken
      && DEFAULT_SETTINGS.api.timeout === formState.apiTimeout * 1000
      && cssBeautify(DEFAULT_SETTINGS.highlight.style) === formState.highlightStyle
      && DEFAULT_SETTINGS.theme.color === formState.themeColor
      && DEFAULT_SETTINGS.webdav.url === formState.webdavUrl
      && DEFAULT_SETTINGS.webdav.username === formState.webdavUsername
      && DEFAULT_SETTINGS.webdav.password === formState.webdavPassword
      && DEFAULT_SETTINGS.webdav.path === formState.webdavPath
    )
  })
  const disabledSave = computed(() => {
    return (
      storageSettings.value.api.url === formState.apiUrl
      && storageSettings.value.api.token === formState.apiToken
      && storageSettings.value.api.timeout === formState.apiTimeout * 1000
      && cssBeautify(storageSettings.value.highlight.style) === formState.highlightStyle
      && storageSettings.value.theme.color === formState.themeColor
      && storageSettings.value.webdav.url === formState.webdavUrl
      && storageSettings.value.webdav.username === formState.webdavUsername
      && storageSettings.value.webdav.password === formState.webdavPassword
      && storageSettings.value.webdav.path === formState.webdavPath
    )
  })

  async function handleSave() {
    await formRef.value?.validate()
    storageSettings.value.api.url = formState.apiUrl
    storageSettings.value.api.token = formState.apiToken
    storageSettings.value.api.timeout = formState.apiTimeout * 1000
    storageSettings.value.highlight.style = formState.highlightStyle
    storageSettings.value.theme.color = formState.themeColor
    storageSettings.value.webdav.url = formState.webdavUrl
    storageSettings.value.webdav.username = formState.webdavUsername
    storageSettings.value.webdav.password = formState.webdavPassword
    storageSettings.value.webdav.path = formState.webdavPath

    setTimeout(() => message.success('Save success'), 20)
  }

  function handleResetYes(close: () => void) {
    formRef.value?.clearValidate()

    storageSettings.value.api.url = DEFAULT_SETTINGS.api.url
    storageSettings.value.api.token = DEFAULT_SETTINGS.api.token
    storageSettings.value.api.timeout = DEFAULT_SETTINGS.api.timeout
    storageSettings.value.highlight.style = DEFAULT_SETTINGS.highlight.style
    storageSettings.value.theme.color = DEFAULT_SETTINGS.theme.color
    storageSettings.value.webdav.url = DEFAULT_SETTINGS.webdav.url
    storageSettings.value.webdav.username = DEFAULT_SETTINGS.webdav.username
    storageSettings.value.webdav.password = DEFAULT_SETTINGS.webdav.password
    storageSettings.value.webdav.path = DEFAULT_SETTINGS.webdav.path

    close()

    setTimeout(() => message.success('Restore defaults success!'), 20)
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

          <Button type="primary" onClick={() => handleResetYes(close)}>
            Yes
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
      formState.webdavUrl = setting.webdav.url
      formState.webdavUsername = setting.webdav.username
      formState.webdavPassword = setting.webdav.password
      formState.webdavPath = setting.webdav.path
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
