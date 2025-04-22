import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { TSettings } from '~/storage'
import { App, Button } from 'ant-design-vue'
import { css as cssBeautify } from 'js-beautify'
import { useCustomModal } from '~/apps/options/composables/useCustomModal'
import { useLang } from '~/composables/useLang'
import { EnumLayout } from '~/constant/enum'
import { DEFAULT_SETTINGS } from '~/constant/map'
import { storageSettings } from '~/storage'

interface TFormType {
  lang: TSettings['lang']
  apiUrl: TSettings['api']['url']
  apiToken: TSettings['api']['token']
  apiTimeout: TSettings['api']['timeout']
  highlightStyle: TSettings['highlight']['style']
  themeColor: TSettings['theme']['color']
  themeLayout: TSettings['theme']['layout']
  webdavUrl: TSettings['webdav']['url']
  webdavUsername: TSettings['webdav']['username']
  webdavPassword: TSettings['webdav']['password']
  webdavPath: TSettings['webdav']['path']
}

export type TFormTypeKeys = keyof TFormType

export function useSettings() {
  const { message } = App.useApp()
  const lang = useLang()
  const customModal = useCustomModal()
  const formRef = ref<FormInstance | null>(null)
  const formState = reactive<TFormType>({
    lang: 'auto',
    apiUrl: '',
    apiToken: '',
    apiTimeout: 0,
    highlightStyle: '',
    themeColor: '',
    themeLayout: EnumLayout.LEFT,
    webdavUrl: void 0,
    webdavUsername: void 0,
    webdavPassword: void 0,
    webdavPath: void 0,
  })
  const disabledReset = computed(() => {
    return (
      DEFAULT_SETTINGS.lang === formState.lang
      && DEFAULT_SETTINGS.api.url === formState.apiUrl
      && DEFAULT_SETTINGS.api.token === formState.apiToken
      && DEFAULT_SETTINGS.api.timeout === formState.apiTimeout * 1000
      && cssBeautify(DEFAULT_SETTINGS.highlight.style) === formState.highlightStyle
      && DEFAULT_SETTINGS.theme.color === formState.themeColor
      && DEFAULT_SETTINGS.theme.layout === formState.themeLayout
      && DEFAULT_SETTINGS.webdav.url === formState.webdavUrl
      && DEFAULT_SETTINGS.webdav.username === formState.webdavUsername
      && DEFAULT_SETTINGS.webdav.password === formState.webdavPassword
      && DEFAULT_SETTINGS.webdav.path === formState.webdavPath
    )
  })
  const disabledSave = computed(() => {
    return (
      storageSettings.value.lang === formState.lang
      && storageSettings.value.api.url === formState.apiUrl
      && storageSettings.value.api.token === formState.apiToken
      && storageSettings.value.api.timeout === formState.apiTimeout * 1000
      && cssBeautify(storageSettings.value.highlight.style) === formState.highlightStyle
      && storageSettings.value.theme.color === formState.themeColor
      && storageSettings.value.theme.layout === formState.themeLayout
      && storageSettings.value.webdav.url === formState.webdavUrl
      && storageSettings.value.webdav.username === formState.webdavUsername
      && storageSettings.value.webdav.password === formState.webdavPassword
      && storageSettings.value.webdav.path === formState.webdavPath
    )
  })
  const rules = computed(() => {
    function validatorIsPath(_: Rule, value: string | undefined) {
      if (value) {
        if (value[0] !== '/') {
          return Promise.reject(new Error(lang('The first string must be /')))
        }
        if (value.at(-1) !== '/') {
          return Promise.reject(new Error(lang('The last string must be /')))
        }
      }

      return Promise.resolve()
    }

    return {
      lang: [{ required: true, message: lang('Please select the Lang!'), trigger: 'change' }],
      apiUrl: [{ required: true, message: lang('Please enter the Request URL!'), trigger: 'change' }],
      apiToken: [{ required: true, message: lang('Please enter the Request Token!'), trigger: 'change' }],
      apiTimeout: [{ required: true, message: lang('Please enter the Request Timeout!'), trigger: 'change' }],
      highlightStyle: [{ required: true, message: lang('Please enter the Highlight Style!'), trigger: 'change' }],
      themeColor: [{ required: true, message: lang('Please enter the Theme Color!'), trigger: 'change' }],
      themeLayout: [{ required: true, message: lang('Please select the Theme Layout!'), trigger: 'change' }],
      webdavPath: [{ validator: validatorIsPath }],
    } satisfies Record<string, Rule[]>
  })

  async function handleSave() {
    await formRef.value?.validate()
    storageSettings.value.lang = formState.lang
    storageSettings.value.api.url = formState.apiUrl
    storageSettings.value.api.token = formState.apiToken
    storageSettings.value.api.timeout = formState.apiTimeout * 1000
    storageSettings.value.highlight.style = formState.highlightStyle
    storageSettings.value.theme.color = formState.themeColor
    storageSettings.value.theme.layout = formState.themeLayout
    storageSettings.value.webdav.url = formState.webdavUrl
    storageSettings.value.webdav.username = formState.webdavUsername
    storageSettings.value.webdav.password = formState.webdavPassword
    storageSettings.value.webdav.path = formState.webdavPath

    setTimeout(() => message.success(lang('Save successfully!')), 20)
  }

  function handleResetYes(close: () => void) {
    formRef.value?.clearValidate()

    storageSettings.value.lang = DEFAULT_SETTINGS.lang
    storageSettings.value.api.url = DEFAULT_SETTINGS.api.url
    storageSettings.value.api.token = DEFAULT_SETTINGS.api.token
    storageSettings.value.api.timeout = DEFAULT_SETTINGS.api.timeout
    storageSettings.value.highlight.style = DEFAULT_SETTINGS.highlight.style
    storageSettings.value.theme.color = DEFAULT_SETTINGS.theme.color
    storageSettings.value.theme.layout = DEFAULT_SETTINGS.theme.layout
    storageSettings.value.webdav.url = DEFAULT_SETTINGS.webdav.url
    storageSettings.value.webdav.username = DEFAULT_SETTINGS.webdav.username
    storageSettings.value.webdav.password = DEFAULT_SETTINGS.webdav.password
    storageSettings.value.webdav.path = DEFAULT_SETTINGS.webdav.path

    close()

    setTimeout(() => message.success('Restore defaults success!'), 20)
  }

  async function handleReset() {
    const { close } = customModal.confirm({
      title: <div>{lang('Sure you want to Restore Defaults?')}</div>,
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
      formState.lang = setting.lang
      formState.apiUrl = setting.api.url
      formState.apiToken = setting.api.token
      formState.apiTimeout = setting.api.timeout / 1000
      formState.highlightStyle = cssBeautify(setting.highlight.style)
      formState.themeColor = setting.theme.color
      formState.themeLayout = setting.theme.layout
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
