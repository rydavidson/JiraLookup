<template>
  <container>
    <div class="card" v-if="showSingleResult" v-for="result in results" :key="result.key">
      <div class="card-header">{{result.key}}</div>
      <div class="card-main">
        <i class="material-icons">{{icon}}</i>
        <div class="main-description">
          <p><strong>Status: </strong>{{result.status.publicStatus}}</p>
          <p><strong>Targeted Release: </strong>{{result.fixtarget}}</p>
          <p><strong>Description: </strong></p>
          <p id="result-description">{{result.title}}</p>
          <!--
          <b-tooltip target="result-description" placement="top" boundary="window">
            {{results.title}}
          </b-tooltip>
          -->
        </div>
      </div>
    </div>
    <div class="multiResult" v-if="showMultiResult">

    </div>
    <b-alert id="small-alert"
             variant="danger"
             dismissible
             :show="showDismissibleAlert"
             @dismissed="showDismissibleAlert=false">
      {{ err }}
    </b-alert>
  </container>
</template>

<script>
  import {eventBus} from '../app.js'

  export default {
    name: "resultitems",
    data() {
      return {
        title: "",
        resultText: "No results",
        showSingleResult: false,
        showMultiResult: false,
        showDismissibleAlert: false,
        err: "",
        icon: "check_box",
        results:[]
      }
    }

    ,
    methods: {}
    ,
    created() {
      eventBus.$on('resultReturned', (result) => {
        // console.log(result);
        this.showDismissibleAlert = false;
        this.err = "";
        this.results = [];
        self = this;
        result.results.forEach(function(e){
          self.results.push(e);
        });
        this.showSingleResult = true;
      });
      eventBus.$on('emptyResult', (e) => {
        this.showSingleResult = false;
        this.err = "No results returned";
        this.showDismissibleAlert = true;
      });
      eventBus.$on('invalidInput', (e) => {
        console.log("Invalid input fired");
        this.showSingleResult = false;
        this.err = "Invalid input";
        this.showDismissibleAlert = true;
      });
    }

  }
</script>

<style scoped>

  .card {
    width: 20%;
    border: 1px solid #3aadef;
    border-radius: 4px;
    overflow: hidden;
    display: inline-block;
    flex-direction: column;
    margin: auto;
    height: 20%;
    text-overflow: ellipsis;
  }

  .card-header {
    color: #1514d3;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    border-bottom: 1px solid #3aadef;
    background-color: #ddf3ff;
    padding: 5px 10px;
  }

  .card-main {
    display: flex; /* Children use Flexbox */
    flex-direction: column; /* Rotate Axis to Vertical */
    justify-content: center; /* Group Children in Center */
    align-items: center; /* Group Children in Center (+axis) */
    padding: 15px 0 0 0; /* Add padding to the top/bottom */
  }

  .material-icons {
    font-size: 36px;
    color: #1514d3;
    margin-bottom: 5px;
  }

  .main-description {
    color: #1514d3;
    font-size: 12px;
    text-align: center;
    height: auto;
    min-width: 0;
    min-height: 0;
  }

  #result-description {
    overflow-y: auto;
    height: 150px;
    width: auto;
    text-overflow: ellipsis;
  }

  #small-alert {
    width: 20%;
    min-width: 100px;
    margin: auto;
  }

  p {
    margin-bottom: 0rem;
  }

</style>
