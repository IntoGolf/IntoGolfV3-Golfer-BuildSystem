<template>
  <q-page-container class="fixed-top">
    <q-page>
      <div v-if="!$q.platform.is.mobile" class="row fixed-bottom">
        <q-btn
          v-if="canSignIn"
          color="primary"
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
          v-if="canBookCourse"
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

      <q-card class="login_card q-ml-auto q-mr-auto q-mt-xl">
        <q-card-section>
          <div class="row q-mt-sm">
            <div class="col text-center">
              <q-img
                :fit="'scale-down'"
                :src="blobUrl"
                style="max-width: 400px; max-height: 100px"
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
    </q-page>
  </q-page-container>
</template>

<style>
.login_card {
  width: 320px;
}
</style>

<script>
export default {
  name: "Login",
  data: function () {
    return {
      form: {
        relEmail: "",
        repPassword: "",
        repKey: "",
      },
      isPwd: true,
      blobUrl: "",
      redirect: "",
    };
  },
  mounted() {
    this.loadImage();
    if (this.$route.query.key) {
      this.form.repKey = this.$route.query.key;
      this.onlogin();
    }
    this.form.redirect = this.$route.query.redirect;
    this.form.redirect_page = this.$route.query.redirect_page;
  },
  computed: {
    canSignIn: function () {
      return (
        parseInt(
          this.$store.state.settings.publicItems.website_display_register_button
        ) === 1
      );
    },
    canBookPublic: function () {
      return (
        parseInt(
          this.$store.state.settings.publicItems.website_display_teetime_public
        ) === 1
      );
    },
    canBookCourse: function () {
      return (
        parseInt(
          this.$store.state.settings.publicItems.website_display_lessons_public
        ) === 1
      );
    },
  },
  methods: {
    loadImage() {
      this.$http
        .get(
          "golfer/image/" + this.$store.state.settings.publicItems.system_logo
        )
        .then((res) => {
          this.blobUrl = "data:image/png;base64," + res;
        });
    },
    async onlogin() {
      let currentUser = null;

      this.$q.loading.show();

      if (this.$q.platform.is.desktop) {
        await this.$recaptchaLoaded();
        this.form.captcha = await this.$recaptcha("login");
      }

      await this.$http
        .post("golfer/login", this.form)
        .then((res) => {
          if (res) {
            currentUser = res;
            localStorage.setItem(
              "golfer__currentUser",
              JSON.stringify(currentUser)
            );
            localStorage.setItem(
              "golfer__user_token",
              currentUser.relation_password.apiToken
            );
            this.$store.dispatch("settings/clearPublic");
          }
        })
        .catch((e) => {
          this.$message.error(e);
        });

      if (currentUser.redirect) {
        return (window.location =
          currentUser.redirect +
          "?key=" +
          currentUser.relation_password.apiToken);
      } else {
        this.$q.loading.hide();
        this.$router.push("/");
      }
    },
  },
};
</script>
