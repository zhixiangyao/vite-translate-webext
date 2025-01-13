import type { TSetting } from '~/logic/storage'
import { EnumDataSet, EnumSpeakerLang } from './enum'

export const DEFAULT_SETTING: TSetting = {
  api: {
    url: 'http://home.yaozhixiang.top:1188/translate',
    token: 'deeplx_yzx',
    timeout: 10_000,
  },
  highlight: {
    style: `span[${EnumDataSet.highlightedWord}] { 
      color: #e61a1a;
      -webkit-text-fill-color: #e61a1a;  // 要和 color 的颜色一致
      cursor: pointer;
      background-color:rgb(222, 222, 197); 
    }`,
  },
}

export const SPEAKER_LANG_MAP: Record<EnumSpeakerLang, string> = {
  [EnumSpeakerLang.zh_CN]: '中',
  [EnumSpeakerLang.zh_HK]: '粤',
  [EnumSpeakerLang.en_US]: '美',
  [EnumSpeakerLang.en_GB]: '英',
}
