import { createApp } from 'vue'
import App from '~/apps/popup/Popup.vue'
import i18n from '~/i18n'
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'

const app = createApp(App)

app.use(i18n)
app.mount('#app')
