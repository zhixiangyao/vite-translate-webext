import type { FormInstance } from 'ant-design-vue'
import type { ColumnsType } from 'ant-design-vue/es/table'
import { App } from 'ant-design-vue'
import { storageActivityWebsiteMap } from '~/logic/storage'

export interface RecordType {
  url: string
  enable: boolean
}

const columns: ColumnsType = [
  {
    title: '网址',
    dataIndex: 'url' satisfies keyof RecordType,
    key: 'url' satisfies keyof RecordType,
  },
  {
    title: '启用',
    dataIndex: 'enable' satisfies keyof RecordType,
    key: 'enable' satisfies keyof RecordType,
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
    allowList: [] as RecordType[],
  })
  const { message } = App.useApp()

  function handleDelete(i: number) {
    formState.allowList?.splice(i, 1)
    formRef.value?.clearValidate()
  }

  async function handleSave() {
    await formRef.value?.validate()
    storageActivityWebsiteMap.value = formState.allowList.reduce<Record<string, boolean>>((acc, cur) => {
      acc[cur.url] = cur.enable
      return acc
    }, {})
    message.success('保存成功')
  }

  watch(
    storageActivityWebsiteMap,
    (allowMap) => {
      const temp: Record<string, boolean> = JSON.parse(JSON.stringify(allowMap))

      formState.allowList = Object.entries(temp).map(([url, enable]) => ({
        url,
        enable,
      }))
    },
    { immediate: true },
  )

  return {
    columns,
    formRef,
    formState,

    handleDelete,
    handleSave,
  }
}
