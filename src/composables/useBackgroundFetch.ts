import type { ProtocolMap } from 'webext-bridge'
import { message } from 'ant-design-vue'
import { onMessage, sendMessage } from 'webext-bridge/content-script'
import { EnumResponseCode } from '~/constant/enum'

export function useBackgroundFetch(params?: { silent: boolean }) {
  async function post<T extends Record<string, any>>(
    url: string,
    options: Pick<ProtocolMap['event-fetch-send'], 'headers' | 'params'>,
  ) {
    const { promise, resolve, reject } = Promise.withResolvers<T | undefined>()

    sendMessage(
      'event-fetch-send',
      {
        url,
        headers: options.headers,
        params: options.params,
      },
      'background',
    )

    onMessage('event-fetch-on', async ({ data }) => {
      switch (data.code) {
        case EnumResponseCode.Success: {
          resolve(data.response as T)
          break
        }
        case EnumResponseCode.Error: {
          reject(EnumResponseCode.Error)
          !params?.silent && message.error('未知错误')
          break
        }
        case EnumResponseCode.AbortError: {
          reject(EnumResponseCode.Error)
          !params?.silent && message.error('请求超时')
          break
        }
      }
    })

    return promise
  }

  return { post }
}
