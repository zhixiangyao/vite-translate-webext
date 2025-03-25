import 'webext-bridge'

declare module 'webext-bridge' {
  export interface ProtocolMap {
    // define message protocol types
    // see https://github.com/antfu/webext-bridge#type-safe-protocols
    'event-fetch-send': { tabId: number, url: string, headers?: Record<string, string>, params?: Record<string, any>, timeout?: number }
    'event-fetch-on': { code: number, response?: unknown }
  }
}
