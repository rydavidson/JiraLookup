<template>
    <div id="app">
        <v-app
                dark
                id="inspire"
        >
            <v-navigation-drawer
                    fixed
                    clipped
                    v-model="drawer"
                    app
            >
                <v-list dense>
                    <!--<v-list-tile-title class="title" prepend-icon="person">-->
                    <!--{{username}}-->
                    <!--</v-list-tile-title>-->
                    <v-list-tile
                            v-if="showPinnedSearch"
                            v-for="search in pinnedSearches"
                            :key="search.searchKey"
                            @click="pinnedSearch(search,$event)"
                    >
                    </v-list-tile>
                    <v-list-tile class="mt-3" @click="">
                        <v-list-tile-action>
                            <v-icon color="grey darken-1">add_circle_outline</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-title class="grey--text text--darken-1">Pin Current Search</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="">
                        <v-list-tile-action>
                            <v-icon color="grey darken-1">settings</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-title class="grey--text text--darken-1">Settings</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-navigation-drawer>
            <v-toolbar
                    color="blue"
                    dense
                    fixed
                    clipped-left
                    app
            >
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <v-toolbar-title class="mr-5 align-center">
                    <span class="title">Jira Lookup</span>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-layout row align-center style="max-width: 650px" @submit="onSubmit">
                    <v-form @submit="onSubmit" row>
                        <v-text-field
                                placeholder="Enter Case # or Jira ID"
                                single-line
                                append-icon="search"
                                @click:append="() => {}"
                                color="white"
                                hide-details
                                v-model="searchKey"
                        ></v-text-field>
                    </v-form>
                </v-layout>
            </v-toolbar>
            <v-content>
                <v-container fill-height>
                    <v-layout justify-center align-center>
                        <v-flex shrink>
                            <div id="results">
                                <resultitems v-if="showResults"></resultitems>
                            </div>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-content>
        </v-app>
    </div>
    <!--<div>-->
    <!--<b-form @submit="onSubmit">-->
    <!--<b-form-group id="search">-->
    <!--<b-form-input size="sm" class="mr-sm-2" type="text" :placeholder="placeholderText"-->
    <!--v-model="searchKey"-->
    <!--required></b-form-input>-->
    <!--<br/>-->
    <!--<b-button size="lg" style="background-color: #002c76" type="submit">Search</b-button>-->
    <!--</b-form-group>-->
    <!--</b-form>-->
    <!--<b-alert id="small-alert"-->
    <!--variant="danger"-->
    <!--dismissible-->
    <!--:show="showDismissibleAlert"-->
    <!--@dismissed="showDismissibleAlert=false">-->
    <!--{{ err }}-->
    <!--</b-alert>-->
    <!--<br/>-->
    <!--<div id="results">-->
    <!--<resultitems v-if="showResults"></resultitems>-->
    <!--</div>-->
    <!--</div>-->
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
                drawer: true,
                searchKey: "",
                showDismissibleAlert: false,
                err: "",
                localLogin: true,
                showResults: true,
                searchMode: 'Case #',
                placeholderText: 'Enter Salesforce #',
                username: this.capitalizeFirstLetter(this.$store.state.username),
                showPinnedSearch: false,
                pinnedSearches: []
            }
        },
        methods: {
            capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            },
            pinnedSearch(searchObject, evt) {
                this.searchKey = searchObject.searchKey;
                onSubmit(evt);
            },
            onSubmit(evt) {

                var sfReg = /[a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9]-[0-9][0-9][0-9][0-9][0-9][0-9]/gmi;
                var sfReg2 = /[a-z0-9][a-z0-9][a-z0-9][a-z0-9][a-z0-9]-[0-9][0-9][0-9][0-9][0-9][0-9]/gmi;
                var jiraReg = /^[a-z]*-[0-9]*$/gmi;
                var jiraReg2 = /^[a-z]*[0-9]*$/gmi;


                evt.preventDefault();

                var apiRoot = window.location.href.split("/")[0] + "/api";
                var api;

                api = apiRoot + "/search/case/";

                if (this.searchMode === 'Jira ID') {

                    api = apiRoot + "/search/jira/";
                }

                var sf = sfReg.exec(this.searchKey);
                var sf2 = sfReg2.exec(this.searchKey);
                var j = jiraReg.exec(this.searchKey);
                var j2 = jiraReg2.exec(this.searchKey);

                if (sf !== null || sf2 != null) {
                    eventBus.$emit('switchMode', 'Case #');
                    api = apiRoot + "/search/case/";
                }

                if (j !== null || j2 != null) {
                    eventBus.$emit('switchMode', 'Jira ID');
                    api = apiRoot + "/search/jira/";
                }

                var xhr = Auth.createCORSRequest("GET", api + this.searchKey);

                //xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xhr.setRequestHeader("Authorization", this.$store.state.token);

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
            },
        },
        created() {
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

</style>
