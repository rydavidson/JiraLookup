<template>
  <!---
  <b-card title=Results
          class="mb-2">
    <p class="card-text" v-if="showResult">
      <strong>Title:</strong> {{results.title}}
      <strong>Status:</strong> {{results.status.publicStatus}}
      <strong>Jira ID:</strong> {{results.key}}
      <a :href="results.sfuri">Go to Salesforce Case</a>
    </p>
  </b-card>
  --->
  <div>
    <div class="card" v-if="showResult">
      <div class="card-header">{{results.key}}</div>
      <div class="card-main">
        <i class="material-icons">check_box</i>
        <div class="main-description">
          <p><strong>Status: </strong>{{results.status.publicStatus}}</p>
          <p id="result-description"><strong>Description: </strong><br/>{{results.title}}</p>
          <b-tooltip target="result-description" placement="top" boundary="window">
            {{results.title}}
          </b-tooltip>
          <p><strong>Targeted Release: </strong>{{results.fixtarget}}</p>
        </div>
      </div>
    </div>
    <b-alert id="small-alert"
             variant="danger"
             dismissible
             :show="showDismissibleAlert"
             @dismissed="showDismissibleAlert=false">
      {{ err }}
    </b-alert>
  </div>
</template>

<script>
  import {eventBus} from '../app.js'

  export default {
    name: "ResultView",
    data() {
      return {
        title: "",
        resultText: "No results",
        showResult: false,
        showDismissibleAlert: false,
        err: "",
        results: {
          key: "",
          title: "",
          priority: "",
          sfid: "",
          sfuri: "",
          fixtarget: "",
          released: "",
          status: {
            name: "",
            publicStatus: "",
            description: ""
          }
        }
      }
    },
    methods: {},
    created() {
      eventBus.$on('resultReturned', (result) => {
        this.showDismissibleAlert = false;
        this.err = "";
        this.results.key = result.key;
        this.results.title = result.title.trim();
        this.results.priority = result.priority;
        this.results.sfid = result.sfid;
        this.results.sfuri = result.sfuri;
        this.results.fixtarget = result.fixtarget;
        this.results.released = result.released;
        this.results.status = result.status;
        this.showResult = true;
      });
      eventBus.$on('emptyResult', (isEmpty) => {
        this.showResult = false;
        this.err = "No results returned";
        this.showDismissibleAlert = true;
      });
    }

  }
</script>

<style scoped>

  .card {
    width: 200px;                 /* Set width of cards */
    border: 1px solid #EF9A9A;    /* Set up Border */
    border-radius: 4px;           /* Slightly Curve edges */
    overflow: hidden;             /* Fixes the corners */
    display: flex;                /* Children use Flexbox */
    flex-direction: column;       /* Rotate Axis */
    margin: auto;
    height: 200px;
    text-overflow: ellipsis;
  }

  .card-header {
    color: #D32F2F;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    border-bottom: 1px solid #EF9A9A;
    background-color: #FFEBEE;
    padding: 5px 10px;
  }

  .card-main {
    display: flex;              /* Children use Flexbox */
    flex-direction: column;     /* Rotate Axis to Vertical */
    justify-content: center;    /* Group Children in Center */
    align-items: center;        /* Group Children in Center (+axis) */
    padding: 15px 0;            /* Add padding to the top/bottom */
  }

  .material-icons {
    font-size: 36px;
    color: #D32F2F;
    margin-bottom: 5px;
  }

  .main-description {
    color: #D32F2F;
    font-size: 12px;
    text-align: center;
    text-overflow: ellipsis;
    min-width: 0;
    min-height: 0;
  }

  #small-alert{
    width: 20%;
    min-width: 100px;
    margin: auto;
  }

</style>
