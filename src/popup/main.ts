import { createApp } from 'vue'

import '../styles'
import App from './Popup.vue'
import { setupApp } from '~/logic/common-setup'

const app = createApp(App)
setupApp(app, 'popup')
app.mount('#app')
