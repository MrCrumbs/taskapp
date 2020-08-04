import Vue from 'vue'
import Antd from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/antd.css';
import router from './router'
import vuetify from './plugins/vuetify';
import store from './store'
import Vuetify from 'vuetify'
window.Vue = Vue;
Vue.use(Vuetify, {
  rtl: true
})
Vue.use(Antd)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const loggedUser = JSON.parse(localStorage.getItem('taskManager'));

  if (requiresAuth && (!loggedUser)) {
    next('/login')
  }
  else {
    next()
  }
})

window.baseURL = 'https://taskapp-backend.herokuapp.com/api/'
//window.baseURL = 'http://localhost:4000/api/'

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
