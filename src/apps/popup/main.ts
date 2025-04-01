import { createApp } from 'vue'
import App from '~/apps/popup/Popup.vue'
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'

const app = createApp(App)
app.mount('#app')
