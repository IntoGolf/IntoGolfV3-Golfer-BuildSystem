<template>
  <q-page-container>
    <q-page class="q-pa-md">
      <div class="row justify-center q-mt-sm">
        <div class="col-4 text-center">
          <q-img
            :fit="'scale-down'"
            :src="blobUrl"
            style="max-width: 400px; max-height: 150px"
          />
        </div>
      </div>

      <div v-show="!showConfirm">
        <div class="row justify-center q-mt-md q-mb-md">
          <div class="col-12 text-center text-h5">{{ title }}</div>
          <div class="col-12 text-center text-subtitle1">{{ subtitle }}</div>
        </div>

        <q-form v-if="status === 1" @submit.prevent="onSubmit">
          <q-tabs
            v-model="tab"
            active-color="primary"
            align="justify"
            class="text-grey"
            dense
            indicator-color="primary"
            narrow-indicator
          >
            <q-tab disable label="Naam" name="name" />
            <q-tab disable label="Adres" name="address" />
            <q-tab disable label="Contact" name="contact" />
            <q-tab disable label="Golf" name="golf" />
            <q-tab
              v-if="needsPassword"
              disable
              label="Wachtwoord"
              name="password"
            />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="name">
              <div class="row q-col-gutter-sm q-mb-sm">
                <div class="col-8">
                  <q-input
                    v-model="account_form.relCallName"
                    :rules="[(val) => !!val || 'Voornaam is een verplicht']"
                    bottom-slots
                    counter
                    dense
                    label="Voornaam*"
                    maxlength="20"
                    stack-label
                  />
                </div>

                <div class="col-4">
                  <q-input
                    v-model="account_form.relPrefix"
                    bottom-slots
                    counter
                    dense
                    label="Voorvoegsel"
                    maxlength="15"
                    stack-label
                  />
                </div>
              </div>
              <div class="row q-mb-sm">
                <div class="col-8">
                  <q-input
                    v-model="account_form.relName"
                    :rules="[(val) => !!val || 'Achternaam is een verplicht']"
                    counter
                    dense
                    label="Achternaam*"
                    maxlength="40"
                    stack-label
                  />
                </div>
                <div class="col-4">
                  <q-select
                    v-model="account_form.relGender"
                    :options="[
                      { value: 1, label: 'Man' },
                      { value: 2, label: 'Vrouw' },
                    ]"
                    dense
                    label="Geslacht*"
                    stack-label
                  />
                </div>
              </div>
              <div v-if="needsRelationGroup" class="row q-mb-sm">
                <div class="col-8">
                  <q-select
                    v-model="account_form.relGrpNr1"
                    :options="relationGroupArray"
                    dense
                    label="Gewenste groep"
                    stack-label
                  />
                </div>
                <div class="col-4">
                  <q-input
                    v-model="account_form.relDateBirth"
                    dense
                    label="Geboortedatum"
                    stack-label
                    type="date"
                  />
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="address">
              <div class="row q-col-gutter-sm q-mb-sm">
                <div class="col-6">
                  <q-input
                    v-model="relPostalCode"
                    :rules="[(val) => !!val || 'Postcode is een verplicht']"
                    bottom-slots
                    counter
                    dense
                    label="Postcode"
                    mask="#### AA"
                    maxlength="8"
                    stack-label
                  />
                </div>

                <div class="col-3">
                  <q-input
                    v-model="relAddressStreetNumber"
                    :rules="[(val) => !!val || 'Huisnummer is een verplicht']"
                    bottom-slots
                    counter
                    dense
                    label="Huisnummer"
                    mask="#######"
                    maxlength="8"
                    stack-label
                  />
                </div>
                <div class="col-3">
                  <q-input
                    v-model="account_form.relAddressStreetAddition"
                    bottom-slots
                    counter
                    dense
                    label="Toevoeging"
                    maxlength="16"
                    stack-label
                  />
                </div>
              </div>
              <div class="row q-col-gutter-sm q-mb-sm">
                <div class="col">
                  <q-input
                    v-model="account_form.relCity"
                    :rules="[(val) => !!val || 'Plaats is een verplicht']"
                    bottom-slots
                    counter
                    dense
                    label="Plaats"
                    maxlength="30"
                    stack-label
                  />
                </div>
              </div>

              <div class="row q-col-gutter-sm q-mb-sm">
                <div class="col">
                  <q-input
                    v-model="account_form.relAddress1"
                    :rules="[(val) => !!val || 'Straat is een verplicht']"
                    bottom-slots
                    counter
                    dense
                    label="Straat"
                    maxlength="30"
                    stack-label
                  />
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="contact">
              <div class="row q-mb-sm">
                <div class="col">
                  <q-input
                    v-model="account_form.relEmail"
                    :rules="[validateEmail]"
                    bottom-slots
                    counter
                    dense
                    label="E-mailadres*"
                    lazy-rules
                    maxlength="60"
                    stack-label
                  />
                </div>
              </div>
              <div class="row q-mb-sm">
                <div class="col">
                  <q-input
                    v-model="account_form.relPhoneMobile"
                    :rules="[
                      (val) => !!val || 'Telefoonnummer is een verplicht',
                    ]"
                    bottom-slots
                    counter
                    dense
                    label="Telefoonnummer*"
                    mask="###############"
                    maxlength="15"
                    stack-label
                  />
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="golf">
              <div class="row q-col-gutter-md q-mb-sm">
                <div class="col-12">
                  <q-input
                    v-model="account_form.relGsn"
                    bottom-slots
                    counter
                    dense
                    label="Uw GSN"
                    mask="AA########"
                    maxlength="10"
                    placeholder="NL00000000"
                    stack-label
                  />
                </div>
                <div class="col-12">
                  <q-input
                    v-model="account_form.relHandicap"
                    bottom-slots
                    dense
                    input-class="text-right"
                    label="Handicap"
                    mask="##.#"
                    maxlength="4"
                    reverse-fill-mask
                    stack-label
                  />
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel v-if="needsPassword" name="password">
              <div class="row q-mb-sm">
                <div class="col">
                  <q-input
                    v-model="account_form.repPassword"
                    bottom-slots
                    counter
                    dense
                    error-message="Gebruik minimaal 6 karakters bestaande uit cijfers en letters"
                    hint="Min. 6 karakters bestaande uit cijfers en letters"
                    label="Wachtwoord*"
                    maxlength="60"
                    stack-label
                    type="password"
                  />
                </div>
              </div>
              <div class="row q-mb-sm">
                <div class="col">
                  <q-input
                    v-model="account_form.confirmRepPassword"
                    :rules="[
                      (val) => !!val || 'Wachtwoord validatie is een verplicht',
                    ]"
                    counter
                    dense
                    label="Bevestig wachtwoord*"
                    maxlength="60"
                    stack-label
                    type="password"
                  />
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>

          <div class="row q-mb-sm">
            <div class="col text-right">
              <q-btn
                v-show="!isFirstTab"
                color="primary"
                flat
                label="Vorige"
                v-on:click="onPrevTab"
              />
              <q-btn
                v-show="!isLastTab"
                :disable="currentTabInValid"
                color="primary"
                flat
                label="Volgende"
                v-on:click="onNextTab"
              />
              <q-btn
                v-show="isLastTab"
                color="primary"
                flat
                label="Bevesting"
                v-on:click="onShowConfirm"
              />
            </div>
          </div>

          <div class="row q-mb-sm">
            <div class="col text-center">
              <q-btn
                :label="backText"
                color="primary"
                flat
                v-on:click="onBack"
              />
            </div>
          </div>
        </q-form>

        <div v-else-if="status === 2" class="row q-mt-md q-mb-md">
          <div class="col-12">
            Uw aanvraag is ontvangen. Wij nemen uw aanvraag z.s.m. in
            behandeling en nemen via de e-mail contact met u op.
          </div>
        </div>

        <div v-else class="row q-mt-md q-mb-md">
          <div class="col-12">
            Uw aanvraag is mislukt, probeer het nogmaals of neem contact met ons
            op.
          </div>
        </div>
      </div>

      <sign-up-confirm
        v-if="showConfirm"
        :data="account_form"
        v-on:onHideConfirm="onHideConfirm"
        v-on:onSignUpPay="onSignUpPay"
      />
    </q-page>
  </q-page-container>
</template>

<style lang="sass" scoped>

.my-card
  min-width: 30%
  max-width: 640px
</style>

<script>
import SignUpConfirm from "pages/SignUpConfirm.vue";

export default {
  components: { SignUpConfirm },
  props: {
    ProCourse: Object,
  },
  data() {
    return {
      status: 1,
      tab: "name",
      relPostalCode: "",
      relAddressStreetNumber: "",
      tabs: [
        {
          name: "name",
          fields: [
            {
              name: "relCallName",
              type: String,
              required: true,
            },
            {
              name: "relPrefix",
              type: String,
              required: false,
            },
            {
              name: "relName",
              type: String,
              required: true,
            },
            {
              name: "relDateBirth",
              type: String,
              required: true,
            },
          ],
        },
        {
          name: "address",
          fields: [
            { name: "relPostalCode", type: String, required: true },
            { name: "relCity", type: String, required: true },
            { name: "relAddressStreetNumber", type: String, required: true },
            { name: "relAddress1", type: String, required: true },
          ],
        },
        {
          name: "contact",
          fields: [
            { name: "relEmail", type: "email", required: true },
            { name: "relPhoneMobile", type: "phone", required: true },
          ],
        },
        {
          name: "golf",
          fields: [],
        },
        {
          name: "password",
          fields: [
            {
              name: "repPassword",
              type: "password",
              required: true,
            },
            { name: "repPassword", type: "password", required: true },
          ],
        },
      ],
      inviteVisible: false,
      loading: false,
      passwordShow: false,
      passwordShow_2: false,
      relationGroups: [],
      showConfirm: false,
      account_form: {
        relFirstName: "",
        relCallName: "",
        relPrefix: "",
        relName: "",
        relEmail: "",
        relPhone: "",
        mobile_empPreferLang: "",
        phone_empPreferLang: "",
        relPhoneMobile: "",
        relGsn: "",
        relGender: { value: 1, label: "Man" },
        relHandicap: "54.0",
        repPassword: "",
        confirmRepPassword: "",
        relGrpNr1: Object,
        relPostalCode: "",
        relCity: "",
        relAddressStreetNumber: "",
        relAddressStreetAddition: "",
        relAddress1: "",
        relDateBirth: "",
        ProCourse: this.ProCourse,
      },
      // account_form: {
      //   relFirstName: "L",
      //   relCallName: "Piet",
      //   relPrefix: "",
      //   relName: "Pietersen",
      //   relEmail: "laurens1234@testers.nl",
      //   relPhone: "0172617000",
      //   mobile_empPreferLang: "",
      //   phone_empPreferLang: "",
      //   relPhoneMobile: "0612345678",
      //   relGsn: "NL12345678",
      //   relGender: { value: 1, label: "Man" },
      //   relHandicap: "54.0",
      //   repPassword: "",
      //   confirmRepPassword: "",
      //   relGrpNr1: Object,
      //   relPostalCode: "2411PZ",
      //   relCity: "Bodegraven",
      //   relAddressStreetNumber: "7",
      //   relAddressStreetAddition: "",
      //   relAddress1: "Griekenlandweg",
      //   relDateBirth: "2000-01-01",
      //   ProCourse: this.ProCourse,
      // },
      captchaResponse: null,
      errors: [],
      blobUrl: "",
    };
  },
  watch: {
    relPostalCode: async function (newValue) {
      let result = await this.$http.get(
        "golfer/zipcodeCheck?zipcode=" +
          this.relPostalCode +
          "&number=" +
          this.relAddressStreetNumber
      );
      this.account_form.relPostalCode = newValue;
    },
    relAddressStreetNumber: async function (newValue) {
      let result = await this.$http.get(
        "golfer/zipcodeCheck?zipcode=" +
          this.relPostalCode +
          "&number=" +
          this.relAddressStreetNumber
      );
      if (result && result.city !== undefined) {
        this.account_form.relCity = result.city;
        this.account_form.relAddress1 = result.street;
      }
      this.account_form.relAddressStreetNumber = newValue;
    },
  },
  computed: {
    needsPayment() {
      return true;
    },
    title: function () {
      return this.ProCourse ? "Cursus inschrijfformulier" : "Creëer account";
    },
    subtitle: function () {
      if (this.ProCourse) {
        return (
          'Je schrijft in voor onze cursus : "' + this.ProCourse.pcsName + '"'
        );
      } else {
        return "";
      }
    },
    backText: function () {
      "Terug naar inloggen";
      return this.ProCourse ? "Terug naar cursussen" : "Terug naar inloggen";
    },
    relationGroupArray: function () {
      if (!this.relationGroups) {
        return [];
      }
      return this.relationGroups.map((item) => ({
        value: item.grpNr,
        label: item.grpName + " (" + this.$filters.money(item.price) + ")",
        price: item.price,
        grpName: item.grpName,
      }));
    },
    currentTabIndex: function () {
      return this.tabs.findIndex((tab) => tab.name === this.tab);
    },
    currentTabInValid: function () {
      let tab = this.tabs[this.currentTabIndex];
      let inValid = false;

      tab.fields.forEach((item) => {
        if (!item.required) {
        } else if (item.type === String) {
          inValid = inValid || this.account_form[item.name].length === 0;
        } else if (item.type === "email") {
          const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          inValid = inValid || !re.test(this.account_form[item.name]);
        } else if (item.type === "phone") {
          const re = /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
          inValid = inValid || !re.test(this.account_form[item.name]);
        } else if (item.type === "decimal") {
          inValid =
            inValid ||
            !(
              this.account_form[item.name] >= -9.9 &&
              this.account_form[item.name] <= 54.0
            );
        } else if (item.type === "gsn") {
          const re = /^[NL][0-9]{6}B[0-9]{2}$/;
          inValid = inValid || !re.test(this.account_form[item.name]);
        }
      });
      return inValid;
    },
    isLastTab: function () {
      const fact = 1; //this.needsPassword ? 1 : 2;
      return this.currentTabIndex === this.tabs.length - fact;
    },
    isFirstTab: function () {
      return this.currentTabIndex === 0;
    },
    nextTab: function () {
      return this.isLastTab ? this.currentTabIndex : this.currentTabIndex + 1;
    },
    prevTab: function () {
      return this.isFirstTab ? 0 : this.currentTabIndex - 1;
    },
    needsRelationGroup: function () {
      return !this.ProCourse;
    },
    needsPassword: function () {
      return !this.ProCourse;
    },
  },
  created: function () {
    if (!this.needsPassword) {
      this.tabs.pop();
    }

    let that = this;

    if (JSON.stringify(this.$route.query).indexOf("email") !== -1) {
      this.account_form.relEmail = this.$route.query.email;
      this.inviteVisible = true;
    }

    this.$http.get(`golfer/relation-groups`).then((res) => {
      that.relationGroups = res;
      this.account_form.relGrpNr1 = that.relationGroupArray[0];
    });

    if (!this.$q.platform.is.cordova) {
      this.onCaptchaVerified();
    }

    this.loadImage();
  },
  methods: {
    validateEmail(val) {
      return new Promise((resolve, reject) => {
        this.$http.get("check-email/" + val).then((res) => {
          resolve(res.data !== 1 || "E-mailadres is reeds in gebruik");
        });
      });
    },
    isValid: function (name) {
      return name;
    },
    onNextTab: function () {
      this.tab = this.tabs[this.nextTab].name;
    },
    onPrevTab: function () {
      this.tab = this.tabs[this.prevTab].name;
    },
    onBack: function () {
      if (this.ProCourse) {
        this.$emit("onCloseSignUp");
      } else {
        this.$router.push("/");
      }
    },
    onHome() {
      this.$router.push("/");
    },
    onShowConfirm() {
      this.showConfirm = true;
    },
    onHideConfirm() {
      this.showConfirm = false;
    },
    async onSignUpPay() {
      let that = this;
      if (!this.$q.platform.is.cordova) {
        await this.$recaptchaLoaded();
        that.account_form.captcha = await this.$recaptcha("login");
      }

      const res = await this.$http.post(`golfer/sign-up`, this.account_form);
      this.onHideConfirm();
      if (res.success === 1) {
        this.status = 2;
      } else {
        this.status = 3;
      }
    },
    async onSubmit() {
      let that = this;

      if (!this.$q.platform.is.cordova) {
        await this.$recaptchaLoaded();
        that.account_form.captcha = await this.$recaptcha("login");
      }

      that.loading = true;
      that.$http.post(`golfer/sign-up`, that.account_form).then((res) => {
        if (res.success === 1) {
          this.status = 2;
        } else {
          this.status = 3;
        }
      });
    },
    onCaptchaVerified(response) {
      this.$emit("captcha-verified", response);
    },
    loadImage() {
      this.$http
        .get(
          "golfer/image/" + this.$store.state.settings.publicItems.system_logo
        )
        .then((res) => {
          this.blobUrl = "data:image/png;base64," + res;
        });
    },
  },
};
</script>
