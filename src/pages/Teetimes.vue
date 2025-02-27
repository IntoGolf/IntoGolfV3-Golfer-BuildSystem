<template>
  <q-page-container>
    <q-page class="q-pa-md">
      <div v-show="step == 1" class="row q-mb-sm">
        <div class="col">
          <div class="row">
            <div class="col-8 text-h5">Boek je starttijd</div>
            <div class="col-4 text-right">
              <q-btn-group>
                <q-btn
                  color="primary"
                  label="<"
                  size="sm"
                  v-on:click="setDay(-1)"
                />
                <q-btn
                  color="primary"
                  label=">"
                  size="sm"
                  v-on:click="setDay(1)"
                />
              </q-btn-group>
            </div>
          </div>
          <div class="row q-mb-md">
            <div class="col-md-3 col-xs-6 q-pr-md">
              <q-input v-model="date" label="Datum" size="sm" type="date"/>
            </div>
            <div class="col-md-3 col-xs-6 q-pr-md">
              <q-select
                v-model="flight.fltSize"
                :options="sizeArray"
                emit-value
                label="Spelers"
                size="sm"
                toggle-color="primary"
              />
            </div>

            <div class="col-md-3 col-xs-6 q-pr-md">
              <q-select
                v-model="holes"
                :options="holesArray"
                label="Holes"
                size="sm"
                toggle-color="primary"
              />
            </div>
            <div class="col-md-3 col-xs-6 q-pr-md">
              <q-select
                v-model="per"
                :options="perArray"
                label="Periode"
                size="sm"
                toggle-color="primary"
              />
            </div>
          </div>
          <div v-if="hasTimes">
            <div class="row q-gutter-xs q-mb-md">
              {{ mergeText }}
            </div>
            <div class="row q-gutter-xs">
              <div
                v-for="(course, cKey) in courses"
                :key="cKey"
                class="q-pa-sm col items-start text-center text-white bg-secondary text-bold"
              >
                {{ course.crlNameInternet }}
              </div>
            </div>
            <div class="row q-gutter-xs">
              <div
                v-for="(course, cKey) in courses"
                :key="cKey"
                class="col text-grey-8 text-bold"
              >
                <course-comp
                  :course="course"
                  :holes="holes"
                  :per="per"
                  :size="flight.fltSize"
                  v-on:setTimeObject="setTimeObject"
                />
              </div>
            </div>
          </div>
          <div v-else-if="loading">
            <div
              class="text-h5 text-center"
              style="
                width: 100%;
                height: 641px;
                /*padding-top: 50px;*/
                border: 1px solid darkgray;
              "
            >
              Starttijden worden opgehaald.
            </div>
          </div>
          <div v-else>
            <div
              class="text-h5 text-center"
              style="
                width: 100%;
                height: 641px;
                /*padding-top: 50px;*/
                border: 1px solid darkgray;
              "
            >
              Helaas we hebben geen starttijden kunnen vinden voor de door u
              gekozen datum en holes.
            </div>
          </div>
        </div>
      </div>

      <div v-show="step == 2" class="row q-mt-md">
        <div class="col">
          <div class="row text-center q-mb-lg">
            <div class="col text-h5 q-ml-auto q-mr-auto">Jouw reservering</div>
          </div>

          <div class="row">
            <div class="col-4 text-bold">Datum:</div>
            <div class="col-8">
              {{ $filters.capitalizeFirstLetter(dayjs(date).format("dddd DD MMMM")) }}
            </div>
          </div>

          <div class="row">
            <div class="col-4 text-bold">Tijd:</div>
            <div class="col-8">
              {{ $filters.minuteToTime(flight.fltTime1) }}
            </div>
          </div>

          <div class="row">
            <div class="col-4 text-bold">Personen:</div>
            <div class="col-8">
              {{ flight.fltSize }}
            </div>
          </div>

          <div class="row">
            <div class="col-4 text-bold">Holes:</div>
            <div class="col-8">
              {{ holes.value }}
            </div>
          </div>

          <div
            v-if="
              $store.state.settings.publicItems.app_display_greenfee_pay == 1
            "
            class="row q-mb-lg"
          >
            <div class="col-4 text-bold">Te betalen:</div>
            <div class="col-8">
              {{ $filters.money(flightPrice) }}
            </div>
          </div>

          <div class="row q-mt-sm">
            Voor deze flight geldt een maximale totale WHS handicap van:
            {{ maxFlightHandicap }}.
          </div>
          <div
            v-if="
              $store.state.settings.publicItems.app_display_greenfee_pay == 1
            "
            class="row q-mt-sm"
          >
            Nadat je de flight hebt betaald ontvang je een e-mail ter
            bevestiging van je reservering. In deze e-mail vindt je een link
            waarmee je je resevering kan aanvullen met de details van je
            medespelers.
          </div>
          <div v-else class="row q-mt-sm">
            Nadat je de flight hebt geboekt ontvang je een e-mail ter
            bevestiging van je reservering. In deze e-mail vindt je een link
            waarmee je je resevering kan aanvullen met de details van je
            medespelers.
          </div>
          <q-input
            v-model="flight.flpName1"
            :rules="[(val) => !!val || '* Required']"
            class="q-mb-sm"
            label="Naam"
            stack-label
          />
          <q-input
            v-model="flight.flpEmail1"
            :rules="[emailRule]"
            class="q-mb-sm"
            label="E-mailadres"
            lazy-rules
            stack-label
          />
          <div class="row">
            <div class="col-8">
              <q-input
                v-model="flight.flpPhone1"
                :rules="[phoneRule]"
                class="q-mb-sm"
                label="Telefoonummer"
                lazy-rules
                mask="###############"
                maxlength="15"
                stack-label
              />
            </div>
            <div class="col-4">
              <q-input
                v-model="flight.flpHandicap1"
                :rules="[
                  (val) =>
                    (val !== '' &&
                      val !== null &&
                      val > -9.9 &&
                      val <= maxHandicap) ||
                    '* tussen -9.9 tot ' + maxHandicap,
                ]"
                class="q-mb-sm"
                label="Handicap"
                mask="##.#"
                reverse-fill-mask
                stack-label
              />
            </div>
          </div>

          <p v-if="flight.fltSize >= 2">
            Voer hier de gegevens van uw medespelers in:
          </p>
          <div v-if="flight.fltSize >= 2" class="row">
            <div class="col-8">
              <q-input
                v-model="flight.flpName2"
                :rules="[(val) => !!val || '* Required']"
                class="q-mb-sm"
                label="Speler 2"
                stack-label
              />
            </div>
            <div class="col-4">
              <q-input
                v-model="flight.flpHandicap2"
                :rules="[
                  (val) =>
                    (val !== '' &&
                      val !== null &&
                      val > -9.9 &&
                      val <= maxHandicap) ||
                    '* tussen -9.9 tot ' + maxHandicap,
                ]"
                class="q-mb-sm"
                label="Handicap"
                mask="##.#"
                reverse-fill-mask
                stack-label
              />
            </div>
          </div>
          <div v-if="flight.fltSize >= 3" class="row">
            <div class="col-8">
              <q-input
                v-model="flight.flpName3"
                :rules="[(val) => !!val || '* Required']"
                class="q-mb-sm"
                label="Speler 3"
                stack-label
              />
            </div>
            <div class="col-4">
              <q-input
                v-model="flight.flpHandicap3"
                :rules="[
                  (val) =>
                    (val !== '' &&
                      val !== null &&
                      val > -9.9 &&
                      val <= maxHandicap) ||
                    '* tussen -9.9 tot ' + maxHandicap,
                ]"
                class="q-mb-sm"
                label="Handicap"
                mask="##.#"
                reverse-fill-mask
                stack-label
              />
            </div>
          </div>
          <div v-if="flight.fltSize >= 4" class="row">
            <div class="col-8">
              <q-input
                v-model="flight.flpName4"
                :rules="[(val) => !!val || '* Required']"
                class="q-mb-sm"
                label="Speler 4"
                stack-label
              />
            </div>
            <div class="col-4">
              <q-input
                v-model="flight.flpHandicap4"
                :rules="[
                  (val) =>
                    (val !== '' &&
                      val !== null &&
                      val > -9.9 &&
                      val <= maxHandicap) ||
                    '* tussen -9.9 tot ' + maxHandicap,
                ]"
                class="q-mb-sm"
                label="Handicap"
                mask="##.#"
                reverse-fill-mask
                stack-label
              />
            </div>
          </div>

          <div v-if="hasPayOption">
            <div class="row">Betaalwijze:</div>
            <div class="row q-mt-md">
              <q-option-group
                v-model="flight.payMethod"
                :options="paymentOptions"
              />
            </div>
          </div>

          <div v-if="hasPayOption">
            <div class="row">Leveringsvoorwaarden:</div>
            <div
              class="row q-pa-sm"
              style="
                border: 1px solid lightgrey;
                height: 150px;
                font-size: 10px;
                overflow-y: scroll;
              "
            >
              {{ conditions }}
            </div>
            <div class="row q-mt-md">
              <q-checkbox
                v-model="flight.agreeConditions"
                :rules="[(val) => !!val || '* Required']"
                class="q-mb-sm"
                label="Ik ga akkoord met de leveringsvoorvaarden"
                stack-label
              />
            </div>
            <div class="row">
              <q-checkbox
                v-model="flight.agreeCommerce"
                :rules="[(val) => !!val || '* Required']"
                class="q-mb-sm"
                label="Stuur mij aanbiedingen"
                stack-label
              />
            </div>
          </div>
          <q-btn
            class="q-mr-sm"
            color="primary"
            label="Terug"
            v-on:click="step = 1"
          />
          <q-btn
            v-if="pay"
            :disable="!valid"
            color="primary"
            label="Betaal"
            v-on:click="handleSave"
          />
          <q-btn
            v-else
            :disable="!valid"
            class="q-mr-sm"
            color="primary"
            label="Reserveren"
            v-on:click="handleSave"
          />
        </div>
      </div>

      <payment
        v-if="mollie !== null"
        v-show="step === 3"
        :id="mollie.id"
        :url="mollie.url"
        v-on:handleClosePayment="handleClosePayment"
      />

      <confirmation v-if="step === 4"/>
    </q-page>
  </q-page-container>
</template>

<script>
import CourseComp from "../components/teetime/Course.vue";

import dayjs from "dayjs";
import Payment from "components/payment/initiate.vue";
import Confirmation from "components/teetime/Confirmation.vue";

export default {
  components: {
    Confirmation,
    Payment,
    CourseComp,
  },
  data() {
    return {
      step: 1,
      courses: [],
      loading: false,
      holesArray: [
        {label: "9 Holes", value: 9},
        {label: "18 Holes", value: 18},
      ],
      perArray: [
        {label: "Dag", value: 1},
        {label: "Ochtend", value: 2},
        {label: "Middag", value: 3},
        {label: "Avond", value: 4},
      ],
      sizeArray: [
        {label: "1", value: 1},
        {label: "2", value: 2},
        {label: "3", value: 3},
        {label: "4", value: 4},
      ],

      date: this.$dayjs().format("DD-MM-YYYY"),
      timeObject: null,
      timePrice: 0,
      size: 3,
      holes: {label: "9 Holes", value: 9},
      per: {label: "Dag", value: 1},

      flight: {
        fltDate: null,
        fltTime1: null,
        fltTime1Booked: null,
        fltCrlNr1: null,
        fltCrlNr2: null,
        fltSize: this.$store.getters["settings/publicItems"].planner_default_reservation_count,

        flpName1: "",
        flpEmail1: null,
        flpPhone1: "",
        flpHandicap1: null,

        flpName2: "",
        flpEmail2: null,
        flpPhone2: "",
        flpHandicap2: null,

        flpName3: "",
        flpEmail3: null,
        flpPhone3: "",
        flpHandicap3: null,

        flpName4: "",
        flpEmail4: null,
        flpPhone4: "",
        flpHandicap4: null,
        agreeConditions: false,
        agreeCommerce: false,
        payMethod: 'onCourse'
      },
      maxHandicap: 54,
      maxTotalHandicap: 108,
      mollie: null,
      paymentOptions: [
        {label: "Betaal direct online en ontvang € 5 korting per persoon", value: "iDeal"},
        {label: "Op locatie", value: "onCourse"},
      ],
    };
  },
  mounted() {
    this.date = this.$dayjs().format("YYYY-MM-DD");
  },
  watch: {
    date: function () {
      this.handleLoadDate();
    },
    timeObject: function (newValue) {
      this.flight.fltDate = newValue.sttDate;
      this.flight.fltTime1 = newValue.sttTimeFrom;
      this.flight.fltTime1Booked = newValue.sttTimeFrom;
      this.flight.fltCrlNr1 = newValue.sttCrlNr;
      this.flight.fltCrlNr2 =
        this.holes.value === 18 ? newValue.sttCrlNrNext : null;
      this.step = 2;
    },
  },
  computed: {
    maxFlightHandicap() {
      let maxSizeHcp = this.size * this.maxHandicap;
      return maxSizeHcp < this.maxTotalHandicap
        ? maxSizeHcp
        : this.maxTotalHandicap;
    },
    dayjs() {
      return dayjs;
    },
    conditions: function () {
      return this.$store.state.settings.publicItems.website_payment_conditions;
    },
    mergeText: function () {
      return this.$store.state.settings.publicItems.website_flight_merge_text;
    },
    valid: function () {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return (
        this.flight.flpName1.length > 3 &&
        this.flight.flpPhone1.length > 7 &&
        (!this.hasPayOption || this.flight.agreeConditions) &&
        emailPattern.test(this.flight.flpEmail1) &&
        this.validHcp
      );
    },
    hasTimes: function () {
      return (
        this.courses.filter((course) => {
          return Object.keys(course.times).length > 0;
        }).length > 0
      );
    },
    emailRule() {
      return (val) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(val) || "onvolledig e-mailadres";
      };
    },
    phoneRule() {
      return (val) => {
        return val.length > 8;
      };
    },
    flightPrice: function () {
      return Math.round(this.timePrice * 100) / 100;
    },
    totalHandicap() {
      let hcp = parseFloat(this.flight.flpHandicap1);
      hcp +=
        parseInt(this.flight.fltSize) > 1
          ? parseFloat(this.flight.flpHandicap2)
          : 0;
      hcp +=
        parseInt(this.flight.fltSize) > 2
          ? parseFloat(this.flight.flpHandicap3)
          : 0;
      hcp +=
        parseInt(this.flight.fltSize) > 3
          ? parseFloat(this.flight.flpHandicap4)
          : 0;
      return hcp;
    },
    validHcp() {
      return this.totalHandicap < this.maxTotalHandicap;
    },
    pay() {
      return (
        this.hasPayOption && this.flight.payMethod === 'iDeal'
      );
    },
    hasPayOption() {
      return this.$store.state.settings.publicItems.app_display_greenfee_pay == 1;
    }
  },
  methods: {
    async handleLoadDate() {
      this.courses = [];
      this.loading = true;
      let res = await this.$http.get("igg?date=" + this.date);
      this.loading = false;
      this.courses = res.payload;
      if (!this.hasTimes) {
        this.date = this.$dayjs(this.date).add(1, "day").format("YYYY-MM-DD");
      }
    },
    setDay: function (value) {
      this.date = this.$dayjs(this.date)
        .add(value, "days")
        .format("YYYY-MM-DD");
    },
    handleSave: function () {
      this.$http.post("igg/guest", this.flight).then((res) => {
        if (res.data.mollie) {
          window.location.href = res.data.mollie.url;
        } else if (res.data.redirect.length > 0) {
          window.location = res.data.redirect;
        } else {
          this.step = 4;
        }
      });
    },
    setTimeObject: function (obj) {
      this.timeObject = obj.time;
      this.timePrice = obj.price;
      this.maxHandicap = obj.course.crlMaxHandicap;
      this.maxTotalHandicap = obj.course.crlMaxTotalHandicap;
    },
    handleClosePayment: function (status) {
      if (status === "paid") {
        this.handleLoadDate();
        this.step = 1;
      } else {
        this.step = 2;
      }
      this.mollie = null;
    },
  },
};
</script>
