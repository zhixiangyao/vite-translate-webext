import type { WorkSheet } from 'xlsx'
import { useFileDialog } from '@vueuse/core'
import { read, utils } from 'xlsx'
import { storageGroupList, storageWordList, type TRecordGroup, type TRecordWord } from '~/logic/storage'
import { EnumSheetName } from './useExportBackups'

function generateWorkSheetToWordListData(ws: WorkSheet): TRecordWord[] {
  const json = utils.sheet_to_json<Record<string, string>>(ws)

  return json.map(item => ({
    word: item.word,
    groupUUID: item.groupUUID,
  }))
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
