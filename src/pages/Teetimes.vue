<template>
  <q-page-container>
    <div v-show="step == 1" class="row">
      <div class="col-md-4 offset-md-4 col-xs-12">
        <div class="row">
          <div class="col-8 text-h5">Boek een starttijd</div>
          <div class="col-4 text-right">
            <q-btn-group>
              <q-btn
                color="secondary"
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
            <q-input v-model="date" label="Datum" size="sm" type="date" />
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
            Om de baan optimaal te benutten kan het zijn dat uw boeking wordt
            samengevoegd met een andere boeking. U kunt ook bij een reeds
            bestaande boeking aansluiten. Een boeking waarbij u kunt aansluiten
            is oranje gekleurd. U ziet in deze boeking een aantal poppetjes dit
            geeft aan hoeveel personen er al in de boeking staan.
          </div>
          <div class="row q-gutter-xs">
            <div
              v-for="(course, cKey) in courses"
              :key="cKey"
              class="q-pa-sm col items-start text-center text-white bg-secondary text-bold"
            >
              {{ course.crlName }}
            </div>
          </div>
          <div
            class="row q-gutter-xs"
            style="max-height: 600px; overflow: scroll"
          >
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
              padding-top: 50px;
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
              padding-top: 50px;
              border: 1px solid darkgray;
            "
          >
            Helaas we geen starttijden kunnen vinden voor de door u gekozen
            datum en holes.
          </div>
        </div>
      </div>
    </div>

    <div v-show="step == 2" class="row q-mt-md">
      <div class="col-md-4 offset-md-4 col-xs-12">
        <div class="row text-center q-mb-lg">
          <div class="col text-h5 q-ml-auto q-mr-auto">Jouw reservering</div>
        </div>

        <div class="row">
          <div class="col-4 text-bold">Datum:</div>
          <div class="col-8">
            {{ dayjs(date).format("dddd DD MMMM") }}
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
            {{ size }}
          </div>
        </div>

        <div class="row">
          <div class="col-4 text-bold">Holes:</div>
          <div class="col-8">
            {{ holes.value }}
          </div>
        </div>

        <div class="row q-mb-lg">
          <div class="col-4 text-bold">Te betalen bedrag:</div>
          <div class="col-8">
            {{ $filters.money(flightPrice) }}
          </div>
        </div>

        <div class="row">
          Nadat je de flight hebt betaald ontvang je een e-mail ter bevestiging
          van je reservering. In deze e-mail vindt je een link waarmee je je
          resevering kan aanvullen met de details van je medespelers.
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
        <q-input
          v-model="flight.flpPhone1"
          :rules="[(val) => !!val || '* Required']"
          class="q-mb-sm"
          label="Telefoonummer"
          lazy-rules
          stack-label
        />
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
        <q-btn
          class="q-mr-sm"
          color="primary"
          label="Terug"
          v-on:click="step = 1"
        />
        <q-btn
          v-show="1 == 2"
          :disable="!valid"
          class="q-mr-sm"
          color="primary"
          label="Reserveren"
          v-on:click="handleSave"
        />
        <q-btn
          :disable="!valid"
          color="primary"
          label="Betaal"
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
  </q-page-container>
</template>

<script>
import CourseComp from "../components/teetime/Course.vue";

import publicMixin from "../mixins/public";
import dayjs from "dayjs";
import Payment from "components/payment/initiate.vue";

export default {
  mixins: [publicMixin],
  components: {
    Payment,
    CourseComp,
  },
  data() {
    return {
      step: 1,
      courses: [],
      loading: false,
      holesArray: [
        { label: "9 Holes", value: 9 },
        { label: "18 Holes", value: 18 },
      ],
      perArray: [
        { label: "Dag", value: 1 },
        { label: "Ochtend", value: 2 },
        { label: "Middag", value: 3 },
        { label: "Avond", value: 4 },
      ],
      sizeArray: [
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
      ],

      date: this.$dayjs().format("DD-MM-YYYY"),
      timeObject: null,
      timePrice: 0,
      size: 3,
      holes: { label: "9 Holes", value: 9 },
      per: { label: "Dag", value: 1 },

      flight: {
        fltDate: null,
        fltTime1: null,
        fltTime1Booked: null,
        fltCrlNr1: null,
        fltCrlNr2: null,
        fltSize: 3,

        flpName1: "laurens",
        flpEmail1: "laurens@intogolf.nl",
        flpPhone1: "878987898",
        flpHandicap1: null,

        flpName2: "",
        flpEmail2: "",
        flpPhone2: "",
        flpHandicap2: null,

        flpName3: "",
        flpEmail3: "",
        flpPhone3: "",
        flpHandicap3: null,

        flpName4: "",
        flpEmail4: "",
        flpPhone4: "",
        flpHandicap4: null,
        agreeConditions: true,
        agreeCommerce: false,
      },
      mollie: null,
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
    dayjs() {
      return dayjs;
    },
    conditions: function () {
      if (this.settings === null) {
        return "";
      }
      return this.settings.website_payment_conditions;
    },
    mergeText: function () {
      if (this.settings === null) {
        return "";
      }
      return this.settings.website_flight_merge_text;
    },
    valid: function () {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return (
        this.flight.flpName1.length > 3 &&
        this.flight.agreeConditions &&
        emailPattern.test(this.flight.flpEmail1)
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
    flightPrice: function () {
      return Math.round(this.timePrice * this.flight.fltSize * 100) / 100;
    },
  },
  methods: {
    handleLoadDate: function () {
      this.courses = [];
      this.loading = true;
      this.$http.get("igg?date=" + this.date).then((res) => {
        this.loading = false;
        this.courses = res.payload;
      });
    },
    setDay: function (value) {
      this.date = this.$dayjs(this.date)
        .add(value, "days")
        .format("YYYY-MM-DD");
    },
    handleSave: function () {
      this.$http.post("igg/guest", this.flight).then((res) => {
        this.mollie = res.data;
        this.step = 3;
      });
    },
    setTimeObject: function (obj) {
      this.timeObject = obj.time;
      this.timePrice = obj.price;
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
