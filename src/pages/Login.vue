<template>
  <q-page-container>
    <div v-if="settings !== null" class="row cordova-hide fixed-bottom">
      <q-btn
        v-if="canSignIn"
        color="secondary"
        flat
        label="Inschrijven"
        v-on:click="$router.push('sign-up')"
      />
      <q-btn
        v-if="canBookPublic"
        color="primary"
        flat
        label="Starttijd"
        v-on:click="$router.push('teetimes')"
      />
      <q-btn
        v-if="canBookPublic"
        color="primary"
        flat
        label="Les"
        v-on:click="$router.push('public_lessons')"
      />
      <q-btn
        v-if="canBookCourse"
        color="primary"
        flat
        label="Cursus"
        v-on:click="$router.push('classes')"
      />
    </div>

    <q-card
      v-if="settings !== null"
      class="login_card q-ml-auto q-mr-auto q-mt-xl"
    >
      <q-card-section>
        <div class="row q-mt-sm">
          <div class="col text-center">
            <img
              alt="logo"
              class="logo"
              src="../assets/images/logo-black.svg"
            />
          </div>
        </div>

        <div class="row q-mt-md q-mb-md">
          <div class="col text-center text-h5">Login met uw account</div>
        </div>

        <q-input
          v-model="form.relEmail"
          :rules="[
            (val) => (val && val.length > 0) || 'Voer aub uw e-mailadres in',
          ]"
          filled
          label="Uw e-mailadres"
          lazy-rules
        />

        <q-input
          v-model="form.repPassword"
          :rules="[
            (val) => (val && val.length > 0) || 'Voer aub uw e-wachtwoord in',
          ]"
          :type="isPwd ? 'password' : 'text'"
          filled
          label="Uw wachtwoord"
          lazy-rules
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <div class="text-center">
          <q-btn color="primary" label="Inloggen" v-on:click="onlogin" />
          <q-btn
            class="q-mt-md"
            color="primary"
            flat
            label="Wachtwoord vergeten"
            v-on:click="$router.push('verify-code')"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page-container>
</template>

<style>
.login_card {
  width: 320px;
}
</style>

<script>
import publicMixin from "../mixins/public";

export default {
  mixins: [publicMixin],
  name: "Login",
  data: function () {
    return {
      form: {
        relEmail: "",
        repPassword: "",
        repKey: "",
      },
      isPwd: true,
    };
  },
  mounted() {
    if (this.$route.query.key) {
      this.form.repKey = this.$route.query.key;
      this.onlogin();
    }
  },
  computed: {
    canSignIn: function () {
      return parseInt(this.settings.website_display_register_button) == 1;
    },
    canBookPublic: function () {
      return parseInt(this.settings.website_display_teetime_public) == 1;
    },
    canBookCourse: function () {
      return parseInt(this.settings.website_display_lessons_public) == 1;
    },
  },
  methods: {
    async onlogin() {
      this.$q.loading.show();

      if (this.$q.platform.is.desktop) {
        await this.$recaptchaLoaded();
        this.form.captcha = await this.$recaptcha("login");
      }

      this.$http
        .post("golfer/login", this.form)
        .then((res) => {
          if (res) {
            this.$ls.setItem("currentUser", res, 1000 * 60 * 60 * 24 * 1000);

            this.$http.get("golfer/settings").then((settings) => {
              this.$ls.setItem(
                "settings",
                settings,
                1000 * 60 * 60 * 24 * 1000
              );
              this.settings = settings;

              let currentUserPref = {
                matchList: {
                  subFilter: 0,
                },
              };
              this.$ls.setItem(
                "currentUserPref",
                currentUserPref,
                1000 * 60 * 60 * 24 * 7
              );

              this.$q.loading.hide();
              this.$router.push("/");
            });
          }
        })
        .catch((e) => {
          this.$message.error(e);
        });
    },
  },
};
</script>
