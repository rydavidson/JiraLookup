<template>
  <div>
    <div id="search">
      <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Search"></b-form-input>
      <br/>
      <b-button size="lg" style="background-color: #002c76" type="submit">Search</b-button>
    </div>
    <div id="results">

    </div>
  </div>
</template>

<script>
    export default {
        name: "SearchView",
        data(){

        },
      methods: {
        onSubmit (evt) {
          evt.preventDefault();

        }
      }
    }


</script>

<style scoped>

</style>
