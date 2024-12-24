import type { Rule } from 'ant-design-vue/es/form'
import type { ColumnsType } from 'ant-design-vue/es/table'

import type { RecordType } from './type'

export const rules = {
  'wordList[i].word': [{ required: true, message: '', trigger: 'change' }],
} satisfies Record<string, Rule[]>

export const columns: ColumnsType = [
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
