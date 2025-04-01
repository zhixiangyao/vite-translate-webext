function getFileName(url?: string) {
  if (url) {
    return url.split('/').at(-1)
  }
}

/**
 * 触发唤起 - 通过 a 标签下载文件
 */
export function triggerFileDownload(href: string, title: string, target?: string) {
  const a = document.createElement('a')
  a.href = href
  a.download = title ?? getFileName(href) ?? '未命名文件'
  a.style.display = 'none'
  target && (a.target = target)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
