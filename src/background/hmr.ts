import { isFirefox, isForbiddenUrl } from '~/env'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  // Firefox fetch files from cache instead of reloading changes from disk,
  // hmr will not work as Chromium based browser
  browser.webNavigation.onCommitted.addListener(({ tabId, frameId, url }) => {
    // Filter out non main window events.
    if (frameId !== 0)
      return

    if (isForbiddenUrl(url))
      return

    // inject the latest scripts
    browser.tabs
      .executeScript(tabId, {
        file: `${isFirefox ? '' : '.'}/dist/contentScripts/index.mjs`,
        runAt: 'document_end',
      })
      .catch(error => console.error(error))
  })
}
