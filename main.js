import Vue from 'vue'
import App from './App'
import { http } from './js_sdk/luch-request/index.js'
import store from './store'

Vue.prototype.$http = http
Vue.prototype.$store = store
Vue.config.productionTip = false

Vue.filter('formattedYear', val => {
  const now = new Date(val)
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const date = now.getDate()
  // const hour = now.getHours()
  // const minute = now.getMinutes()
  // const second = now.getSeconds()
  return year + '-' + month + '-' + date
  // + ' ' + hour + ':' + minute + ':' + second
})

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
