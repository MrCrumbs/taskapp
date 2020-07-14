import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import Vuetify from 'vuetify'
import store from './store'

Vue.use(Vuetify, {
  rtl: true
})
Vue.config.productionTip = false

 window.baseURL = 'https://taskapp-backend.herokuapp.com/api/'

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
