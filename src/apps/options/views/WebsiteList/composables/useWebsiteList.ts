import type { FormInstance } from 'ant-design-vue'
import type { ColumnsType } from 'ant-design-vue/es/table'
import type { TRecordWebsite } from '~/storage'
import { App } from 'ant-design-vue'
import { useLang } from '~/composables/useLang'
import { storageWebsiteList } from '~/storage'
import { clone } from '~/utils/clone'

export function useWebsiteList() {
  const { message } = App.useApp()
  const lang = useLang()
  const formRef = ref<FormInstance | null>(null)
  const formState = reactive({
    list: [] as TRecordWebsite[],
  })
  const columns = computed<ColumnsType>(() => [
    {
      title: lang('Website'),
      dataIndex: 'url' satisfies keyof TRecordWebsite,
      key: 'url' satisfies keyof TRecordWebsite,
    },
    {
      title: lang('Enable'),
      dataIndex: 'enable' satisfies keyof TRecordWebsite,
      key: 'enable' satisfies keyof TRecordWebsite,
    },
    {
      title: lang('Operation'),
      key: 'operation',
      width: 90,
    },
  ])
  const disabledAdd = computed(() => {
    return JSON.stringify(formState.list) === JSON.stringify(storageWebsiteList.value)
  })

  function handleDelete(i: number) {
    formState.list?.splice(i, 1)
    formRef.value?.clearValidate()
  }

  async function handleSave() {
    await formRef.value?.validate()
    storageWebsiteList.value = clone(formState.list)
    message.success('Save success')
  }

  async function handleCancel() {
    formRef.value?.clearValidate()
    formState.list = clone(storageWebsiteList.value)
  }

  watch(
    storageWebsiteList,
    (list) => {
      formState.list = clone(list)
    },
    { immediate: true },
  )

  return {
    columns,
    formRef,
    formState,
    disabledAdd,

    handleDelete,
    handleSave,
    handleCancel,
  }
}
