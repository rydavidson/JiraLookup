import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import navbar from './components/jl-navbar.vue'
import dosearch from './components/jl-do-search.vue'
import dologin from './components/jl-do-login.vue'
import adminpage from './components/jl-admin.vue'
import VueRouter from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import store from './store.js'
import auth from './lib/auth.js';

// css
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueRouter);
Vue.use(BootstrapVue);
Vue.use(Vuetify);


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
        path: '/admin',
        name: 'admin',
        component: adminpage,
        meta: {
            requiresAuth: true,
            requiresAdmin: true
        }
    },
    {
        path: '/',
        name: 'app',
        component: dosearch,
        meta: {
            requiresAuth: true
        }
    },
    // {
    //     path: '/404',
    //     component: NotFound
    // },
    {
        path: '*',
        redirect: '/'
    },
]


const router = new VueRouter({
    // mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if(sessionStorage.getItem('jwt') !== null){
            if(store.state.token === null){
                store.commit('setToken', sessionStorage.getItem('jwt'));
            }
        }
        if (store.state.token !== null) {
            if (to.matched.some(record => record.meta.requiresAdmin)) {
                if (auth.authorizeAdmin(store.state.token)) {
                    next();
                }
                else {
                    next({path: '/'});
                }
            }
            else {
                next();
            }
        }
        else {
            next({path: '/login?from=' + to.path});
        }
    }
    else if (to.matched.some(record => record.meta.guest)) {
        next();
    } else {
        next();
    }
})

export const eventBus = new Vue();


const app = new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')