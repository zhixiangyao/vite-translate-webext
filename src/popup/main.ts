import { createApp } from 'vue'

import { setupApp } from '~/logic'
import App from './Popup.vue'
import '~/styles'

const app = createApp(App)
setupApp(app, { context: 'popup' })
app.mount('#app')
