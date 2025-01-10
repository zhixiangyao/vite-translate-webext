import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { DefaultOptionType } from 'ant-design-vue/es/select'
import type { ColumnsType } from 'ant-design-vue/es/table'
import type { TRecordWord } from '~/logic/storage'
import { App } from 'ant-design-vue'
import { clone } from '~/logic/clone'
import { storageGroupList, storageWordList } from '~/logic/storage'

const rules = {
  'wordList[i].word': [{ required: true, message: '', trigger: 'change' }],
} satisfies Record<`wordList[i].${keyof Pick<TRecordWord, 'word'>}`, Rule[]>

const columns: ColumnsType = [
  {
    title: '单词',
    dataIndex: 'word' satisfies keyof TRecordWord,
    key: 'word' satisfies keyof TRecordWord,
  },
  {
    title: '组',
    dataIndex: 'group' satisfies keyof TRecordWord,
    key: 'group' satisfies keyof TRecordWord,
    width: 200,
  },
  {
    title: '操作',
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
      group: void 0,
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
    const wordList = clone(formState.wordList)
    storageWordList.value = wordList

    {
      const groupMap = storageGroupList.value.reduce<Record<string, TRecordWord[]>>((acc, cur) => {
        acc[cur.name] = []
        return acc
      }, {})

      wordList.forEach((item) => {
        if (item.group)
          groupMap[item.group]?.push(item)
      })
      storageGroupList.value = Object.entries(groupMap).map(([name, list]) => ({ name, list }))
    }

    message.success('保存成功')
  }

  function handleOpen() {
    handleReset()
    open.value = true
    const wordList = clone(storageWordList.value)
    formState.wordList = wordList
    options.value = storageGroupList.value.map<DefaultOptionType>(item => ({
      label: item.name,
      value: item.name,
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
