import Vue from 'vue'
import App from './App.vue'
import navbar from './components/jl-navbar.vue'
import dosearch from './components/jl-do-search.vue'
import resultitems from './components/jl-result-items.vue'
import dologin from './components/jl-do-login.vue'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import store from './store.js'

// css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueRouter);
Vue.use(BootstrapVue);


const routes = [
    {
        path: '/login',
        name: 'login',
        component: dologin,
        meta: {
            guest: true
        }
    },
    {
        path: '/search',
        name: 'search',
        component: dosearch,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/result',
        name: 'result',
        component: resultitems,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/',
        name: 'app',
        component: dosearch,
        meta: {
            requiresAuth: true
        }
    }
]


const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (sessionStorage.getItem('jwt') == null) {
            next({
                path: '/login',
                params: {nextUrl: to.fullPath}
            })
        } else {
            next()
        }
    } else if (to.matched.some(record => record.meta.guest)) {
        if (sessionStorage.getItem('jwt') == null) {
            next()
        }
        else {
            next({name: from})
        }
    } else {
        next()
    }
})

export const eventBus = new Vue();


const app = new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')

const nav = new Vue({
    render: h => h(navbar),
    router,
    store
}).$mount('#nav')

// const login = new Vue({
//     render: h => h(dologin),
//     router,
//     store
// })