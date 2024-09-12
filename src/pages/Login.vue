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

          <div class="text-center q-mt-sm">
            <q-btn color="primary" label="Inloggen" v-on:click="onlogin" />
            <br />

            <q-btn
              v-if="1 == 2 && !this.$q.platform.is.cordova"
              :disable="!validEmail"
              class="q-mt-sm"
              color="primary"
              flat
              label="Login via easy login"
              v-on:click="sendOneTimePassword"
            />

            <q-btn
              class="q-mt-sm"
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
    if (this.$route.query.key || this.$route.query.oneTimeKey) {
      this.form.repKey = this.$route.query.key;
      this.form.oneTimeKey = this.$route.query.oneTimeKey;
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
    validEmail() {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(this.form.relEmail);
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
      this.$q.loading.show();

      if (this.$q.platform.is.desktop) {
        await this.$recaptchaLoaded();
        this.form.captcha = await this.$recaptcha("login");
      }

      await this.$store.dispatch("currentUser/login", this.form);
      const currentUser = this.$store.getters["currentUser/item"];
      if (currentUser === null) {
        return;
      }

      await this.$store.dispatch("settings/clearPublic");

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
    async sendOneTimePassword() {
      this.$q
        .dialog({
          title: "Easy login",
          html: true,
          message:
            "Met easy login sturen we je een e-mailbericht met een login link. Door op de login link te klikken log " +
            "je direct in en heb je geen wachtwoord nodig.",
        })
        .onOk(() => {
          this.handleSend();
        });
    },
    async handleSend() {
      const res = await this.$http.post("public/sendOneTimePassword", {
        email: this.form.relEmail,
      });
      if (res && res.data && res.data === "notfound") {
        this.$q
          .dialog({
            title: "Verzenden mislukt!",
            html: true,
            message:
              "E-mailadres is <i>" + this.form.relEmail + "</i> niet gevonden!",
          })
          .onOk(() => {
            // console.log('OK')
          });
      }
    },
    showHelp() {
      let text =
        "Voor het inloggen is een, bij de baan geregistreerd, emailadres en een wachtwoord vereist. ";
      this.$q
        .dialog({
          title: "Uitleg",
          html: true,
          message: text,
        })
        .onOk(() => {
          // console.log('OK')
        });
    },
  },
};
</script>
