import type { SelectProps } from 'ant-design-vue'
import type { TSettings } from '~/storage'

export const OPTIONS_LANG: SelectProps['options'] = [
  { label: 'Auto', value: 'auto' satisfies TSettings['lang'] },
  { label: 'English', value: 'en' satisfies TSettings['lang'] },
  { label: '中文', value: 'zh' satisfies TSettings['lang'] },
]
