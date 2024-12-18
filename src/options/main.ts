import { createApp } from 'vue'

import { setupApp } from '~/logic'
import App from './Options.vue'
import '~/styles'

const app = createApp(App)
setupApp(app, { context: 'options' })
app.mount('#app')
