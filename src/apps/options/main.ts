import { createApp } from 'vue'
import App from './Options.vue'
import router from './router'
import '~/styles'

const app = createApp(App)
app.use(router)
app.mount('#app')
