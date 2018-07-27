<template>
  <b-card title=title
          style="max-width: 20rem;"
          class="mb-2">
    <p class="card-text">
      {{resultText}}
    </p>
    <b-button href="#" variant="primary">Go somewhere</b-button>
  </b-card>
</template>

<script>
    export default {
        name: "ResultView",
      data(){
          return{
            title: "",
            resultText: ""
          }
      }
    }
</script>

<style scoped>

</style>
