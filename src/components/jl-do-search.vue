<template>
  <div>
    <b-form @submit="onSubmit">
      <b-form-group id="search">
        <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="Enter Salesforce Case Number" v-model="sfid"
                      required></b-form-input>
        <br/>
        <b-button size="lg" style="background-color: #002c76" type="submit">Search</b-button>
      </b-form-group>
    </b-form>
    <b-alert id="small-alert"
             variant="danger"
             dismissible
             :show="showDismissibleAlert"
             @dismissed="showDismissibleAlert=false">
      {{ err }}
    </b-alert>
    <br/>
    <div id="results">
      <resultitems v-if="showResults"></resultitems>
    </div>
  </div>
</template>

<script>
  import resultitems from "./jl-result-items";
  import * as Auth from '../lib/auth.js'
  import {eventBus} from '../app.js'

  export default {
    name: "dosearch",
    components: {resultitems},
    data() {
      return {
        sfid: "",
        showDismissibleAlert: false,
        err: "",
        devLogin: false,
        localLogin: false,
        showResults: true
      }
    },
    methods: {
      onSubmit(evt) {

        evt.preventDefault();

        console.log("Submit clicked");
        //
        // if(this.sfid.length === 0){
        //   this.err = "You must provide a case number to search for";
        //   this.showDismissibleAlert = true;
        //   return;
        // }
        var api = process.env.API_URL || "https://jiralookup-backend.herokuapp.com";

        if(this.devLogin){
          api = process.env.API_URL || "https://jiralookup-backend-dev.herokuapp.com/";
        }

        api += "/search/case/";

        var xhr = Auth.createCORSRequest("GET", api + this.sfid);

        //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", sessionStorage.getItem("jwt"));

        xhr.onreadystatechange = function () {

          if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 203 || this.status === 200 || this.status === 304) {
              var res = JSON.parse(this.responseText);
              eventBus.$emit('resultReturned', res);
            }
            else if (this.status === 204) {
              this.showResults = false;
              eventBus.$emit('emptyResult', true);
            }
            else if (this.status === 400) {
              this.showResults = false;
              eventBus.$emit('invalidInput', true);
            }
            else {
              this.err = this.responseText;
              this.showDismissibleAlert = true;
              // console.error(this.status);
            }
          }
        }
        xhr.send();
      }
    },
    created() {
      eventBus.$on('devLogin', (devLogin) => {
        this.devLogin = devLogin;
      });
    }
  }


</script>

<style scoped>

  #search {
    width: 20%;
    min-width: 250px;
    margin: auto;
  }

</style>
