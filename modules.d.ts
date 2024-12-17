declare global {
  type Context = 'popup' | 'options' | 'content-script'
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $app: {
      context: Context
    }
  }
}

// https://stackoverflow.com/a/64189046/479957
export {}
