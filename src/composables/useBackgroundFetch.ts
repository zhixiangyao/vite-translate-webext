import type { ProtocolMap } from 'webext-bridge'
import { message } from 'ant-design-vue'
import { onMessage, sendMessage } from 'webext-bridge/content-script'
import { EnumResponseCode } from '~/constant/enum'

export function useBackgroundFetch(params?: { silent: boolean }) {
  async function post<T extends Record<string, any>>(
    tabId: number,
    url: string,
    options: Pick<ProtocolMap['event-fetch-send'], 'headers' | 'params'>,
    timeout?: number,
  ): Promise<T | undefined> {
    const { promise, resolve, reject } = Promise.withResolvers<T | undefined>()

    sendMessage(
      'event-fetch-send',
      {
        tabId,
        url,
        headers: options.headers,
        params: options.params,
        timeout,
      },
      'background',
    ).catch()

    onMessage('event-fetch-on', async ({ data }) => {
      switch (data.code) {
        case EnumResponseCode.Success: {
          resolve(data.response as T)
          break
        }
        case EnumResponseCode.Error: {
          reject(EnumResponseCode.Error)
          !params?.silent && message.error('Unknown error')
          break
        }
        case EnumResponseCode.AbortError: {
          reject(EnumResponseCode.Error)
          !params?.silent && message.error('Request timeout')
          break
        }
      }
    })

    return promise
  }

  return { post }
}
