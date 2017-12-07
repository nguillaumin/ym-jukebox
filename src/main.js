// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import YmPlayer from './YmPlayer'

import 'font-awesome/css/font-awesome.min.css'
import 'typeface-exo-2/index.css'
import './assets/styles.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#ym-player',
  template: '<YmPlayer />',
  components: { YmPlayer }
})
