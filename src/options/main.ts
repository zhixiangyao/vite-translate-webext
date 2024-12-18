import { createApp } from 'vue'

import App from './Options.vue'
import { setupApp } from '~/logic'
import '~/styles'

const app = createApp(App)
setupApp(app, { context: 'options' })
app.mount('#app')
