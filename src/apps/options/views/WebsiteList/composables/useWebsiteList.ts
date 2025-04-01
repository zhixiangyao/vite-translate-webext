import type { FormInstance } from 'ant-design-vue'
import type { ColumnsType } from 'ant-design-vue/es/table'
import type { TRecordWebsite } from '~/logic/storage'
import { App } from 'ant-design-vue'
import { storageWebsiteList } from '~/logic/storage'
import { clone } from '~/utils/clone'

const columns: ColumnsType = [
  {
    title: 'Website',
    dataIndex: 'url' satisfies keyof TRecordWebsite,
    key: 'url' satisfies keyof TRecordWebsite,
  },
  {
    title: 'Enable',
    dataIndex: 'enable' satisfies keyof TRecordWebsite,
    key: 'enable' satisfies keyof TRecordWebsite,
  },
  {
    title: 'Operation',
    key: 'operation',
    width: 90,
  },
]

export function useWebsiteList() {
  const formRef = ref<FormInstance | null>(null)
  const formState = reactive({
    websiteList: [] as TRecordWebsite[],
  })
  const disabledAdd = computed(() => {
    return JSON.stringify(formState.websiteList) === JSON.stringify(storageWebsiteList.value)
  })
  const { message } = App.useApp()

  function handleDelete(i: number) {
    formState.websiteList?.splice(i, 1)
    formRef.value?.clearValidate()
  }

  async function handleSave() {
    await formRef.value?.validate()
    storageWebsiteList.value = clone(formState.websiteList)
    message.success('Save success')
  }

  async function handleCancel() {
    formRef.value?.clearValidate()
    formState.websiteList = clone(storageWebsiteList.value)
  }

  watch(
    storageWebsiteList,
    (websiteList) => {
      formState.websiteList = clone(websiteList)
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
