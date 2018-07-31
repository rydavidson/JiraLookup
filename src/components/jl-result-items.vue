<template>
  <div>
    <div class="card" v-if="showResult">
      <div class="card-header">{{results.key}}</div>
      <div class="card-main">
        <i class="material-icons">check_box</i>
        <div class="main-description">
          <p><strong>Status: </strong>{{results.status.publicStatus}}</p>
          <p><strong>Targeted Release: </strong>{{results.fixtarget}}</p>
          <p><strong>Description: </strong></p>
          <p id="result-description">{{results.title}}</p>
          <!--
          <b-tooltip target="result-description" placement="top" boundary="window">
            {{results.title}}
          </b-tooltip>
          -->
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
    name: "resultitems",
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
      eventBus.$on('emptyResult', (e) => {
        this.showResult = false;
        this.err = "No results returned";
        this.showDismissibleAlert = true;
      });
      eventBus.$on('invalidInput', (e) => {
        console.log("Invalid input fired");
        this.showResult = false;
        this.err = "Invalid input";
        this.showDismissibleAlert = true;
      });
    }

  }
</script>

<style scoped>

  .card {
    width: 20%;                 /* Set width of cards */
    border: 1px solid #3aadef;    /* Set up Border */
    border-radius: 4px;           /* Slightly Curve edges */
    overflow: hidden;             /* Fixes the corners */
    display: flex;                /* Children use Flexbox */
    flex-direction: column;       /* Rotate Axis */
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
    display: flex;              /* Children use Flexbox */
    flex-direction: column;     /* Rotate Axis to Vertical */
    justify-content: center;    /* Group Children in Center */
    align-items: center;        /* Group Children in Center (+axis) */
    padding: 15px 0 0 0;            /* Add padding to the top/bottom */
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

  #small-alert{
    width: 20%;
    min-width: 100px;
    margin: auto;
  }

  p {
    margin-bottom: 0rem;
  }

</style>
