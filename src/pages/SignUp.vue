<template>

  <q-page-container>

    <q-card class="my-card q-ml-auto q-mr-auto q-mt-xl">

      <q-card-section>

        <div class="row justify-center q-mt-sm">
          <div class="col-4 text-center">
            <img
                src="../assets/images/logo-black.svg"
                class="logo"
                alt="logo"/>
          </div>
        </div>

        <div class="row justify-center q-mt-md">
          <div class="col text-center text-h5">
            Creëer account
          </div>
        </div>
        <div class="row justify-center q-mt-md">
          <p class="sub-title m-0">
            Voer de gevraagde gegevens in voor het aanmaken van een account.
          </p>
          <p class="sub-title m-0">Alle velden met een * zijn verplicht.</p>
        </div>

        <q-form siz>

          <div class="row q-col-gutter-sm q-mb-sm">
            <div class="col-8">
              <q-input
                  stack-label
                  dense
                  counter
                  maxlength="20"
                  v-model="account_form.relCallName"
                  :rules="[val => !!val || 'Voornaam is een verplicht']"
                  bottom-slots
                  label="Voornaam*"/>
            </div>

            <div class="col-4">
              <q-input
                  stack-label
                  dense
                  counter
                  maxlength="15"
                  v-model="account_form.relPrefix"
                  bottom-slots
                  label="Voorvoegsel"/>

            </div>
          </div>

          <div class="row q-mb-sm">
            <div class="col">
              <q-input
                  stack-label
                  dense
                  counter
                  maxlength="40"
                  v-model="account_form.relName"
                  :rules="[val => !!val || 'Achternaam is een verplicht']"
                  label="Achternaam*"/>
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-8">
              <q-input
                  stack-label
                  dense
                  counter
                  maxlength="9"
                  bottom-slots
                  v-model="account_form.relGolferId"
                  label="NGF-nummer"/>
            </div>
            <div class="col-4">
              <q-input
                  stack-label
                  dense
                  mask="##.#"
                  reverse-fill-mask
                  bottom-slots
                  v-model="account_form.relHandicap"
                  label="Handicap"
                  input-class="text-right"/>
            </div>
          </div>

          <div class="row q-mb-sm">
            <div class="col">
              <q-input
                  stack-label
                  dense
                  bottom-slots
                  counter
                  maxlength="60"
                  hint="E-mailadres mag niet eerder gebruikt zijn"
                  v-model="account_form.relEmail"
                  :rules="[val => !!val || 'Email is een verplicht']"
                  label="E-mailadres*"/>
            </div>
          </div>

          <div class="row q-mb-sm">
            <div class="col">
              <q-input
                  stack-label
                  dense
                  bottom-slots
                  counter
                  maxlength="60"
                  hint="Min. 6 karaters bestaande uit cijfers en letters"
                  v-model="account_form.repPassword"
                  :rules="[val => !!val || 'Voornaam is een verplicht']"
                  label="Wachtwoord*"/>
            </div>
          </div>

          <div class="row q-mb-sm">
            <div class="col">
              <q-input
                  stack-label
                  dense
                  counter
                  maxlength="60"
                  v-model="account_form.confirmRepPassword"
                  :rules="[val => !!val || 'Voornaam is een verplicht']"
                  label="Bevestig wachtwoord*"/>
            </div>
          </div>

          <div class="row q-mb-sm">
            <div class="col">
              <q-select
                  stack-label
                  dense
                  label="Gewenste groep"
                  v-model="account_form.relGrpNr1"
                  :options="relationGroupArray"/>
            </div>
          </div>

          <div class="row q-mb-sm q-mt-md">
            <div class="col">
              <q-btn
                  label="Inschrijven"
                  v-on:click="onCreateAccount"
                  color="primary"/>
            </div>
          </div>

          <div class="row q-mb-sm">
            <div class="col text-center">
              <q-btn
                  flat
                  label="Terug naar inloggen"
                  v-on:click="$router.push('/');"
                  color="primary"/>
            </div>
          </div>

        </q-form>


      </q-card-section>

    </q-card>

  </q-page-container>

</template>


<style lang="sass" scoped>

.my-card
  min-width: 30%,
  max-width: 320px

</style>

<script>
// import { VueReCaptcha } from "vue-recaptcha-v3";
//
// Vue.use(VueReCaptcha, { siteKey: "6Ld49AsbAAAAAGmQmEyOWeypfUrEaAAUreRv6o9G" });

export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password"));
      } else if (value.length < 6) {
        callback(new Error("Password length must be at least 6"));
      } else if (!/^(?![^a-zA-Z]+$)(?!\D+$)/.test(value)) {
        callback(new Error("Must contain letters and numbers"));
      } else {
        if (this.account_form.repPassword !== "") {
          // this.$refs.ruleForm.validateField('password');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please enter your password again"));
      } else if (value !== this.account_form.repPassword) {
        callback(new Error("The password is inconsistent!"));
      } else {
        callback();
      }
    };
    return {
      inviteVisible: false,
      loading: false,
      passwordShow: false,
      passwordShow_2: false,
      relationGroups: [],
      account_form: {
        relFirstName: "T",
        relCallName: "Tester",
        relPrefix: "",
        relName: "Demo",
        relEmail: "laurens+1@intogolf.nl",
        relPhone: "0611045770",
        mobile_empPreferLang: "",
        phone_empPreferLang: "",
        relPhoneMobile: "",
        relGolferId: "789797",
        relHandicap: "16",
        repPassword: "test54321",
        confirmRepPassword: "test54321",
        relGrpNr1: Object,
      },
      rules: {
        relEmail: [
          {
            required: true,
            message: "Please enter your email address",
            trigger: "blur",
          },
        ],
        relFirstName: [
          {
            required: true,
            message: "Please enter your initials",
            trigger: "blur",
          },
        ],
        relCallName: [
          {
            required: true,
            message: "Please enter your first name",
            trigger: "blur",
          },
        ],
        relName: [
          {
            required: true,
            message: "Please enter your last name",
            trigger: "blur",
          },
        ],
        repPassword: [
          {
            validator: validatePass,
            trigger: "blur",
          },
        ],
        confirmRepPassword: [
          {
            validator: validatePass2,
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    relationGroupArray: function () {
      if (!this.relationGroups) {
        return [];
      }
      return this.relationGroups.map(item => ({value: item.grpNr, label: item.grpName}));
    }
  },
  created: function () {
    let that = this;

    if (JSON.stringify(this.$route.query).indexOf("email") !== -1) {
      this.account_form.relEmail = this.$route.query.email;
      this.inviteVisible = true;
    }

    this.$http.get(`golfer/public/relation-groups/get`).then((res) => {
      that.relationGroups = res;
      this.account_form.relGrpNr1 = that.relationGroupArray[0];
    });
  },
  methods: {
    onBlur(e) {
      if (e.target.value) {
        this.$http.get("check-email/" + e.target.value).then((res) => {
          if (res.data === 1) {
            this.$message({
              message: "This email address has been registered!",
              type: "warning",
            });
          }
        });
      }
    },
    onHome() {
      this.$router.push("/");
    },
    async onCreateAccount(formName) {
      // (optional) Wait until recaptcha has been loaded.
      //await this.$recaptchaLoaded();
      // Execute reCAPTCHA with action "login".
      //const token = await this.$recaptcha("login");
      let that = this;
      //this.$refs[formName].validate((valid) => {
      //if (valid) {
      /* eslint-disable no-undef */
      // Add your logic to submit to your backend server here.
      // that.$http.post(`golfer/public/reCaptcha/verify`, {
      //   token
      // })
      //     .then(res => {
      //       // recaptcha verify success
      //       if (res.success) {
      that.loading = true;
      that.$http
          .post(`golfer/public/auth/sign-up`, that.account_form)
          .then((signUp) => {
            that.loading = false;
            that.$message.success(signUp.message);
            that.$router.push("/");
          });
      that.loading = false;
      //   } else {
      //     that.loading = false;
      //   }
      // })
      // .catch(() => {
      //   this.loading = false;
      // });
      //} else {
      //  this.loading = false;
      //}
      //});
    },
  },
};
</script>

