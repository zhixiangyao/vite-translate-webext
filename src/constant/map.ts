import { EnumDataSet } from './enum'

export const DEFAULT_SETTING = {
  api: {
    url: 'http://home.yaozhixiang.top:1188/translate',
    token: 'deeplx_yzx',
    timeout: 10_000,
  },
  highlight: {
    style: `span[${EnumDataSet.highlightedWord}] { color: #e61a1a; cursor: pointer; background-color: #e6e683; }`,
  },
}
