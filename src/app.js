import Vue from 'vue'
import App from './App.vue'
import Navbar from './components/Navbar.vue'
import ResultView from './components/ResultView.vue'
import Login from './components/Login.vue'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import Auth from './auth.js';

// css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './app.css'

const crypto = require('crypto');

Vue.use(VueRouter);
Vue.use(BootstrapVue);

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      guest: true
    }
  },
  {
    path: '/',
    name: 'view',
    component: ResultView,
    meta: {
      requiresAuth: true
    }
  }
]


const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (sessionStorage.getItem('jwt') == null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      //let user = JSON.parse(localStorage.getItem('user'));
      next()
    }
  } else if(to.matched.some(record => record.meta.guest)) {
    if(sessionStorage.getItem('jwt') == null){
      next()
    }
    else{
      next({ name: 'view'})
    }
  }else {
    next()
  }
})

export const eventBus = new Vue();

const app = new Vue({
  render: h => h(App),
  router
}).$mount('#app')

const nav = new Vue({
  render: h => h(Navbar),
  router
}).$mount('#nav')

const login = new Vue({
  render: h => h(Login),
  router
})


// const login = new Vue({
//   render: h => h(Login),
//   router
// }).$mount('#login')
