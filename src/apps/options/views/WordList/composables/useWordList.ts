import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { DefaultOptionType } from 'ant-design-vue/es/select'
import type { ColumnsType, TableProps } from 'ant-design-vue/es/table'
import type { TRecordGroup, TRecordWord } from '~/storage'
import { App } from 'ant-design-vue'
import { uniqBy } from 'es-toolkit'
import { useLang } from '~/composables/useLang'
import { regexIsWord } from '~/constant/regex'
import { storageGroupList, storageWordList } from '~/storage'
import { clone } from '~/utils/clone'

interface TFormState {
  list: TRecordWord[]
}

async function validatorIsWord(_: Rule, value: TRecordWord['word']) {
  if (value && regexIsWord.test(value) === false) {
    return Promise.reject(new Error('Please enter the English word'))
  }
  else {
    return Promise.resolve()
  }
}

const rules = {
  'list[i].word': [
    { required: true, message: 'Please enter the word', trigger: 'change' },
    { validator: validatorIsWord },
  ],
} satisfies Record<`list[i].${keyof Pick<TRecordWord, 'word'>}`, Rule[]>

export function useWordList() {
  const { message } = App.useApp()
  const lang = useLang()
  const formRef = ref<FormInstance | null>(null)
  const formState = reactive<TFormState>({
    list: [],
  })
  const options = ref<DefaultOptionType[]>()
  const pageNo = ref(1)
  const pageSize = ref(13)
  const total = ref(0)
  const genIndex = computed(() => (index: number) => (pageNo.value - 1) * pageSize.value + index)
  const columns = computed<ColumnsType>(() => [
    {
      title: lang('Index'),
      key: 'index',
      width: 90,
      customRender({ index }) {
        return genIndex.value(index) + 1
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
    },
    {
      title: lang('Operation'),
      key: 'operation',
      width: 90,
    },
  ])
  const disabledSave = computed(() => {
    return JSON.stringify(formState.list) === JSON.stringify(storageWordList.value)
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
      } satisfies TableProps<TRecordWord>['pagination']),
  )

  async function handleAdd() {
    await formRef.value?.validate()
    formState.list.push({
      word: '',
      groupUUID: void 0,
    })
  }

  function handleDelete(i: number) {
    formState.list.splice(i, 1)
    formRef.value?.clearValidate()
  }

  async function handleSave() {
    await formRef.value?.validate()
    const list = uniqBy(clone(formState.list), item => item.word)

    storageWordList.value = list
    formState.list = list

    {
      const groupMapByUUID = Object.fromEntries(
        storageGroupList.value.map<[string, TRecordGroup]>(({ uuid, name }) => [uuid, { name, uuid, list: [] }]),
      )

      list.forEach((item) => {
        if (item.groupUUID && groupMapByUUID[item.groupUUID]) {
          groupMapByUUID[item.groupUUID].list.push(item)
        }
      })
      storageGroupList.value = Object.values(groupMapByUUID)
    }

    message.success('Save success')
  }

  watch(
    storageWordList,
    (list) => {
      formState.list = clone(list)
    },
    { immediate: true },
  )

  watch(
    storageGroupList,
    (groupList) => {
      options.value = groupList.map<DefaultOptionType>(item => ({
        label: item.name,
        value: item.uuid,
      }))
    },
    { immediate: true },
  )

  return {
    rules,
    columns,
    formRef,
    formState,
    options,
    disabledSave,
    pagination,
    genIndex,

    handleAdd,
    handleDelete,
    handleSave,
  }
}
