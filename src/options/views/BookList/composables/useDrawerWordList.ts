import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { ColumnsType } from 'ant-design-vue/es/table'
import type { TRecordWord } from '~/logic/storage'
import { App } from 'ant-design-vue'
import { clone } from '~/logic/clone'
import { storageWordList } from '~/logic/storage'

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
  const disabledAdd = computed(() => {
    if (!open.value)
      return true

    return JSON.stringify(formState.wordList) === JSON.stringify(storageWordList.value)
  })
  const { message } = App.useApp()

  async function handleAdd(i: number) {
    await formRef.value?.validate()
    formState.wordList?.splice(i, 0, {
      word: '',
      group: null,
    })
  }

  function handleDelete(i: number) {
    formState.wordList?.splice(i, 1)
    formRef.value?.clearValidate()
  }

  async function handleSave() {
    await formRef.value?.validate()
    storageWordList.value = clone(formState.wordList)
    message.success('保存成功')
  }

  function handleOpen() {
    formState.wordList = []
    open.value = true
    const wordList = clone(storageWordList.value)
    formState.wordList = wordList
  }

  return {
    open,
    rules,
    columns,
    formRef,
    formState,
    disabledAdd,

    handleOpen,
    handleAdd,
    handleDelete,
    handleSave,
  }
}
