import { onMessage, sendMessage } from 'webext-bridge/content-script'

interface Options {
  params: Record<string, unknown>
  headers: Record<string, string>
}

export function useBackgroundFetch() {
  async function post(url: string, options: Options) {
    const { promise, resolve } = Promise.withResolvers<object | undefined>()

    sendMessage(
      'event-fetch-send',
      {
        url,
        headers: options.headers ?? {},
        params: options.params ?? {},
      },
      'background',
    )

    onMessage('event-fetch-on', async ({ data }) => resolve(data.json))

    return promise
  }

  return { post }
}
