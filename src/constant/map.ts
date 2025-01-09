import { EnumDataSet, EnumSpeakerLang } from './enum'

export interface TSetting {
  api: {
    url: string
    token: string
    timeout: number
  }
  highlight: {
    style: string
  }
}

export const DEFAULT_SETTING: TSetting = {
  api: {
    url: 'http://home.yaozhixiang.top:1188/translate',
    token: 'deeplx_yzx',
    timeout: 10_000,
  },
  highlight: {
    style: `span[${EnumDataSet.highlightedWord}] { color: #e61a1a; cursor: pointer; background-color: #e6e683; }`,
  },
}

export const SPEAKER_LANG_MAP: Record<EnumSpeakerLang, string> = {
  [EnumSpeakerLang.zh_CN]: '中',
  [EnumSpeakerLang.zh_HK]: '粤',
  [EnumSpeakerLang.en_US]: '美',
  [EnumSpeakerLang.en_GB]: '英',
}
