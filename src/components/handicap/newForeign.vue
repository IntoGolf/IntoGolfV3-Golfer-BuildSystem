<template>
  <q-card>
    <q-card-section class="text-h6">
      Nieuwe scorekaart buitenland
    </q-card-section>

    <q-separator inset />

    <q-card-section class="q-pt-none">
      <q-form class="q-gutter-sm q-mt-md">
        <p v-show="step === 1" class="q-mb-none">
          Datum waarop de kaart is gespeeld
        </p>
        <q-input
          v-show="step === 1"
          ref="date"
          v-model="date"
          :rules="validDate"
          lazy-rules
          outlined
          type="date"
        />

        <p v-show="step === 1" class="q-mb-none">
          Tijdstip waarop de kaart is gespeeld
        </p>
        <q-input
          v-show="step === 1"
          v-model="time"
          :rules="validNone"
          lazy-rules
          mask="time"
          outlined
          type="time"
        />

        <p v-show="step === 1" class="q-mb-none">
          Land waar de kaart is gespeeld
        </p>
        <q-select
          v-show="step === 1"
          v-model="local_scorecard.course_country_code"
          :options="countryArray"
          :rules="validNone"
          emit-value
          map-options
          option-label="couName"
          option-value="couIsoCode"
          outlined
        />

        <p v-show="step === 2" class="q-mb-none">Voer de naam van de baan</p>
        <q-input
          v-show="step === 2"
          v-model="local_scorecard.course_name"
          :rules="[(val) => (val && val.length > 0) || 'Ongeldige baan naam']"
          lazy-rules
          outlined
        />

        <p v-show="step === 2" class="q-mb-none">Selecteer het aantal holes</p>
        <q-select
          v-show="step === 2"
          v-model="local_scorecard.loop"
          :options="holes_array"
          :rules="validNone"
          behavior="menu"
          emit-value
          lazy-rules
          outlined
        />

        <p v-show="step === 2" class="q-mb-none">Voer de naam van de lus</p>
        <q-input
          v-show="step === 2"
          v-model="local_scorecard.loop_name"
          :rules="[(val) => (val && val.length > 0) || 'Ongeldige lus naam']"
          lazy-rules
          outlined
        />

        <p v-show="step === 2" class="q-mb-none">Selecteer de tee</p>
        <q-select
          v-show="step === 2"
          v-model="local_scorecard.tee"
          :options="teeArray"
          :rules="validNone"
          behavior="menu"
          emit-value
          outlined
        />

        <q-input
          v-show="step === 3"
          v-model="local_scorecard.courserate"
          :rules="validCourseRating"
          hint="Voer hier de courserating in van de gespeelde baan"
          label="Courserating"
          lazy-rules
          type="number"
        />

        <q-input
          v-show="step === 3"
          v-model="local_scorecard.sloperate"
          :rules="validSlopeRating"
          hint="Voer hier de sloperating in van de gespeelde baan"
          label="Sloperating"
          lazy-rules
          type="number"
        />

        <q-input
          v-show="step === 3"
          v-model="local_scorecard.total_par"
          :rules="validTotalPar"
          hint="Voer hier de par in van de gespeelde baan"
          label="Par"
          lazy-rules
          type="number"
        />

        <q-input
          v-show="step === 4"
          v-model="local_scorecard.total_stableford"
          :rules="validStableford"
          hint="Voer hier aantal stableford punten in"
          label="Punten"
          lazy-rules
          type="number"
        />

        <q-input
          v-show="step === 4"
          ref="gsn"
          v-model="local_scorecard.marker"
          :rules="validGsn"
          hint="Type hier het GSN (NL00000000) van de marker"
          label="Marker"
          mask="AA########"
          type="text"
        />

        <q-input
          v-show="step === 4"
          v-model="local_scorecard.remarks"
          hint="Heeft u een opmerking voer deze hier in"
          label="Opmerking"
          type="text"
        />

        <div class="q-pa-md">
          <q-btn-group spread>
            <q-btn
              v-show="step > 1"
              color="primary"
              label="Vorig"
              @click="setStep(-1)"
            />
            <q-btn
              v-show="step < 4"
              :disable="!isStepValid"
              color="primary"
              label="Volgende"
              @click="setStep(1)"
            />
            <q-btn
              v-show="step === 4"
              :disable="!isStepValid"
              color="primary"
              label="Opslaan"
              @click="onSaveScorecard()"
            />
          </q-btn-group>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<style lang="scss" scoped>
#div-scorecard-details {
  .row {
    margin-bottom: 10px;
  }

  .row .col {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>

<script>
import authMixin from "../../mixins/auth";

export default {
  mixins: [authMixin],
  props: {
    artificialDate: Date,
    scorecard: Object,
    countryArray: Array,
  },
  data() {
    return {
      step: 1,
      date: this.$dayjs(this.scorecard.datetime).format("YYYY-MM-DD"),
      time: this.$dayjs(this.scorecard.datetime).format("HH:mm"),
      local_scorecard: this.scorecard,
      teeList: [
        { id: 7, label: "Heren zwart" },
        { id: 8, label: "Heren wit" },
        { id: 9, label: "Heren geel" },
        { id: 10, label: "Heren blauw" },
        { id: 11, label: "Heren rood" },
        { id: 12, label: "Heren oranje" },
        { id: 13, label: "Dames geel" },
        { id: 14, label: "Dames blauw" },
        { id: 15, label: "Dames rood" },
        { id: 16, label: "Dames oranje" },
        { id: 17, label: "Dames zwart" },
      ],
      holes_array: [
        {
          id: 1,
          label: "9 Holes",
        },
        {
          id: 101,
          label: "18 Holes",
        },
      ],
      scorecardRules: {
        date: [
          {
            required: true,
            message: "Please input datum",
            trigger: "blur",
            date: this.$dayjs(),
          },
        ],
        time: [
          {
            required: true,
            message: "Please input tijd",
            trigger: "blur",
          },
        ],
        course: [
          {
            required: true,
            message: "Please select Baan",
            trigger: "change",
          },
        ],
        loop: [
          {
            required: true,
            message: "Please select Lus",
            trigger: "change",
          },
        ],
        bltId: [
          {
            required: true,
            message: "Please select Tee",
            trigger: "change",
          },
        ],
      },
      lus: [],
      feeMaleTees: [13, 14, 15, 16, 17],
    };
  },
  watch: {
    date: function (newValue) {
      this.local_scorecard.datetime = newValue + " " + this.time;
    },
    time: function (newValue) {
      this.local_scorecard.datetime = this.date + " " + newValue;
    },
  },
  mounted() {
    this.local_scorecard.tee = this.defaultTee;
    this.local_scorecard.course_name = "";
    this.local_scorecard.course_country_code = "BE";
  },
  computed: {
    defaultTee: function () {
      if (this.currentUser.relGender === 2) {
        return this.teeList.find((tee) => tee.id === 15);
      } else {
        return this.teeList.find((tee) => tee.id === 9);
      }
    },
    teeArray: function () {
      if (this.currentUser.relGender === 2) {
        return this.teeList.filter((tee) => this.feeMaleTees.includes(tee.id));
      } else {
        return this.teeList.filter((tee) => !this.feeMaleTees.includes(tee.id));
      }
    },
    validNone: function () {
      return true;
    },
    validDate: function () {
      if (this.date === "" || this.date === null) {
        return false;
      }

      let artDate = new Date(this.artificialDate);
      let varDate = new Date(this.date);
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      varDate.setHours(0, 0, 0, 0);

      if (varDate > today) {
        return [(val) => false || "Datum mag niet in de toekomst liggen"];
      }

      if (varDate < today.setDate(today.getDate() - 5)) {
        return [
          (val) =>
            false || "Datum mag niet meer dan 5 dagen in het verleden liggen",
        ];
      }

      if (varDate < artDate) {
        return [(val) => false || "Datum mag niet voor eerste kaart liggen"];
      }

      return [(val) => true || ""];
    },
    isStepValid: function () {
      if (this.step === 1 && this.date.length > 0) {
        if (this.$refs.date === undefined) {
          return true;
        } else {
          return !this.$refs.date.hasError;
        }
      }
      if (this.step === 2) {
        return (
          this.local_scorecard.course_name.length > 0 &&
          this.local_scorecard.loop_name.length > 0 &&
          this.local_scorecard.tee.label.length > 0
        );
      }
      if (this.step === 3) {
        return (
          this.local_scorecard.courserate >= 20 &&
          this.local_scorecard.courserate < 99 &&
          this.local_scorecard.sloperate >= 55 &&
          this.local_scorecard.sloperate <= 155 &&
          this.local_scorecard.total_par >= 27 &&
          this.local_scorecard.total_par <= 90
        );
      }
      if (this.step === 4) {
        return (
          this.local_scorecard.total_stableford > 0 &&
          this.local_scorecard.total_stableford <= 54 &&
          !this.gsnIsInvalid
        );
      }
      return false;
    },
    validCourseRating: function () {
      return [
        () =>
          (this.local_scorecard.courserate >= 20 &&
            this.local_scorecard.courserate <= 99) ||
          "Waarde van de courserating moet tussen 20 en 99 liggen",
      ];
    },
    validSlopeRating: function () {
      return [
        () =>
          (this.local_scorecard.sloperate >= 55 &&
            this.local_scorecard.sloperate <= 155) ||
          "Waarde van de sloperating moet tussen 55 en 155 liggen",
      ];
    },
    validTotalPar: function () {
      return [
        () =>
          (this.local_scorecard.total_par >= 27 &&
            this.local_scorecard.total_par <= 90) ||
          "Waarde van de par moet tussen 27 en 90 liggen",
      ];
    },
    validStableford: function () {
      return [
        () =>
          (this.local_scorecard.total_stableford > 0 &&
            this.local_scorecard.total_stableford <= 54) ||
          "Waarde van de stablefordpunten moet tussen 0 en 54 liggen",
      ];
    },
    validGsn: function () {
      return [
        () =>
          !this.gsnIsInvalid ||
          "Voer een geldig GSN nummer in of laat het veld leeg",
      ];
    },
    gsnIsInvalid: function () {
      if (this.local_scorecard.marker.length > 0) {
        if (this.local_scorecard.marker.length < 10) {
          return true;
        } else if (this.local_scorecard.marker.length > 10) {
          return true;
        } else if (isNaN(parseInt(this.local_scorecard.marker.substr(2, 8)))) {
          return true;
        } else if (!/[A-Z]/.test(this.local_scorecard.marker.substr(0, 1))) {
          return true;
        } else if (!/[A-Z]/.test(this.local_scorecard.marker.substr(1, 2))) {
          return true;
        } else if (this.local_scorecard.marker === "NL00000000") {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    setStep: function (value) {
      if (this.step === 1 && value === -1) {
        return;
      }
      this.step += value;
    },

    onSaveScorecard: function () {
      this.$emit("handleSave", this.local_scorecard, true);
    },

    onCancelScorecard: function () {
      this.$emit("handleClose", true);
    },
  },
};
</script>
