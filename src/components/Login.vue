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
               variant="danger"
               dismissible
               :show="showDismissibleAlert"
               @dismissed="showDismissibleAlert=false">
        {{ form.err }}
      </b-alert>
      <br/>
      <span>
        <b-button type="submit" style="background-color: #002c76">Submit</b-button>
        <br/>
        <b-button type="reset" style="background-color: #EE7622">Clear</b-button>
      </span>
    </b-form>
  </div>
</template>

<script>
  import * as Auth from '../auth.js'
  import * as crypto from 'crypto'
  import {eventBus} from '../app.js'

  export default {
    name: "Login",
    data() {
      return {
        form: {
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
        evt.preventDefault();
        //alert(JSON.stringify(this.form));
        var hash = crypto.createHash('sha256');
        var pass = hash.update(this.form.password).digest('hex');
        //console.log("User pass hash: " + pass);
        var self = this;
        Auth.authenticateUser(this.form.username, pass, function (jwt) {
          if (jwt instanceof Error) {
            self.form.err = jwt.message;
            self.showDismissibleAlert = true;
          }
          else {
            sessionStorage.setItem('jwt', jwt);
            self.$parent.$router.replace('/');
            eventBus.$emit('loggedIn', true);
            //alert(JSON.stringify(jwt));
          }
        });
      },
      onReset(evt) {
        evt.preventDefault();
        /* Reset our form values */
        this.form.username = '';
        this.form.password = '';
        /* Trick to reset/clear native browser form validation state */
        this.show = false;
        this.$nextTick(() => {
          this.show = true
        });
      }
    }
  }
</script>

<style scoped>

</style>
