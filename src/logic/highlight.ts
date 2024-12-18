function buildRegex(word: string) {
  const forms = [
    word,
    `${word}s?`,
    `${word.replace(/y$/, 'i')}es?`,
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
  return new RegExp(`\\b(${forms.join('|')})\\b`, 'gi')
}

function traverseAndRestore(node: HTMLElement) {
  if (node.nodeType === 1) {
    const spans = node.querySelectorAll('span[data-highlighted]')
    spans.forEach((span) => {
      const text = span.textContent!
      span.replaceWith(document.createTextNode(text))
    })
  }
}

function highlightTextNode(node: HTMLElement, regexList: RegExp[], style: string) {
  let text = node.nodeValue!

  // 遍历所有的正则表达式，处理每个正则匹配的文本
  regexList.forEach((regex) => {
    text = text.replace(regex, (match) => {
      // 用 span 包裹每个匹配项，并应用样式
      return `<span data-highlighted-word="true" style="${style}">${match}</span>`
    })
  })

  if (text !== node.nodeValue) {
    const span = document.createElement('span')
    span.setAttribute('data-highlighted', 'true')
    span.innerHTML = text
    node.replaceWith(span)
  }
}

function traverseAndHighlight(node: HTMLElement, regexList: RegExp[], style: string) {
  if (node.nodeType === 3 && node.nodeValue!.trim()) {
    highlightTextNode(node, regexList, style)
  }
  else if (
    node.nodeType === 1
    && node.childNodes
    && !/^(?:script|style|iframe|noscript|textarea)$/i.test(node.tagName)
  ) {
    node.childNodes.forEach(child => traverseAndHighlight(child as HTMLElement, regexList, style))
  }
}

export async function highlight(words: string[], style: string) {
  try {
    const groupRegexes = words.map(buildRegex)

    traverseAndRestore(document.body)

    requestIdleCallback(() => {
      traverseAndHighlight(document.body, groupRegexes, style)
    })
  }
  catch (err) {
    console.error('Error during execution:', err)
  }
}

export async function unhighlight() {
  try {
    requestIdleCallback(() => {
      traverseAndRestore(document.body)
    })
  }
  catch (err) {
    console.error('Error during execution:', err)
  }
}
