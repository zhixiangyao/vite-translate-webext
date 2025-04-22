import type { FormInstance } from 'ant-design-vue'
import type { ColumnsType, TableProps } from 'ant-design-vue/es/table'
import type { TRecordWebsite } from '~/storage'
import { App } from 'ant-design-vue'
import { useLang } from '~/composables/useLang'
import { storageWebsiteList } from '~/storage'
import { clone } from '~/utils/clone'

interface TFormState {
  list: TRecordWebsite[]
}

export function useWebsiteList() {
  const { message } = App.useApp()
  const lang = useLang()
  const formRef = ref<FormInstance | null>(null)
  const formState = reactive<TFormState>({
    list: [],
  })
  const pageNo = ref(1)
  const pageSize = ref(15)
  const total = ref(0)
  const genIndex = computed(() => (index: number) => (pageNo.value - 1) * pageSize.value + index)
  const columns = computed<ColumnsType<TRecordWebsite>>(() => [
    {
      title: lang('Index'),
      key: 'index',
      width: 90,
      customRender({ index }) {
        return genIndex.value(index) + 1
      },
    },
    {
      title: lang('Website'),
      dataIndex: 'url' satisfies keyof TRecordWebsite,
      key: 'url' satisfies keyof TRecordWebsite,
    },
    {
      title: lang('Enable'),
      dataIndex: 'enable' satisfies keyof TRecordWebsite,
      key: 'enable' satisfies keyof TRecordWebsite,
      width: 400,
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
  const pagination = computed(
    () =>
      ({
        onChange(_page, _pageSize) {
          pageNo.value = _page
          pageSize.value = _pageSize
        },
        total: total.value,
        current: pageNo.value,
        pageSize: pageSize.value,
      } satisfies TableProps<TRecordWebsite>['pagination']),
  )

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
    pagination,
    genIndex,

    handleDelete,
    handleSave,
    handleCancel,
  }
}
