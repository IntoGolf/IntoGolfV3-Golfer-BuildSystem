<template>
  <q-page-container class="q-ma-sm">
    <div v-show="step == 1" class="row q-mt-md">
      <div class="col-md-4 offset-md-4 col-xs-12">
        <div class="row">
          <div class="col-8 text-h5">Boek een starttijd</div>
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
          <div class="col text-h5 q-ml-auto q-mr-auto">
            Jouw reservering:
            {{ $filters.unixToDate(flight.fltDate, "dddd DD MMMM") }}
            {{ $filters.minuteToTime(flight.fltTime1) }}
          </div>
        </div>
        <div class="row">
          <div class="col-8">
            <q-input
              v-model="flight.flpName1"
              :rules="[(val) => !!val || '* Required']"
              class="q-mb-sm"
              label="Uw naam"
              stack-label
            />
          </div>
          <div class="col-4">
            <q-input
              v-model="flight.flpHandicap1"
              :rules="[
                (val) => (val > -9.9 && val <= 54) || '* tussen -9.9 tot 54.0',
              ]"
              class="q-mb-sm"
              fill-mask="0"
              label="Uw handicap"
              mask="##.#"
              reverse-fill-mask
              stack-label
            />
          </div>
        </div>
        <q-input
          v-model="flight.flpEmail1"
          :rules="[emailRule]"
          class="q-mb-sm"
          label="Uw e-mailadres"
          stack-label
        />
        <q-input
          v-model="flight.flpPhone1"
          :rules="[(val) => !!val || '* Required']"
          class="q-mb-sm"
          label="Uw telefoonummer"
          stack-label
        />
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
                (val) => (val > -9.9 && val <= 54) || '* tussen -9.9 tot 54.0',
              ]"
              class="q-mb-sm"
              fill-mask="0"
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
                (val) => (val > -9.9 && val <= 54) || '* tussen -9.9 tot 54.0',
              ]"
              class="q-mb-sm"
              fill-mask="0"
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
                (val) => (val > -9.9 && val <= 54) || '* tussen -9.9 tot 54.0',
              ]"
              class="q-mb-sm"
              fill-mask="0"
              label="Handicap"
              mask="##.#"
              reverse-fill-mask
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
          :disable="!valid"
          color="primary"
          label="Reserveren"
          v-on:click="handleSave"
        />
      </div>
    </div>

    <div v-show="step == 3" class="row q-mt-md">
      <div class="col-md-4 offset-md-4 col-xs-12">
        <div class="row">
          <div class="text-h5 q-mt-md q-mb-md">
            Wij kijken uit naar jouw komst
          </div>
        </div>
        <div class="row q-mb-md">
          Uw starttijd is gereserveerd. Wij sturen u binnen een enkele minuten
          een e-mail met uw reserveringsdetails. In deze mail staat een
          bevestigingslink om de reservering definitief te maken. Door op deze
          link te klikken bevestigd u uw reservering. Ontvangen wij niet binnen
          30 minuten uw reserveringsbevestiging dan wordt uw reservering
          geannuleerd.
        </div>
        <div class="row">
          <q-btn
            color="primary"
            label="Sluiten"
            v-on:click="$router.push('login')"
          />
        </div>
      </div>
    </div>
  </q-page-container>
</template>

<script>
import CourseComp from "../components/teetime/Course.vue";

import publicMixin from "../mixins/public";

export default {
  mixins: [publicMixin],
  components: {
    CourseComp,
  },
  data() {
    return {
      step: 1,
      courses: [],
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

        flpName1: "",
        flpEmail1: "",
        flpPhone1: "",
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
      },
    };
  },
  mounted() {
    this.date = this.$dayjs().format("YYYY-MM-DD");
  },
  watch: {
    date: function () {
      this.$http.get("igg?date=" + this.date).then((res) => {
        this.loading = false;
        this.courses = res.payload;
      });
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
    valid: function () {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return (
        this.flight.flpName1.length > 3 &&
        emailPattern.test(this.flight.flpEmail1) &&
        (this.size === 1 ||
          (this.size > 1 && this.flight.flpName2.length > 3)) &&
        (this.size === 2 ||
          (this.size > 2 && this.flight.flpName3.length > 3)) &&
        (this.size === 3 || (this.size > 3 && this.flight.flpName4.length > 3))
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
  },
  methods: {
    setDay: function (value) {
      this.date = this.$dayjs(this.date)
        .add(value, "days")
        .format("YYYY-MM-DD");
    },
    handleSave: function () {
      this.$http.post("igg/guest", this.flight).then((res) => {
        this.step = 3;
      });
    },
    setTimeObject: function (obj) {
      this.timeObject = obj;
    },
  },
};
</script>
