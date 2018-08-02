<template>
  <b-navbar toggleable="md" type="dark" variant="info">

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand href="#">Jira Lookup</b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav class="ml-auto">
        <b-navbar-brand>Search Mode: {{mode}} </b-navbar-brand>
        <b-nav-item-dropdown v-if="caseModeEnabled && accountModeEnabled" id="searchDropdown" text="Switch Search Mode" right>
          <b-dropdown-item v-if="caseModeEnabled" href="#" @click="switchMode">Salesforce Case</b-dropdown-item>
          <b-dropdown-item v-if="accountModeEnabled" href="#" @click="switchMode">Salesforce Account</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item v-if="loggedIn" @click="logOut">Logout</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>

</template>

<script>

  import { eventBus } from '../app.js';

    export default {
      name: "navbar",
      data() {
          return{
            mode: "Case #",
            loggedIn: false,
            caseModeEnabled: true,
            accountModeEnabled: false
          }
      },
      methods: {
        logOut(){
          this.$parent.$router.replace('/login');
          sessionStorage.removeItem('jwt');
          eventBus.$emit('loggedIn', false);
        },
        switchMode(){
          if(this.mode === 'Case #'){
            this.mode = 'Account';
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

        if(sessionStorage.getItem('jwt') !== null)
          this.loggedIn = true;
      }

    }
</script>

<style scoped>

.bg-info{
  background-color: #002c76 !important;
}

</style>
