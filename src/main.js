import './assets/main.css'

import { createApp } from 'vue'
import YmPlayer from './YmPlayer.vue'

import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import '@fontsource/exo-2/index.css'

const app = createApp(YmPlayer)
app.mount('#ym-player')
