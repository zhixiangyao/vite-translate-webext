import type { App, ComponentCustomProperties } from 'vue'

export function setupApp(app: App, properties: ComponentCustomProperties['$app']) {
  // Inject a globally available `$app` object in template
  app.config.globalProperties.$app = properties

  // Provide access to `app` in script setup with `const app = inject('app')`
  app.provide('app', app.config.globalProperties.$app)

  // Here you can install additional plugins for all contexts: popup, options page and content-script.
  // example: app.use(i18n)
  // example excluding content-script context: if (context !== 'content-script') app.use(i18n)
}
