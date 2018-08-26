import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
    token: null,
    password: null,
    username: null,
    pinnedSearches: []
}

const mutations = {
    setToken(state, token){
        state.token = token;
    },
    setPassword(state, password){
        state.password = password;
    },
    setUsername(state, username){
        state.username = username;
    },
    pinnedSearches(state, pinnedSearches){
        state.pinnedSearches = pinnedSearches;
    }
}

export default new Vuex.Store({
    state,
    mutations
})