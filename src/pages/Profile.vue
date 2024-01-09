<template>
  <q-page-container>
    <q-page class="q-pa-sm">
      <q-form @submit="saveProfile">
        <div class="ml-auto mr-auto text-center">
          <q-img
            :src="blobUrl"
            style="max-width: 240px; max-height: 240px"
            @click="triggerUpload"
          />

          <input
            ref="fileInput"
            accept="image/*"
            hidden
            type="file"
            @change="onFileChange"
          />
        </div>

        <q-tabs v-model="tab" class="text-teal">
          <q-tab class="pl-0" label="Naam" name="adres" />
          <q-tab class="pl-0" label="Contact" name="contact" />
          <q-tab class="pl-0" label="Golf" name="golf" />
          <q-tab class="pl-0" label="Voorkeuren" name="preference" />
        </q-tabs>

        <q-tab-panels v-model="tab">
          <q-tab-panel class="q-pa-none" name="adres">
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
          <q-tab-panel class="q-pa-none" name="contact">
            <q-input
              v-model="form.relPhone"
              :disable="!canChange"
              :label="$t('Phone number')"
              lazy-rules
              mask="###############"
              maxlength="15"
            />

            <q-input
              v-model="form.relPhoneMobile"
              :disable="!canChange"
              :label="$t('Mobiel telefoonnummer')"
              lazy-rules
              mask="###############"
              maxlength="15"
            />

            <q-input
              v-model="form.relEmail"
              :disable="!canChange"
              :label="$t('Emailadres')"
              lazy-rules
            />
          </q-tab-panel>
          <q-tab-panel class="q-pa-none" name="golf">
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
          <q-tab-panel class="q-pa-none" name="preference">
            <q-select
              v-model="relVisibilityLevel"
              :options="visibilityArray"
              behavior="menu"
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
              :disable="!canChangeInvoiceByEmail"
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
    </q-page>
  </q-page-container>
</template>

<script>
import authMixin from "../mixins/auth";

export default {
  mixins: [authMixin],
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
      tab: "adres",
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
    Authorization() {
      let authorization = JSON.parse(
        localStorage.getItem("golfer__Authorization")
      );
      return authorization ? authorization : false;
    },
    canChange: function () {
      return parseInt(this.settings.app_allow_member_change_contact) === 1;
    },
    canChangeInvoiceByEmail: function () {
      return (
        parseInt(this.settings.app_allow_member_change_contact) === 1 &&
        parseInt(this.settings.app_allow_member_set_invoice_email === 1)
      );
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
    async update() {
      await this.$http.get("golfer/user").then((res) => {
        localStorage.setItem("golfer__currentUser", JSON.stringify(res));
        this.form = Object.assign({}, this.currentUser);
      });
    },
    loadImage: function () {
      let that = this;
      this.$http.get("golfer/image").then((res) => {
        that.blobUrl = "data:image/png;base64," + res;
      });
    },
    saveProfile() {
      this.form.relNr = this.currentUser.relNr;
      localStorage.setItem("golfer__currentUser", JSON.stringify(this.form));
      const payload = Object.assign(this.form, {
        relNr: this.currentUser.relNr,
      });
      this.$http.post(`golfer/user`, payload);
    },
    logout() {
      this.$http.post(`golfer/logout`).then(() => {
        localStorage.clear();
        this.$store.dispatch("clearState");
        this.$router.push("/login");
      });
    },
    triggerUpload() {
      if (!this.$store.state.settings.item.app_allow_member_upload_photo) {
        return;
      }
      // Trigger the hidden file input
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      const files = event.target.files;
      if (files && files[0]) {
        const file = files[0];
        this.imageUrl = URL.createObjectURL(file);

        // Optionally, upload the file to the server here
        this.uploadAvatar(file);
      }
    },
    async uploadAvatar(file) {
      // Implement the upload logic here
      // Typically, you would send an HTTP request to your server
      // For demonstration, just logging the file

      let formData = new FormData();
      formData.append("avatar", file); // 'image' is the key expected on the server side

      const response = await this.$http.post("golfer/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      this.currentUser.relImage = response.filename;

      this.loadImage();

      // Reset the file input after upload
      this.$refs.fileInput.value = null;
    },
  },
  created() {
    document.body.classList.add("page-profile");
    this.update();
  },
};
</script>
