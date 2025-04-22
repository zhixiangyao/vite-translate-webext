import type { ColumnsType, TableProps } from 'ant-design-vue/es/table'
import type { TRecordWord } from '~/storage'
import { useLang } from '~/composables/useLang'
import { storageGroupList, storageWordList } from '~/storage'
import { clone } from '~/utils/clone'

export function useWordList() {
  const lang = useLang()
  const dataSource = computed(() => clone(storageWordList.value))
  const pageNo = ref(1)
  const pageSize = ref(15)
  const pagination = computed<TableProps<TRecordWord>['pagination']>(() => ({
    onChange: handlePaginationChange,
    total: dataSource.value.length,
    current: pageNo.value,
    pageSize: pageSize.value,
  }))
  const groupMap = computed(() =>
    Object.fromEntries(clone(storageGroupList.value).map(({ uuid, name }) => [uuid, name])),
  )
  const columns = computed<ColumnsType<TRecordWord>>(() => [
    {
      title: lang('Index'),
      key: 'index',
      width: 90,
      customRender(context) {
        return (pageNo.value - 1) * pageSize.value + context.index + 1
      },
    },
    {
      title: lang('Word'),
      dataIndex: 'word' satisfies keyof TRecordWord,
      key: 'word' satisfies keyof TRecordWord,
    },
    {
      title: lang('Group'),
      dataIndex: 'groupUUID' satisfies keyof TRecordWord,
      key: 'groupUUID' satisfies keyof TRecordWord,
      width: 400,
      customRender({ record }) {
        const name = record.groupUUID ? groupMap.value[record.groupUUID] : void 0
        return name ?? '/'
      },
    },
    {
      title: lang('Operation'),
      key: 'operation',
      width: 90,
    },
  ])

  function handlePaginationChange(_page: number, _pageSize: number) {
    pageNo.value = _page
    pageSize.value = _pageSize
  }

  function handleDelete(record: TRecordWord) {
    const index = storageWordList.value.findIndex(({ word }) => record.word === word)

    if (index !== -1) {
      storageWordList.value.splice(index, 1)
    }
  }

  return {
    columns,
    dataSource,
    pagination,

    handleDelete,
  }
}
