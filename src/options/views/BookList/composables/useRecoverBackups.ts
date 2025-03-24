import type { WorkSheet } from 'xlsx'
import type { TRecordGroup, TRecordWord } from '~/logic/storage'
import { useFileDialog } from '@vueuse/core'
import { App } from 'ant-design-vue'
import { uniqBy } from 'es-toolkit'
import { read, utils } from 'xlsx'
import { regexIsWord } from '~/constant/regex'
import { storageGroupList, storageWordList } from '~/logic/storage'
import { EnumSheetName } from './useExportBackups'

function generateWorkSheetToWordListData(ws: WorkSheet): TRecordWord[] {
  const json = utils.sheet_to_json<Record<string, string>>(ws)
  const wordList: TRecordWord[] = []

  json.forEach((item) => {
    if (item.word && regexIsWord.test(item.word)) {
      wordList.push({
        word: item.word.toLowerCase(),
        groupUUID: item.groupUUID,
      })
    }
  })

  return uniqBy(wordList, item => item.word)
}

function generateWorkSheetToGroupListData(ws: WorkSheet, wordList: TRecordWord[]): TRecordGroup[] {
  const json = utils.sheet_to_json<Record<string, string>>(ws)

  return json.map(item => ({
    name: item.name,
    uuid: item.uuid,
    list: wordList.filter(word => word.groupUUID === item.uuid),
  }))
}

export function useRecoverBackups() {
  const { message } = App.useApp()
  const { open, onChange } = useFileDialog({
    accept: '.xlsx',
  })

  onChange(async (files) => {
    /** do something with files */
    const file = files?.[0]
    if (file) {
      const data = await file.arrayBuffer()
      /* data is an ArrayBuffer */
      const workbook = read(data)

      if (workbook.Sheets[EnumSheetName.words] === void 0) {
        message.error(`Recovery failed, missing ${EnumSheetName.words} sheet`)
        return
      }

      if (workbook.Sheets[EnumSheetName.groups] === void 0) {
        message.error(`Recovery failed, missing ${EnumSheetName.groups} sheet`)
        return
      }

      const wordList = generateWorkSheetToWordListData(workbook.Sheets[EnumSheetName.words])
      const groupList = generateWorkSheetToGroupListData(workbook.Sheets[EnumSheetName.groups], wordList)

      if (wordList.length === 0 && groupList.length === 0) {
        message.warning('Imported file is empty or has no legitimate data')
        return
      }

      storageWordList.value = wordList
      storageGroupList.value = groupList

      message.success('Recovery success')
    }
  })

  function handleRecover() {
    open()
  }

  return { handleRecover }
}
