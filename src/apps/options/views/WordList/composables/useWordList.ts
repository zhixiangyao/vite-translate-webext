import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { DefaultOptionType } from 'ant-design-vue/es/select'
import type { ColumnsType } from 'ant-design-vue/es/table'
import type { TRecordGroup, TRecordWord } from '~/logic/storage'
import { App } from 'ant-design-vue'
import { uniqBy } from 'es-toolkit'
import { regexIsWord } from '~/constant/regex'
import { storageGroupList, storageWordList } from '~/logic/storage'
import { clone } from '~/utils/clone'

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

const columns: ColumnsType = [
  {
    title: 'Word',
    dataIndex: 'word' satisfies keyof TRecordWord,
    key: 'word' satisfies keyof TRecordWord,
  },
  {
    title: 'Group',
    dataIndex: 'groupUUID' satisfies keyof TRecordWord,
    key: 'groupUUID' satisfies keyof TRecordWord,
    width: 200,
  },
  {
    title: 'Operation',
    key: 'operation',
    width: 90,
  },
]

export function useWordList() {
  const formRef = ref<FormInstance | null>(null)
  const formState = reactive({
    list: [] as TRecordWord[],
  })
  const options = ref<DefaultOptionType[]>()
  const disabledSave = computed(() => {
    return JSON.stringify(formState.list) === JSON.stringify(storageWordList.value)
  })
  const { message } = App.useApp()

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

    handleAdd,
    handleDelete,
    handleSave,
  }
}
