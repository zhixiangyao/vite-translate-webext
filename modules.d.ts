declare global {
  type Context = 'popup' | 'options' | 'content'
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $app: {
      context: Context
    }
  }
}

// https://stackoverflow.com/a/64189046/479957
export {}
