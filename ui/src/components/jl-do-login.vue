<template>
    <div>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <b-form-group id="loginGroup"
                          label="Sign In"
                          label-for="loginForm">
                <b-form-input id="usernameInput"
                              label="Password"
                              type="text"
                              v-model="form.username"
                              required
                              placeholder="Enter username">
                </b-form-input>
                <b-form-input id="passwordInput"
                              type="password"
                              v-model="form.password"
                              required>
                </b-form-input>
            </b-form-group>

            <b-alert id="small-alert"
                     :variant="form.variant"
                     dismissible
                     :show="showDismissibleAlert"
                     @dismissed="showDismissibleAlert=false">
                {{ form.err }}
            </b-alert>
            <br/>
            <span>
        <b-button type="submit" style="background-color: #002c76">Submit</b-button>
        <b-button type="reset" style="background-color: #EE7622">Clear</b-button>
      </span>
        </b-form>
    </div>
</template>

<script>
    import * as Auth from '../lib/auth.js'
    import * as crypto from 'crypto'
    import {eventBus} from '../app.js'

    export default {
        name: "dologin",
        data() {
            return {
                form: {
                    username: '',
                    password: '',
                    err: "",
                    variant: "danger"
                },
                show: true,
                showDismissibleAlert: false
            }
        },
        methods: {
            onSubmit(evt) {
                evt.preventDefault();
              const hash = crypto.createHash('sha256');
              const pass = hash.update(this.form.password).digest('hex');
              const self = this;
              Auth.authenticateUser(this.form.username, pass, function (jwt) {
                    if (jwt instanceof Error) {
                        self.form.variant = "danger";
                        self.form.err = jwt.message;
                        self.showDismissibleAlert = true;
                    }
                    else {
                        sessionStorage.setItem('jwt', jwt);
                        self.$parent.$router.replace('/search');
                        eventBus.$emit('loggedIn', true);
                    }
                });
            },
            onReset(evt) {
                evt.preventDefault();
                this.form.username = '';
                this.form.password = '';
                this.show = false;
                this.$nextTick(() => {
                    this.show = true
                });
            }
        },
        created() {
            this.form.err = "WARNING! This site will no longer be available after Friday, September 21st";
            this.form.variant = "warning";
            this.showDismissibleAlert = true;
        }
    }
</script>

<style>

    #loginGroup {
        width: 20%;
        min-width: 250px;
        margin: auto;
    }

    #small-alert {
        width: 20%;
        min-width: 100px;
        margin: auto;
    }

    button {
        padding: 5px;
    }

</style>
