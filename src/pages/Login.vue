<template>

  <q-page-container>

    <q-card class="my-card q-ml-auto q-mr-auto q-mt-xl">

      <q-card-section>

        <div class="row q-mt-sm">
          <div class="col text-center">
            <img
                src="../assets/images/logo-black.svg"
                class="logo"
                alt="logo"/>
          </div>
        </div>

        <div class="row q-mt-md q-mb-md">
          <div class="col text-center text-h5">
            Login met uw account
          </div>
        </div>

        <q-input
            filled
            v-model="form.relEmail"
            label="Uw e-mailadres"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Voer aub uw e-mailadres in']"/>

        <q-input
            :type="isPwd ? 'password' : 'text'"
            filled
            v-model="form.repPassword"
            label="Uw wachtwoord"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Voer aub uw e-wachtwoord in']">
          <template v-slot:append>
            <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <div class="text-center">
          <q-btn label="Inloggen" v-on:click="onlogin" color="primary"/>
          <q-btn label="Wachtwoord vergeten" v-on:click="onResetPassword" color="primary" flat class="q-mt-md"/>
          <q-btn v-if="canSignIn" label="Inschrijven" v-on:click="onSignup" color="primary" flat/>
        </div>

      </q-card-section>

    </q-card>

  </q-page-container>

</template>

<script>

export default {
  name: "Login",
  data: function () {
    return {
      form: {
        relEmail: "",
        repPassword: "",
      },
      isPwd: true,
      settings: []
    };
  },
  mounted() {
    let that = this;
    this.$http.get(`golfer/psettings`).then((res) => {
      that.settings = res;
    });
  },
  computed: {
    canSignIn: function() {
      return parseInt(this.settings.website_display_register_button) === 1;
    }
  },
  methods: {
    onResetPassword: function () {
      this.$router.push("verify-code");
    },
    onSignup: function () {
      this.$router.push("sign-up");
    },
    onlogin: function () {
      this.$q.loading.show();
      this.$http.post("golfer/login", this.form)
          .then((res) => {
            if (res) {
              this.$ls.setItem('authorization', res.relation_password.apiToken, 1000 * 60 * 60 * 24 * 7);
              this.$ls.setItem('currentUser', res, 1000 * 60 * 60 * 24 * 7);

              console.log(this.$ls.getItem('authorization').value)

              if (this.$ls.getItem('currentUserPref').value == null) {

                let currentUserPref={
                  matchList: {
                    subFilter:0
                  }
                }
                this.$ls.setItem('currentUserPref', currentUserPref, 1000 * 60 * 60 * 24 * 7);
              }

              this.$q.loading.hide();
              this.$router.push("/");
            }
          })
          .catch((e) => {
            this.$message.error(e);
          });
    },
  },
};
</script>
