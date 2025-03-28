import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { DefaultOptionType } from 'ant-design-vue/es/select'
import type { ColumnsType } from 'ant-design-vue/es/table'
import type { TRecordGroup, TRecordWord } from '~/logic/storage'
import { App } from 'ant-design-vue'
import { uniqBy } from 'es-toolkit'
import { regexIsWord } from '~/constant/regex'
import { clone } from '~/logic/clone'
import { storageGroupList, storageWordList } from '~/logic/storage'

async function validatorIsWord(_: Rule, value: TRecordWord['word']) {
  if (value && regexIsWord.test(value) === false) {
    return Promise.reject(new Error('Please enter the English word'))
  }
  else {
    return Promise.resolve()
  }
}

const rules = {
  'wordList[i].word': [{ required: true, message: 'Please enter the word', trigger: 'change' }, { validator: validatorIsWord }],
} satisfies Record<`wordList[i].${keyof Pick<TRecordWord, 'word'>}`, Rule[]>

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

export function useDrawerWordList() {
  const open = ref(false)
  const formRef = ref<FormInstance | null>(null)
  const formState = reactive({
    wordList: [] as TRecordWord[],
  })
  const options = ref<DefaultOptionType[]>()
  const disabledSave = computed(() => {
    if (!open.value)
      return true

    return JSON.stringify(formState.wordList) === JSON.stringify(storageWordList.value)
  })
  const { message } = App.useApp()

  async function handleAdd(i: number) {
    await formRef.value?.validate()
    formState.wordList?.splice(i, 0, {
      word: '',
      groupUUID: void 0,
    } as TRecordWord)
  }

  function handleDelete(i: number) {
    formState.wordList?.splice(i, 1)
    formRef.value?.clearValidate()
  }

  function handleReset() {
    formState.wordList = []
    options.value = []
  }

  async function handleSave() {
    await formRef.value?.validate()
    const wordList = uniqBy(clone(formState.wordList), item => item.word)

    storageWordList.value = wordList
    formState.wordList = wordList

    {
      const groupMapByUUID = Object.fromEntries(
        storageGroupList.value.map<[string, TRecordGroup]>(({ uuid, name }) => [uuid, { name, uuid, list: [] }]),
      )

      wordList.forEach((item) => {
        if (item.groupUUID && groupMapByUUID[item.groupUUID]) {
          groupMapByUUID[item.groupUUID].list.push(item)
        }
      })
      storageGroupList.value = Object.values(groupMapByUUID)
    }

    message.success('Save success')
  }

  function handleOpen() {
    handleReset()
    open.value = true
    const wordList = clone(storageWordList.value)
    formState.wordList = wordList
    options.value = storageGroupList.value.map<DefaultOptionType>(item => ({
      label: item.name,
      value: item.uuid,
    }))
  }

  return {
    open,
    rules,
    columns,
    formRef,
    formState,
    options,
    disabledSave,

    handleOpen,
    handleAdd,
    handleDelete,
    handleSave,
  }
}
