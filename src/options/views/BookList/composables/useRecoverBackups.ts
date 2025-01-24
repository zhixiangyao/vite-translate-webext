import type { WorkSheet } from 'xlsx'
import { useFileDialog } from '@vueuse/core'
import { uniqBy } from 'es-toolkit'
import { read, utils } from 'xlsx'
import { regexIsWord } from '~/constant/regex'
import { storageGroupList, storageWordList, type TRecordGroup, type TRecordWord } from '~/logic/storage'
import { EnumSheetName } from './useExportBackups'

function generateWorkSheetToWordListData(ws: WorkSheet): TRecordWord[] {
  const json = utils.sheet_to_json<Record<string, string>>(ws)
  const wordList: TRecordWord[] = []

  json.forEach((item) => {
    if (regexIsWord.test(item.word)) {
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
      const wordList = generateWorkSheetToWordListData(workbook.Sheets[EnumSheetName.words])
      const groupList = generateWorkSheetToGroupListData(workbook.Sheets[EnumSheetName.groups], wordList)

      storageWordList.value = wordList
      storageGroupList.value = groupList
    }
  })

  function handleRecover() {
    open()
  }

  return { handleRecover }
}
