import type { ProtocolMap } from 'webext-bridge'
import { message } from 'ant-design-vue'
import { onMessage, sendMessage } from 'webext-bridge/content-script'
import { EnumResponseCode } from '~/constant/enum'
import { useLang } from './useLang'

export function useBackgroundFetch(params?: { silent: boolean }) {
  const lang = useLang()

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
        case EnumResponseCode.SUCCESS: {
          resolve(data.response as T)
          break
        }
        case EnumResponseCode.ERROR: {
          reject(EnumResponseCode.ERROR)
          !params?.silent && message.error(lang('Unknown Error!'))
          break
        }
        case EnumResponseCode.ERROR_ABORT: {
          reject(EnumResponseCode.ERROR_ABORT)
          !params?.silent && message.error(lang('Request Timeout!'))
          break
        }
        case EnumResponseCode.ERROR_SERVICE_UNAVAILABLE: {
          reject(EnumResponseCode.ERROR_SERVICE_UNAVAILABLE)
          !params?.silent && message.error(lang('Service Unavailable!'))
          break
        }
      }
    })

    return promise
  }

  return { post }
}
