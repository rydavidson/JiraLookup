<template>
    <div>
        <div class="card" v-if="showSingleResult" v-for="result in results" :key="result.key">
            <div class="card-header">
                <p><a :href="result.jirauri" target="_blank">Jira Item: {{result.key}} <span
                        class="fas fa-external-link-alt"></span></a></p>
                <p v-if="result.sfuri"><a :href="result.sfuri" target="_blank">Case #: {{result.sfid}} <span
                        class="fas fa-external-link-alt"></span></a></p>
            </div>
            <div class="card-main">
                <p><strong>{{result.summary}}</strong></p>
                <i class="material-icons">{{result.status.icon}}</i>
                <div class="main-description">
                    <p id="public-status" v-b-tooltip.hover :title="result.status.description"><strong>Status: </strong>{{result.status.publicStatus}}
                    </p>
                    <p><strong>Last Updated: </strong>{{result.updated}}</p>
                    <p><strong>Targeted Release: </strong>{{result.fixtarget}}</p>

                    <p><strong>Description: </strong></p>
                    <p id="result-description" v-html="result.title"></p>
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
                showSingleResult: false,
                showDismissibleAlert: false,
                err: "",
                results: []
            }
        }

        ,
        methods: {
            escapeHtml(unsafe) {
                return unsafe
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
            }
        }
        ,
        created() {
            eventBus.$on('resultReturned', (result) => {
                // console.log(result);
                this.showDismissibleAlert = false;
                this.err = "";
                this.results = [];
                var self = this;
                result.results.forEach(function (e) {
                    var regger = /\r?\n|\r/g;
                    e.title = self.escapeHtml(e.title);
                    // console.log(regger.test(e.title));
                    e.title = e.title.replace(regger, "<br/>");
                    // console.log(e.title);
                    //e.title = "<div>" + e.title + "</div>";
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
        min-width: 25rem;
        border: 1px solid #3aadef;
        border-radius: 4px;
        overflow: hidden;
        display: inline-block;
        flex-direction: column;
        margin: auto;
        max-height: 80%;
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
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 15px 0 0 0;
        max-height: 60vh;
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
        min-width: 0;
        min-height: 0;
        max-width: 100%;
        max-height: 100%;
    }

    #result-description {
        overflow: auto;
        -ms-overflow-style: auto;
        height: 100%;
        width: auto;
    }

    #small-alert {
        width: 20%;
        min-width: 100px;
        margin: auto;
    }

    #result-description {
        max-height: 45vh;
    }

    p {
        margin-bottom: 0rem;
    }

    nav {
        height: auto;
    }

    a:link {
        color: #1514d3 !important;
    }

    a:visited {
        color: #42b983 !important;
    }

</style>
