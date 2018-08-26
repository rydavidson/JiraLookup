<template>
    <b-navbar toggleable="md" type="dark" variant="info">

        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

        <b-navbar-brand href="#">Jira Lookup</b-navbar-brand>
        <b-collapse is-nav id="nav_collapse">
            <b-navbar-nav class="ml-auto">
                <b-navbar-brand>Search Mode: {{mode}}</b-navbar-brand>
                <b-nav-item-dropdown v-if="caseModeEnabled && jiraModeEnabled" id="searchDropdown"
                                     text="Switch Search Mode" right>
                    <b-dropdown-item v-if="caseModeEnabled" href="#" @click="switchMode('case')">Salesforce Case
                    </b-dropdown-item>
                    <b-dropdown-item v-if="jiraModeEnabled" href="#" @click="switchMode('jira')">Jira Issue
                    </b-dropdown-item>
                </b-nav-item-dropdown>
                <b-nav-item v-if="loggedIn" @click="logOut">Logout</b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>

</template>

<script>

    import {eventBus} from '../app.js';

    export default {
        name: "navbar",
        data() {
            return {
                mode: "Case #",
                loggedIn: false,
                caseModeEnabled: true,
                jiraModeEnabled: true
            }
        },
        methods: {
            logOut() {
                this.$store.commit('setToken', null);
                this.$store.commit('setPassword', null);
                sessionStorage.removeItem('jwt');
                eventBus.$emit('loggedIn', false);
                this.$parent.$router.replace('/login');

            },
            switchMode(selectedMode) {
                console.log(selectedMode);
                if (selectedMode === 'jira') {
                    this.mode = 'Jira ID';
                } else {
                    this.mode = 'Case #';
                }
                eventBus.$emit('switchMode', this.mode);
            }
        },
        created() {
            eventBus.$on('loggedIn', (loggedIn) => {
                this.loggedIn = loggedIn;
            });

            eventBus.$on('switchMode', (mode) => {
              this.mode = mode;
            });

            if (sessionStorage.getItem('jwt') !== null)
                this.loggedIn = true;
        }

    }
</script>

<style scoped>

    .bg-info {
        background-color: #002c76 !important;
    }

</style>
