<template>
    <div>
        <b-form @submit="onSubmit">
            <b-form-group id="search">
                <b-form-input size="sm" class="mr-sm-2" type="text" :placeholder="placeholderText"
                              v-model="searchKey"
                              required></b-form-input>
                <br/>
                <b-button size="lg" style="background-color: #002c76" type="submit">Search</b-button>
            </b-form-group>
        </b-form>
        <b-alert id="small-alert"
                 :variant="errVariant"
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
                searchKey: "",
                showDismissibleAlert: false,
                errVariant: "danger",
                err: "",
                localLogin: true,
                showResults: true,
                searchMode: 'Case #',
                placeholderText: 'Enter Salesforce #'
            }
        },
        methods: {
            onSubmit(evt) {

              const sfReg = /[a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9]-[0-9][0-9][0-9][0-9][0-9]+/gmi;
              const sfReg2 = /[a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9]-[0-9][0-9][0-9][0-9][0-9]+/gmi;
              const jiraReg = /^[a-z]*-[0-9]+$/gmi;
              const jiraReg2 = /^[a-z]*[0-9]+$/gmi;


              evt.preventDefault();

              const apiRoot = window.location.href.split("/")[0] + "/api";
              let api;

              api = apiRoot + "/search/case/";

                if (this.searchMode === 'Jira ID') {

                    api = apiRoot + "/search/jira/";
                }

              const sf = sfReg.exec(this.searchKey);
              const sf2 = sfReg2.exec(this.searchKey);
              const j = jiraReg.exec(this.searchKey);
              const j2 = jiraReg2.exec(this.searchKey);

              if (sf !== null || sf2 != null) {
                    eventBus.$emit('switchMode', 'Case #');
                    api = apiRoot + "/search/case/";
                }

                if (j !== null || j2 != null) {
                    eventBus.$emit('switchMode', 'Jira ID');
                    api = apiRoot + "/search/jira/";
                }

              const xhr = Auth.createCORSRequest("GET", api + this.searchKey);

              //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.setRequestHeader("Authorization", sessionStorage.getItem("jwt"));

                xhr.onreadystatechange = function () {

                    if (this.readyState === XMLHttpRequest.DONE) {
                        if (this.status === 203 || this.status === 200 || this.status === 304) {
                          const res = JSON.parse(this.responseText);
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
                            this.errVariant = "danger";
                            this.showDismissibleAlert = true;
                            // console.error(this.status);
                        }
                    }
                };
                xhr.send();
            }
        },
        created() {
            this.err = "WARNING! This site will no longer be available after Friday, September 21st";
            this.errVariant = "warning";
            this.showDismissibleAlert = true;
            eventBus.$on('switchMode', (mode) => {
                this.searchMode = mode;
                if (mode === 'Case #') {
                    this.placeholderText = 'Enter Salesforce #';
                }
                if (mode === 'Jira ID') {
                    this.placeholderText = 'Enter Jira #';
                }
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
