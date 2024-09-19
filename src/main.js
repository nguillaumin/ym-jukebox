import './assets/main.css'

import { createApp } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPlay,
  faPlus,
  faTimes,
  faStepBackward,
  faStepForward,
  faPause,
  faPlusCircle
} from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import YmPlayer from './YmPlayer.vue'

import '@fontsource/exo-2/index.css'

library.add(faPlay, faPlus, faTimes, faStepBackward, faStepForward, faPause, faPlusCircle, faGithub)

createApp(YmPlayer).component('font-awesome-icon', FontAwesomeIcon).mount('#ym-player')
