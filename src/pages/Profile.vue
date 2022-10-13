<template>

  <q-page-container class="q-mt-md">

    <div class="pb-3 bg-white">

      <q-form @submit="saveProfile">

        <div class="ml-auto mr-auto">
          <UploadPhoto :uploadUrl="uploadUrl"></UploadPhoto>
        </div>

        <q-tabs v-model="tab" class="text-teal">
          <q-tab class="pl-0" name="Name" label="Naam"/>
          <q-tab class="pl-0" name="Contact" label="Contact"/>
          <q-tab class="pl-0" name="Golf" label="Golf"/>
          <q-tab class="pl-0" name="Voorkeuren" label="Voorkeuren"/>
        </q-tabs>

        <q-tab-panels v-model="tab" class="p-0">
          <q-tab-panel class="p-0" name="Name">
            <q-input
                v-model="form.relFirstName"
                :label="$t('Initialen')"
                lazy-rules
            />

            <q-input
                v-model="form.relCallName"
                :label="$t('Voornaam')"
                lazy-rules
            />

            <q-input
                v-model="form.relPrefix"
                :label="$t('Tussenvoegsel')"
                lazy-rules
            />

            <q-input
                v-model="form.relName"
                :label="$t('Achternaam')"
                lazy-rules
            />

            <q-input
                v-model="form.relAddress1"
                :label="$t('Straat')"
                lazy-rules
            />

            <div class="row q-col-gutter-md">
              <q-input
                  v-model="form.relAddressStreetNumber"
                  :label="$t('Huisnummer')"
                  lazy-rules
              />

              <q-input
                  v-model="form.relAddressStreetAddition"
                  :label="$t('Toevoeging')"
                  lazy-rules
              />
            </div>

            <q-input
                v-model="form.relPostalCode"
                :label="$t('Postcode')"
                lazy-rules
            />

            <q-input
                v-model="form.relCity"
                :label="$t('Woonplaats')"
                lazy-rules
            />
          </q-tab-panel>

          <q-tab-panel class="p-0" name="Contact">
            <q-input
                v-model="form.relPhone"
                :label="$t('Phone number')"
                lazy-rules
            />

            <q-input
                v-model="form.relPhoneMobile"
                :label="$t('Mobiel telefoonnummer')"
                lazy-rules
            />

            <q-input
                v-model="form.relEmail"
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
                label="Zichtbaarheid in ledenboekje"
                emit-value
                map-options
            />

            <br/>

            <q-toggle
                v-model="relMagazineGolfNL"
                label="Golfers magazine ontvangen"
            />

            <br/>

            <q-toggle
                v-model="relEmailnewsletterNGF"
                label="E-mail nieuwsbrief NGF ontvangen"
            />

            <br/>

            <q-toggle
                v-model="relInvoiceByEmail"
                label="Factuur per e-mail ontvangen"
            />
          </q-tab-panel>
        </q-tab-panels>

        <div class="text-center q-mt-md q-pb-md">

          <q-btn
              label="Opslaan"
              type="submit"
              color="primary"/>

          <q-btn
              label="Uitloggen"
              color="primary"
              outline
              class="q-ml-md"
              v-on:click="logout"/>

        </div>

      </q-form>

    </div>

  </q-page-container>

</template>

<script>
import UploadPhoto from "../components/UploadPhoto";
// import TopBar from "../components/TopBar";

export default {
  components: {
    UploadPhoto
  },
  data: function () {
    return {
      back_icon: "fa-home",
      back_link: "/",
      title: "Profiel",
      callBack: undefined,

      currentUser: {},
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
        relGolferId: "",
        relHandicap: "",
        relNr: "",
        relImage: "",
        relMagazineGolfNL: false,
        relInvoiceByEmail: false,
        relEmailnewsletterNGF: false,
        relVisibilityLevel: 0,
      },
      visibilityArray: [
        {value: 0, label: "Niet zichtbaan"},
        {value: 1, label: "Naam en speelsterkte"},
        {value: 2, label: "Naam, speelsterkte en e-mailadres"},
        {
          value: 3,
          label: "Naam, speelsterkte, e-mailadres en telefoonnummer",
        },
      ],
      uploadUrl: "/api/golfer/relation/avatar-upload",
    };
  },
  computed: {
    relMagazineGolfNL: {
      get: function () {
        return (
            this.form.relMagazineGolfNL != null && this.form.relMagazineGolfNL > 0
        );
      },
      set: function (value) {
        this.form.relMagazineGolfNL = value ? 1 : 0;
      },
    },
    relInvoiceByEmail: {
      get: function () {
        return (
            this.form.relInvoiceByEmail != null && this.form.relInvoiceByEmail > 0
        );
      },
      set: function (value) {
        this.form.relInvoiceByEmail = value ? 1 : 0;
      },
    },
    relEmailnewsletterNGF: {
      get: function () {
        return (
            this.form.relEmailnewsletterNGF != null &&
            this.form.relEmailnewsletterNGF > 0
        );
      },
      set: function (value) {
        this.form.relEmailnewsletterNGF = value ? 1 : 0;
      },
    },
    relVisibilityLevel: {
      get: function () {
        return this.form.relVisibilityLevel != null &&
        this.form.relVisibilityLevel > 0
            ? this.form.relVisibilityLevel
            : 0;
      },
      set: function (value) {
        this.form.relVisibilityLevel = value;
      },
    },
  },
  methods: {
    saveProfile() {
      const payload = Object.assign(this.form, {
        relNr: this.currentUser.relNr,
      });
      this.$http.post(`golfer/user`, payload);
    },
    logout() {
      this.$ls.removeItem("currentUser");
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
    console.log(this.$ls.getItem("currentUser").value);

    this.form = Object.assign({}, this.$ls.getItem("currentUser").value);

    // if (this.$ls.getItem("currentUser")) {
    //   this.$http.get(`golfer/user`).then((res) => {
    //     this.form = Object.assign({}, res);
    //     if (
    //       this.currentUser.relCouNr &&
    //       this.flagList[this.currentUser.relCouNr]
    //     ) {
    //       this.form.relCouNr = this.flagList[this.currentUser.relCouNr].value;
    //       this.form.mobile_relCouNr =
    //         this.flagList[this.currentUser.relCouNr].value;
    //     }
    //   });
    // }
  },
};
</script>
