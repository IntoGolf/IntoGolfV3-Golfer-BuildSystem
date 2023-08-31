<template>
  <q-page-container>
    <q-page>
      <q-card class="q-pa-sm">
        <q-form @submit="saveProfile">
          <div class="ml-auto mr-auto text-center">
            <q-img :src="blobUrl" style="max-width: 240px; max-height: 240px" />
            <!--          <UploadPhoto :uploadUrl="uploadUrl"></UploadPhoto>-->
          </div>

          <q-tabs v-model="tab" class="text-teal">
            <q-tab class="pl-0" label="Naam" name="Name" />
            <q-tab class="pl-0" label="Contact" name="Contact" />
            <q-tab class="pl-0" label="Golf" name="Golf" />
            <q-tab class="pl-0" label="Voorkeuren" name="Voorkeuren" />
          </q-tabs>

          <q-tab-panels v-model="tab" class="p-0">
            <q-tab-panel class="p-0" name="Name">
              <q-input
                v-model="form.relFirstName"
                :disable="!canChange"
                :label="$t('Initialen')"
                lazy-rules
              />

              <q-input
                v-model="form.relCallName"
                :disable="!canChange"
                :label="$t('Voornaam')"
                lazy-rules
              />

              <q-input
                v-model="form.relPrefix"
                :disable="!canChange"
                :label="$t('Tussenvoegsel')"
                lazy-rules
              />

              <q-input
                v-model="form.relName"
                :disable="!canChange"
                :label="$t('Achternaam')"
                lazy-rules
              />

              <q-input
                v-model="form.relAddress1"
                :disable="!canChange"
                :label="$t('Straat')"
                lazy-rules
              />

              <div class="row q-col-gutter-md">
                <q-input
                  v-model="form.relAddressStreetNumber"
                  :disable="!canChange"
                  :label="$t('Huisnummer')"
                  lazy-rules
                />

                <q-input
                  v-model="form.relAddressStreetAddition"
                  :disable="!canChange"
                  :label="$t('Toevoeging')"
                  lazy-rules
                />
              </div>

              <q-input
                v-model="form.relPostalCode"
                :disable="!canChange"
                :label="$t('Postcode')"
                lazy-rules
              />

              <q-input
                v-model="form.relCity"
                :disable="!canChange"
                :label="$t('Woonplaats')"
                lazy-rules
              />
            </q-tab-panel>

            <q-tab-panel class="p-0" name="Contact">
              <q-input
                v-model="form.relPhone"
                :disable="!canChange"
                :label="$t('Phone number')"
                lazy-rules
              />

              <q-input
                v-model="form.relPhoneMobile"
                :disable="!canChange"
                :label="$t('Mobiel telefoonnummer')"
                lazy-rules
              />

              <q-input
                v-model="form.relEmail"
                :disable="!canChange"
                :label="$t('Emailadres')"
                lazy-rules
              />
            </q-tab-panel>

            <q-tab-panel class="p-0" name="Golf">
              <q-input
                v-model="form.relGsn"
                :label="$t('Golfservicenummer')"
                lazy-rules
                readonly
              />

              <q-input
                v-model="form.relHandicap"
                :label="$t('Speelsterkte')"
                lazy-rules
                readonly
              />
            </q-tab-panel>

            <q-tab-panel class="p-0" name="Voorkeuren">
              <q-select
                v-model="relVisibilityLevel"
                :options="visibilityArray"
                emit-value
                label="Zichtbaarheid in ledenboekje"
                map-options
              />

              <br />

              <q-toggle
                v-model="relMagazineGolfNL"
                :disable="!canChange"
                label="Golfers magazine ontvangen"
              />

              <br />

              <q-toggle
                v-model="relEmailnewsletterNGF"
                :disable="!canChange"
                label="E-mail nieuwsbrief NGF ontvangen"
              />

              <br />

              <q-toggle
                v-model="relInvoiceByEmail"
                :disable="!canChange"
                label="Factuur per e-mail ontvangen"
              />
            </q-tab-panel>
          </q-tab-panels>

          <div class="text-center q-mt-md q-pb-md">
            <q-btn color="primary" label="Opslaan" type="submit" />

            <q-btn
              class="q-ml-md"
              color="primary"
              label="Uitloggen"
              outline
              v-on:click="logout"
            />
          </div>
        </q-form>
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script>
// import UploadPhoto from "../components/UploadPhoto";
import authMixin from "../mixins/auth";

export default {
  mixins: [authMixin],
  // components: {
  //   UploadPhoto
  // },
  data: function () {
    return {
      back_icon: "fa-home",
      back_link: "/",
      title: "Profiel",
      callBack: undefined,

      flagList: [
        {
          img: "../assets/images/nl.png",
          name: "Netherlands (+31)",
          value: "NL(+31)",
        },
        {
          img: "../assets/images/gb.png",
          name: "Great Brittain (+44)",
          value: "EN(+44)",
        },
      ],
      tab: "Name",
      activeName: "first",
      uploading: "",
      form: {
        relFirstName: "",
        relCallName: "",
        relPrefix: "",
        relName: "",
        relAddress1: "",
        relPostalCode: "",
        relCity: "",
        relCouNr: "",
        relPhone: "",
        mobile_relCouNr: "",
        relPhoneMobile: "",
        relEmail: "",
        relHandicap: "",
        relNr: "",
        relImage: "",
        relMagazineGolfNL: false,
        relInvoiceByEmail: false,
        relEmailnewsletterNGF: false,
        relVisibilityLevel: 0,
      },
      visibilityArray: [
        { value: 0, label: "Niet zichtbaar" },
        { value: 1, label: "Naam en speelsterkte" },
        { value: 2, label: "Naam, speelsterkte en e-mailadres" },
        {
          value: 3,
          label: "Naam, speelsterkte, e-mailadres en telefoonnummer",
        },
      ],
      blobUrl: "",
      uploadUrl: "/api/golfer/relation/avatar-upload",
    };
  },
  computed: {
    canChange: function () {
      return parseInt(this.settings.app_allow_member_change_contact) === 1;
    },
    relMagazineGolfNL: {
      get: function () {
        return (
          this.form.relMagazineGolfNL !== null &&
          this.form.relMagazineGolfNL > 0
        );
      },
      set: function (value) {
        this.form.relMagazineGolfNL = value ? 1 : 0;
      },
    },
    relInvoiceByEmail: {
      get: function () {
        return (
          this.form.relInvoiceByEmail !== null &&
          this.form.relInvoiceByEmail > 0
        );
      },
      set: function (value) {
        this.form.relInvoiceByEmail = value ? 1 : 0;
      },
    },
    relEmailnewsletterNGF: {
      get: function () {
        return (
          this.form.relEmailnewsletterNGF !== null &&
          this.form.relEmailnewsletterNGF > 0
        );
      },
      set: function (value) {
        this.form.relEmailnewsletterNGF = value ? 1 : 0;
      },
    },
    relVisibilityLevel: {
      get: function () {
        return this.form.relVisibilityLevel !== null &&
          this.form.relVisibilityLevel > 0
          ? this.form.relVisibilityLevel
          : 0;
      },
      set: function (value) {
        this.form.relVisibilityLevel = value;
      },
    },
  },
  mounted() {
    this.loadImage();
  },
  methods: {
    loadImage: function () {
      let that = this;
      this.$http
        .get("golfer/image/" + this.currentUser.relImage)
        .then((res) => {
          that.blobUrl = "data:image/png;base64," + res;
        });
    },
    saveProfile() {
      this.form.relNr = this.currentUser.relNr;
      this.$ls.setItem("currentUser", this.form, 1000 * 60 * 60 * 24 * 7);
      const payload = Object.assign(this.form, {
        relNr: this.currentUser.relNr,
      });
      this.$http.post(`golfer/user`, payload);
    },
    logout() {
      this.$ls.removeItem("currentUser");
      this.$ls.removeItem("authorization");
      this.$ls.removeItem("weather");
      this.$ls.removeItem("settings");
      this.$ls.removeItem("currentUserPref");
      this.$router.push("/login");
    },
    onLogout() {
      this.$confirm("Will log out, Whether or not to continue?", "Prompt", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "Successful exit!",
          });
          this.$ls.clear();
          this.$router.push("/");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Cancel out!",
          });
        });
    },
  },
  created() {
    document.body.classList.add("page-profile");
    this.form = Object.assign({}, this.currentUser);
  },
};
</script>
