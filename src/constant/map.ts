import type { TRecordGroup, TRecordWebsite, TRecordWord, TSettings } from '~/storage'
import { EnumDataSet, EnumLayout, EnumSpeakerLang } from './enum'

export const DEFAULT_GROUP_LIST: TRecordGroup[] = [
  {
    name: 'Default',
    uuid: 'ea278a06-5fde-4ffb-af57-9d0c7552cd38',
    list: [
      {
        word: 'Vue',
        groupUUID: 'ea278a06-5fde-4ffb-af57-9d0c7552cd38',
      },
    ],
  },
]

export const DEFAULT_WORD_LIST: TRecordWord[] = [
  {
    word: 'Vue',
    groupUUID: 'ea278a06-5fde-4ffb-af57-9d0c7552cd38',
  },
]

export const DEFAULT_WEBSITE_LIST: TRecordWebsite[] = [
  {
    url: 'example.com',
    enable: true,
  },
]

export const DEFAULT_SETTINGS: TSettings = {
  lang: 'auto',
  api: {
    url: 'http://localhost:1188/translate',
    token: 'helloxxx',
    timeout: 10_000,
  },
  highlight: {
    style: `span[${EnumDataSet.HIGHLIGHTED_WORD}] { 
      color: #e61a1a;
      /* To match the color of 'color' */
      -webkit-text-fill-color: #e61a1a; 
      cursor: pointer;
      background-color:rgb(222, 222, 197); 
    }`,
  },
  theme: {
    color: '#A0D911',
    layout: EnumLayout.LEFT,
  },
  webdav: {
    url: void 0,
    username: void 0,
    password: void 0,
    path: void 0,
  },
}

export const SPEAKER_LANG_MAP: Record<EnumSpeakerLang, string> = {
  [EnumSpeakerLang.ZH_CN]: '中',
  [EnumSpeakerLang.ZH_HK]: '粤',
  [EnumSpeakerLang.EN_US]: '美',
  [EnumSpeakerLang.EN_GB]: '英',
}
