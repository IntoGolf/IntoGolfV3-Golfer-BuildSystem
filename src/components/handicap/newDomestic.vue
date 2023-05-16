<template>
  <q-card>
    <q-card-section class="text-h6">
      Nieuwe scorekaart binnenland
    </q-card-section>

    <q-separator inset />

    <q-card-section class="q-pt-none">
      <!--Step 1: date and time-->
      <div v-if="step === 1">
        <q-input
          v-show="step === 1"
          ref="date"
          v-model="date"
          :rules="validDate"
          label="Datum"
          lazy-rules
          type="date"
        />

        <q-input
          v-show="step === 1"
          v-model="time"
          lazy-rules
          mask="time"
          type="time"
        />

        <q-input
          v-show="step === 1"
          ref="gsn"
          v-model="local_scorecard.marker"
          :rules="validGsn"
          hint="Type hier het GSN (NL00000000) van de marker"
          label="Marker"
          mask="AA########"
          placeholder="'NL00000000'"
          type="text"
        />

        <q-input
          v-show="step === 1"
          v-model="local_scorecard.remarks"
          hint="Heeft u een opmerking voer deze hier in"
          label="Opmerking"
          type="text"
        />

        <q-select
          v-show="step === 1"
          v-model="local_scorecard.is_qualifying"
          :options="[
            { value: 0, label: 'Nee' },
            { value: 1, label: 'Ja' },
          ]"
          emit-value
          hint="Wilt u deze kaart als qualifying registreren"
          label="Qualifying"
          map-options
        />

        <q-select
          v-show="step === 1"
          v-model="local_scorecard.is_competition"
          :options="[
            { value: 0, label: 'Nee' },
            { value: 1, label: 'Ja' },
          ]"
          emit-value
          hint="Wilt u deze kaart als wedstrijdkaart registreren"
          label="Wedstrijdkaart"
          map-options
        />

        <q-btn-group class="q-mt-lg" spread>
          <q-btn
            :disabled="gsnIsInvalid || !date || !time"
            color="secondary"
            icon-right="navigate_next"
            label="Baan"
            @click="step = 2"
          />
        </q-btn-group>
      </div>

      <!--Step 2: course-->
      <div v-if="step === 2">
        <q-select
          v-model="location"
          :options="locationListFiltered"
          clearable
          input-debounce="0"
          option-label="name"
          option-value="ngfNumber"
          use-input
          v-on:input-value="onSetCourseFilterString"
        />

        <q-btn-group class="q-mt-lg" spread>
          <q-btn
            color="secondary"
            icon="navigate_before"
            label="datum"
            @click="step = 1"
          />
          <q-btn
            :disabled="!location"
            color="secondary"
            icon-right="navigate_next"
            label="Lus"
            @click="step = 3"
          />
        </q-btn-group>
      </div>

      <!--Step 3: lus-->
      <div v-if="step === 3">
        <q-list bordered separator>
          <q-item
            v-for="(item, index) in courseList"
            v-bind:key="index"
            v-ripple
            class="itg-q-item"
            clickable
            @click="course = item"
          >
            <q-item-section>
              <q-item-label class="itg-text-overflow"
                >{{ item.name }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-btn-group class="q-mt-lg" spread>
          <q-btn
            color="secondary"
            icon="navigate_before"
            label="Baan"
            @click="step = 2"
          />
        </q-btn-group>
      </div>

      <!--Step 4: tee -->
      <div v-if="step === 4">
        <q-list bordered separator>
          <q-item
            v-for="(item, index) in teeListFiltered"
            v-bind:key="index"
            v-ripple
            class="itg-q-item"
            clickable
            @click="tee = item"
          >
            <q-item-section>
              <q-item-label class="itg-text-overflow">
                <q-icon
                  :style="{ backgroundColor: item.backgroundColor }"
                  class="fal fa-golf-ball"
                />
                {{ item.name }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-btn-group class="q-mt-lg" spread>
          <q-btn
            color="secondary"
            icon="navigate_before"
            label="Lus"
            @click="step = 3"
          />
        </q-btn-group>
      </div>

      <!--Step 5: confirmation-->
      <div v-if="step === 5" class="q-mb-md">
        <div class="row q-mt-md">
          <div class="col text-bold">Datum</div>
          <div class="col text-right itg-text-overflow">
            {{ date }}
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col text-bold">Tijd</div>
          <div class="col text-right itg-text-overflow">
            {{ time }}
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col text-bold">Baan</div>
          <div class="col text-right itg-text-overflow">
            {{ location.name }}
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col text-bold">Lus</div>
          <div class="col text-right itg-text-overflow">
            {{ course.name }}
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col text-bold">Tee</div>
          <div class="col text-right itg-text-overflow">
            {{ tee.name }}
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col text-bold">Courserating</div>
          <div class="col text-right itg-text-overflow">
            {{ tee.courseRating }}
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col text-bold">Sloperating</div>
          <div class="col text-right itg-text-overflow">
            {{ tee.slopeRating }}
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col" style="font-weight: bold">Par</div>
          <div class="col text-right itg-text-overflow">
            {{ tee.totalPar }}
          </div>
        </div>

        <q-btn-group class="q-mt-lg" spread>
          <q-btn color="secondary" icon="navigate_before" @click="step = 4" />

          <q-btn
            color="secondary"
            icon="check"
            @click="$emit('handleSave', local_scorecard, true)"
          />

          <q-btn
            color="secondary"
            icon="close"
            @click="$emit('handleClose', true)"
          />
        </q-btn-group>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import authMixin from "../../mixins/auth";

export default {
  mixins: [authMixin],
  props: {
    artificialDate: Date,
    scorecard: Object,
    handicap: Number,
  },
  data() {
    return {
      step: 1,

      date: this.$dayjs(this.scorecard.datetime).format("YYYY-MM-DD"),
      time: this.$dayjs(this.scorecard.datetime).format("HH:mm"),

      local_scorecard: this.scorecard,

      locationList: [],
      locationListFilterString: "",
      location: null,

      courseList: [],
      course: null,

      teeList: [],
      tee: null,
    };
  },
  created() {
    this.$http.get("golfer/locationList").then((res) => {
      this.locationList = res;
      this.location = this.locationList.find(
        (location) => location.ngfNumber === 2
      );
    });
  },
  watch: {
    date: function (newValue) {
      this.local_scorecard.datetime = newValue + " " + this.time;
    },
    time: function (newValue) {
      this.local_scorecard.datetime = this.date + " " + newValue;
    },
    location: function (newValue) {
      if (newValue === null) {
        return;
      }
      this.local_scorecard.course = newValue.ngfNumber;
      this.$http
        .get("golfer/courseList?associationId=" + newValue.associationId)
        .then((res) => {
          this.courseList = res;
        });
    },
    course: function (newValue) {
      this.local_scorecard.loop = newValue.number;
      this.$http.get("golfer/teeList?id=" + newValue.id).then((res) => {
        this.teeList = res;
        this.step = 4;
      });
    },
    tee: function (newValue) {
      this.local_scorecard.tee = newValue.color + 1; //correct for NGF mistake
      this.local_scorecard.holes = [];

      for (let i = 1; i <= this.course.courseType; i++) {
        let hole = {
          number: i,
          par: newValue["parHole" + i],
          strokeIndex: newValue["strokeIndexHole" + i],
          stableford: 0,
          is_computed: 0,
          strokes: 0,
        };
        this.local_scorecard.holes.push(hole);
      }

      this.local_scorecard.total_par = newValue.totalPar;
      this.step = 5;
    },
  },
  computed: {
    locationListFiltered: function () {
      if (this.locationListFilterString === "") {
        return this.locationList;
      }
      return this.locationList.filter(
        (course) =>
          course.name.toLowerCase().indexOf(this.locationListFilterString) > -1
      );
    },
    teeListFiltered: function () {
      return this.teeList.filter(
        (item) =>
          (this.currentUser.relGender === 1 && item.gender === "M") ||
          (this.currentUser.relGender !== 1 && item.gender === "F")
      );
    },
    plHcp: function () {
      let hcp = this.handicap === 55 ? 54 : this.handicap;
      if (this.loop.courseType === 18) {
        return Math.round(
          hcp * (this.tee.slopeRating / 113) +
            (this.tee.courseRating - this.tee.totalPar),
          0
        );
      }
      return Math.round(
        (hcp / 2) * (this.tee.slopeRating / 113) +
          (this.tee.courseRating - this.tee.totalPar),
        0
      );
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
    validGsn: function () {
      return [
        (val) =>
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
    onSetCourseFilterString: function (value) {
      this.locationListFilterString = value;
    },
  },
};
</script>
