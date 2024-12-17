declare global {
  type Context = 'popup' | 'options'
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
