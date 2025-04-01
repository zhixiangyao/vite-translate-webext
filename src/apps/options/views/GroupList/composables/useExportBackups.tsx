import type { TRecordGroup, TRecordWord } from '~/logic/storage'
import { Button } from 'ant-design-vue'
import dayjs from 'dayjs'
import { utils, writeFileXLSX } from 'xlsx'
import { useCustomModal } from '~/apps/options/composables/useCustomModal'
import { storageGroupList, storageWordList } from '~/logic/storage'

type TColumnName = string
type TColumnValue = string | number | null | undefined
type TPre = Record<TColumnName, TColumnValue>

export enum EnumSheetName {
  words = 'words',
  groups = 'groups',
}

function generateWordListDataToWorkSheet(wordList: TRecordWord[]) {
  const pres: TPre[] = wordList.map(({ word, groupUUID }) => ({
    word,
    groupUUID,
  }))

  const ws = utils.json_to_sheet(pres)

  ws['!cols'] = [
    { wpx: 90 }, // 设置第一列宽度
    { wpx: 250 }, // 设置第二列宽度
  ]

  return ws
}

function generateGroupListDataToWorkSheet(groupList: TRecordGroup[]) {
  const pres: TPre[] = groupList.map(({ name, uuid }) => ({
    name,
    uuid,
  }))

  const ws = utils.json_to_sheet(pres)

  ws['!cols'] = [
    { wpx: 90 }, // 设置第一列宽度
    { wpx: 250 }, // 设置第二列宽度
  ]

  return ws
}

export function useExportBackups() {
  const customModal = useCustomModal()
  const disabled = computed(() => storageWordList.value.length === 0 && storageGroupList.value.length === 0)

  function handleExport() {
    /* create workbook and append worksheet */
    const wb = utils.book_new()
    /* Add the worksheet to the workbook */
    utils.book_append_sheet(wb, generateWordListDataToWorkSheet(storageWordList.value), EnumSheetName.words)
    utils.book_append_sheet(wb, generateGroupListDataToWorkSheet(storageGroupList.value), EnumSheetName.groups)
    const fileName = `Translate-word-and-group-${dayjs().format('YYYY-MM-DD')}.backup.xlsx`

    const { close } = customModal.confirm({
      title: <div>Export Word and Group</div>,
      width: 500,
      content: <code class="bg-gray-800 text-white rounded-sm px-2 py-1">{fileName}</code>,
      footer: (
        <div class="mt-3 flex justify-end gap-2">
          <Button onClick={() => close()}>Cancel</Button>

          <Button
            type="primary"
            onClick={() => {
              writeFileXLSX(wb, fileName)
              close()
            }}
          >
            Yes
          </Button>
        </div>
      ),
    })
  }

  return { disabled, handleExport }
}
