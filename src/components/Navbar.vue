<template>
  <b-navbar toggleable="md" type="dark" variant="info">

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand href="#">Jira Lookup</b-navbar-brand>
    <b-collapse is-nav id="nav_collapse">

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-navbar-brand>Search Mode: {{mode}} </b-navbar-brand>
        <b-nav-item-dropdown id="searchDropdown" text="Switch Search Mode" right>
          <b-dropdown-item href="#" v-on:click="mode='Case #'">Salesforce Case</b-dropdown-item>
          <b-dropdown-item href="#" v-on:click="mode='Account'">Salesforce Account</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item v-if="loggedIn" v-on:click="logOut">Logout</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>

</template>

<script>

  import { eventBus } from '../app.js';

    export default {

      name: "Navbar",
      data() {
          return{
            mode: "Case #",
            loggedIn: false
          }
      },
      methods: {
        logOut(){
          sessionStorage.removeItem('jwt');
          eventBus.$emit('loggedIn', false);
          this.$parent.$router.replace('/login');
        }
      },
      created() {
        eventBus.$on('loggedIn', (loggedIn) => {
          this.loggedIn = loggedIn;
        });
      }

    }
</script>

<style scoped>

</style>
