<template>
    <div id="login">
        <v-app id="inspire">
            <v-content>
                <v-container fluid fill-height>
                    <v-layout align-center justify-center>
                        <v-flex xs12 sm8 md4>
                            <v-card class="elevation-12">
                                <v-toolbar dark color="primary">
                                    <v-toolbar-title>Login</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                </v-toolbar>
                                <v-card-text>
                                    <v-form ref="form" v-model="valid" lazy-validation>
                                        <v-text-field prepend-icon="person"
                                                      name="login"
                                                      label="Username"
                                                      type="text"
                                                      v-model="details.username"
                                                      :rules="usernameRules"
                                                      required
                                        ></v-text-field>
                                        <v-text-field prepend-icon="lock"
                                                      name="password"
                                                      label="Password"
                                                      id="password"
                                                      type="password"
                                                      v-model="details.password"
                                                      :rules="passwordRules"
                                                      required
                                        ></v-text-field>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn type="submit" @click="onSubmit" :disabled="!valid">Login</v-btn>
                                            <v-btn @click="onReset">Clear</v-btn>
                                        </v-card-actions>
                                    </v-form>
                                    <v-alert
                                            dismissible
                                            type="error"
                                            :value="showDismissibleAlert"
                                    >
                                        {{details.err}}
                                    </v-alert>
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-content>
        </v-app>
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
                valid: true,
                usernameRules: [
                    v => !!v || 'Username is required'
                ],
                passwordRules: [
                    v => !!v || 'Password is required'
                ],
                details: {
                    username: '',
                    password: '',
                    err: ""
                },
                show: true,
                showDismissibleAlert: false
            }
        },
        methods: {
            onSubmit(evt) {
                let self = this;
                if (self.$refs.form.validate()) {
                    evt.preventDefault();
                    let hash = crypto.createHash('sha256');
                    let pass = hash.update(self.details.password).digest('hex');
                    Auth.authenticateUser(self.details.username, pass, function (jwt) {
                        if (jwt instanceof Error) {
                            self.details.err = jwt.message;
                            self.showDismissibleAlert = true;
                        }
                        else {
                            sessionStorage.setItem('jwt', jwt);
                            self.$store.commit('setToken', jwt);
                            self.$store.commit('setPassword',pass);
                            self.$store.commit('setUsername',self.details.username);
                            eventBus.$emit('loggedIn', true);
                            if(typeof self.$route.query.from === 'undefined'){
                                self.$parent.$router.replace('/');
                            } else  {
                                self.$parent.$router.replace(self.$route.query.from);
                            }

                        }
                    });
                }
            },
            onReset(evt) {
                evt.preventDefault();
                this.$refs.form.reset();
                this.$nextTick(() => {
                    this.show = true
                });
            }
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
