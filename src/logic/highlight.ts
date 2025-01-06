import { EnumDataSet } from '~/constant/enum'

enum EnumNodeType {
  element = 1,
  text = 3,
}

type Callback = (regexList: RegExp[]) => void

const excludeRegex = /^(?:script|style|iframe|noscript|textarea)$/i

function genWordRule(word: string) {
  const forms = [
    word,
    `${word}s`,
    `${word.replace(/y$/, 'i')}es`,
    `${word}ed`,
    `${word.replace(/e$/, '')}ing`,
    `${word}ing`,
    `${word}d`,
    `${word}er`,
    `${word}est`,
    `${word}ly`,
    word.replace(/y$/, 'ily'),
    word.replace(/ic$/, 'ically'),
    word.replace(/le$/, 'ly'),
  ]
  return forms.join('|')
}

function unhighlightTextNode(ruleList: string[]) {
  const isClearAll = ruleList.length === 0

  // 找出句子里的 word
  const wordSpans = document.body.querySelectorAll(`span[${EnumDataSet.highlightedWord}]`)

  wordSpans.forEach((wordSpan) => {
    const wordText = wordSpan.textContent

    if (!wordText)
      return

    if (!ruleList.some(rule => rule.toLowerCase().includes(wordText.toLowerCase())) || isClearAll) {
      wordSpan.replaceWith(document.createTextNode(wordText))
    }
  })
}

function highlightTextNode(nodeValue: string, parentNode: HTMLElement, regexList: RegExp[]) {
  let text = nodeValue

  // 遍历所有的正则表达式，处理每个正则匹配的文本
  for (let i = 0; i < regexList.length; i++) {
    text = text.replace(regexList[i], (match) => {
      // 用 span 包裹每个匹配项，并应用样式
      return `<span ${EnumDataSet.highlightedWord}="true">${match}</span>`
    })
  }

  if (text !== nodeValue) {
    parentNode.innerHTML = parentNode.innerHTML.replace(nodeValue, text)
  }
}

function traverseAndHighlight(node: HTMLElement, parentNode: HTMLElement) {
  const callbackList: Callback[] = []

  switch (node.nodeType) {
    case EnumNodeType.text: {
      const nodeValue = node.nodeValue?.trim()

      if (nodeValue) {
        callbackList.push(regexList => highlightTextNode(nodeValue, parentNode, regexList))
      }

      break
    }

    case EnumNodeType.element: {
      if (node.childNodes && !excludeRegex.test(node.tagName) && !node.dataset?.highlightedWord) {
        const childNodes = node.childNodes
        for (let i = 0; i < childNodes.length; i++) {
          callbackList.push(...traverseAndHighlight(childNodes[i] as HTMLElement, node))
        }
      }

      break
    }
  }

  return callbackList
}

export function highlight(words: string[]) {
  try {
    const ruleList = words.map(genWordRule)
    const html = document.querySelector('html')!
    const regexList = ruleList.map(rule => new RegExp(`\\b(${rule})\\b`, 'gi'))

    const callbackList = traverseAndHighlight(document.body, html)
    callbackList.forEach(callback => requestIdleCallback(() => callback(regexList)))
    requestIdleCallback(() => unhighlightTextNode(ruleList))
  }
  catch (err) {
    console.error('Error during execution:', err)
  }
}

export function unhighlight() {
  try {
    unhighlightTextNode([])
  }
  catch (err) {
    console.error('Error during execution:', err)
  }
}
