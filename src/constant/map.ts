import type { TSettings } from '~/logic/storage'
import { EnumDataSet, EnumSpeakerLang } from './enum'

export const DEFAULT_SETTINGS: TSettings = {
  api: {
    url: 'http://localhost:1188/translate',
    token: 'helloxxx',
    timeout: 10_000,
  },
  highlight: {
    style: `span[${EnumDataSet.highlightedWord}] { 
      color: #e61a1a;
      /* 要和 color 的颜色一致 */
      -webkit-text-fill-color: #e61a1a; 
      cursor: pointer;
      background-color:rgb(222, 222, 197); 
    }`,
  },
  theme: {
    color: '#A0D911',
  },
}

export const SPEAKER_LANG_MAP: Record<EnumSpeakerLang, string> = {
  [EnumSpeakerLang.zh_CN]: '中',
  [EnumSpeakerLang.zh_HK]: '粤',
  [EnumSpeakerLang.en_US]: '美',
  [EnumSpeakerLang.en_GB]: '英',
}
