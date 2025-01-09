import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { ColumnsType } from 'ant-design-vue/es/table'
import { App } from 'ant-design-vue'
import { clone } from '~/logic/clone'
import { storageWordList } from '~/logic/storage'

export interface TRecordWord {
  word: string
}

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

export function useBookList() {
  const formRef = ref<FormInstance | null>(null)
  const formState = reactive({
    wordList: [] as TRecordWord[],
  })
  const disabledAdd = computed(() => {
    return JSON.stringify(formState.wordList) === JSON.stringify(storageWordList.value)
  })
  const { message } = App.useApp()

  async function handleAdd(i: number) {
    await formRef.value?.validate()
    formState.wordList?.splice(i, 0, {
      word: '',
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

  watch(
    storageWordList,
    (wordList) => {
      formState.wordList = clone(wordList)
    },
    { immediate: true },
  )

  return {
    rules,
    columns,
    formRef,
    formState,
    disabledAdd,

    handleAdd,
    handleDelete,
    handleSave,
  }
}
