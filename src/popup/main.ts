import { createApp } from 'vue'

import '../styles'
import App from './Popup.vue'
import { setupApp } from '~/logic'

const app = createApp(App)
setupApp(app, 'popup')
app.mount('#app')
