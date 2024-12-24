import { createApp } from 'vue'

import { setupApp } from '~/logic'
import App from './Options.vue'
import router from './router'
import '~/styles'

const app = createApp(App)
app.use(router)
setupApp(app, { context: 'options' })
app.mount('#app')
