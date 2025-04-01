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
    list: [] as TRecordWebsite[],
  })
  const disabledAdd = computed(() => {
    return JSON.stringify(formState.list) === JSON.stringify(storageWebsiteList.value)
  })
  const { message } = App.useApp()

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
