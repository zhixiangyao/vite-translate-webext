import { createApp } from 'vue'
import App from './Options.vue'
import router from './router'
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
