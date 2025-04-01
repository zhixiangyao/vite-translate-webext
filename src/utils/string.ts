/** 判断一个句子里语文字符比例, 默认比例是 50% */
export function isFiftyPercentLetters(str: string, percent = 0.5) {
  str = str.replaceAll(' ', '')

  let letterCount = 0

  for (let i = 0; i < str.length; i++) {
    if (/[a-z]/i.test(str[i])) {
      letterCount++
    }
  }

  return letterCount / str.length >= percent
}
