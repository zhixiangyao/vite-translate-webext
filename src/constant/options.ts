import type { SelectProps } from 'ant-design-vue'
import type { TSettings } from '~/storage'
import { EnumLang, EnumLayout } from '~/constant/enum'

export const OPTIONS_LANG: SelectProps['options'] = [
  { label: 'Auto', value: 'auto' satisfies TSettings['lang'] },
  { label: 'English', value: EnumLang.EN satisfies TSettings['lang'] },
  { label: '中文', value: EnumLang.ZH satisfies TSettings['lang'] },
  { label: '日本语', value: EnumLang.JP satisfies TSettings['lang'] },
]

export const OPTIONS_LAYOUT: SelectProps['options'] = [
  { label: 'Left', value: EnumLayout.LEFT satisfies TSettings['theme']['layout'] },
  { label: 'Right', value: EnumLayout.RIGHT satisfies TSettings['theme']['layout'] },
]
