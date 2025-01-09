import type { FormInstance } from 'ant-design-vue'
import type { ColumnsType } from 'ant-design-vue/es/table'
import { App } from 'ant-design-vue'
import { storageWebsiteList } from '~/logic/storage'

export interface TRecordWebsite {
  url: string
  enable: boolean
}

const columns: ColumnsType = [
  {
    title: '网址',
    dataIndex: 'url' satisfies keyof TRecordWebsite,
    key: 'url' satisfies keyof TRecordWebsite,
  },
  {
    title: '启用',
    dataIndex: 'enable' satisfies keyof TRecordWebsite,
    key: 'enable' satisfies keyof TRecordWebsite,
  },
  {
    title: '操作',
    key: 'operation',
    width: 90,
  },
]

export function useAllowList() {
  const formRef = ref<FormInstance | null>(null)
  const formState = reactive({
    websiteList: [] as TRecordWebsite[],
  })
  const disabledCancel = computed(() => {
    return JSON.stringify(formState.websiteList) === JSON.stringify(storageWebsiteList.value)
  })
  const { message } = App.useApp()

  function handleDelete(i: number) {
    formState.websiteList?.splice(i, 1)
    formRef.value?.clearValidate()
  }

  async function handleSave() {
    await formRef.value?.validate()
    storageWebsiteList.value = toRaw(formState.websiteList)
    message.success('保存成功')
  }

  async function handleCancel() {
    formRef.value?.clearValidate()
    formState.websiteList = toRaw(storageWebsiteList.value)
  }

  watch(
    storageWebsiteList,
    (websiteList) => {
      formState.websiteList = toRaw(websiteList)
    },
    { immediate: true },
  )

  return {
    columns,
    formRef,
    formState,
    disabledCancel,

    handleDelete,
    handleSave,
    handleCancel,
  }
}
