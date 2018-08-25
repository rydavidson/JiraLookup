import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
    user: {},
    password: "",

}

export default new Vuex.Store({
    state
})