import { clone } from '~/logic/clone'
import { storageWordList } from '~/logic/storage'

interface GroupMap {
  [name: string]: string[]
}

export interface Group {
  name: string
  count: number
  list: string[]
}

function genGroups(wordList: typeof storageWordList.value) {
  const groupMap = wordList.reduce<GroupMap>((acc, cur) => {
    cur.group.forEach((name) => {
      if (acc[name]) {
        acc[name].push(cur.word)
      }
      else {
        acc[name] = [cur.word]
      }
    })

    return acc
  }, {})

  const collectedGroups = Object.entries(groupMap).map<Group>(([name, list]) => ({
    name,
    count: list.length,
    list,
  }))
  const allGroup: Group = {
    name: 'All',
    count: wordList.length,
    list: wordList.map(item => item.word),
  }

  return [allGroup, ...collectedGroups]
}

export function useBookList() {
  const groups = computed<Group[]>(() => {
    return genGroups(clone(storageWordList.value))
  })

  return { groups }
}
