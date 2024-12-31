import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { ColumnsType } from 'ant-design-vue/es/table'

import { App } from 'ant-design-vue'
import { storageWordList } from '~/logic'

export interface RecordType {
  word: string
}

const rules = {
  'wordList[i].word': [{ required: true, message: '', trigger: 'change' }],
} satisfies Record<`wordList[i].${keyof RecordType}`, Rule[]>

const columns: ColumnsType = [
  {
    title: '单词',
    dataIndex: 'word' satisfies keyof RecordType,
    key: 'word' satisfies keyof RecordType,
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
    wordList: [] as RecordType[],
  })
  const { message } = App.useApp()

  async function handleAdd(i: number) {
    await formRef.value?.validate()
    formState.wordList?.splice(i + 1, 0, {
      word: '',
    })
  }

  function handleDelete(i: number) {
    formState.wordList?.splice(i, 1)
    formRef.value?.clearValidate()
  }

  async function handleSave() {
    await formRef.value?.validate()
    storageWordList.value = formState.wordList
    message.success('保存成功')
  }

  watch(
    storageWordList,
    (wordList) => {
      formState.wordList = JSON.parse(JSON.stringify(wordList))
    },
    { immediate: true },
  )

  return {
    rules,
    columns,
    formRef,
    formState,

    handleAdd,
    handleDelete,
    handleSave,
  }
}
