import type { TRecordGroup, TRecordWord } from '~/logic/storage'
import dayjs from 'dayjs'
import { utils, writeFileXLSX } from 'xlsx'
import { storageGroupList, storageWordList } from '~/logic/storage'

type TColumnName = string
type TColumnValue = string | number | null | undefined
type TPre = Record<TColumnName, TColumnValue>

function generateWordListData(wordList: TRecordWord[]) {
  const pres: TPre[] = wordList.map(({ word, groupUUID }) => ({
    'Word': word,
    'Group UUID': groupUUID,
  }))

  const ws = utils.json_to_sheet(pres)

  ws['!cols'] = [
    { wpx: 90 }, // 设置第一列宽度
    { wpx: 250 }, // 设置第二列宽度
  ]

  return ws
}

function generateGroupListData(groupList: TRecordGroup[]) {
  const pres: TPre[] = groupList.map(({ name, uuid }) => ({
    Name: name,
    UUID: uuid,
  }))

  const ws = utils.json_to_sheet(pres)

  ws['!cols'] = [
    { wpx: 90 }, // 设置第一列宽度
    { wpx: 250 }, // 设置第二列宽度
  ]

  return ws
}

export function useExportBackups() {
  function handleExport() {
    /* create workbook and append worksheet */
    const wb = utils.book_new()
    /* Add the worksheet to the workbook */
    utils.book_append_sheet(wb, generateWordListData(storageWordList.value), 'words')
    utils.book_append_sheet(wb, generateGroupListData(storageGroupList.value), 'groups')
    /* export to XLSX */
    writeFileXLSX(wb, `Translate-${dayjs().format('YYYY-MM-DD')}.backups.xlsx`)
  }

  return { handleExport }
}
