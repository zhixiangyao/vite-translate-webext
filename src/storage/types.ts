import type { EnumLang, EnumLayout } from '~/constant/enum'

export interface TCurrentTab {
  id?: number
}

export interface TRecordGroup {
  name: string
  uuid: string
  list: TRecordWord[]
}

export interface TRecordWord {
  word: string
  groupUUID: string | undefined
}

export interface TRecordWebsite {
  url: string
  enable: boolean
}

export interface TCacheMap {
  [name: string]: any
}

export interface TSettings {
  lang: EnumLang | 'auto'
  globalEnable: boolean
  api: {
    url: string
    token: string
    timeout: number
  }
  highlight: {
    style: string
  }
  theme: {
    color: string
    layout: EnumLayout
  }
  webdav: {
    url: string | undefined
    username: string | undefined
    password: string | undefined
    path: string | undefined
  }
}
