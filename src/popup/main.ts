import { createApp } from 'vue'

import App from './Popup.vue'
import { setupApp } from '~/logic'
import '~/styles'

const app = createApp(App)
setupApp(app, { context: 'popup' })
app.mount('#app')
