<template>
  <div id="app">
        <router-view></router-view>
  </div>
</template>

<script>
  export default {

    data() {
      return {
        msg: "Welcome to Jira Lookup"
      }
    },
    methods: {
      goBack() {
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push('/')
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
   /*height: 80%;*/
    /*max-height: 80%;*/
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  div{
    max-height: 100%;
  }

  html, body {
    height: 100%;
  }

  #results {
    height: 70vh;
  }
</style>
