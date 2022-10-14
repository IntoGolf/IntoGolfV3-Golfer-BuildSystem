<template>

  <q-card>

    <q-card-section class="text-h6">
      Nieuwe scorekaart binnenland
    </q-card-section>

    <q-separator inset/>

    <q-card-section class="q-pt-none">

      <!--Step 1: date and time-->
      <div v-if="step == 1">
        <q-input
            ref="date"
            label="Datum"
            v-model="date"
            v-show="step == 1"
            type="date"
            lazy-rules
            :rules="validDate"/>

        <q-input
            type="time"
            v-model="time"
            mask="time"
            lazy-rules
            v-show="step == 1"/>

        <q-input
            v-show="step == 1"
            ref="gsn"
            type="text"
            v-model="local_scorecard.marker"
            label="Marker"
            hint="Type hier het GSN (NL00000000) van de marker"
            mask="AA########"
            :rules="validGsn"
        />

        <q-btn-group class="q-mt-lg" spread>
          <q-btn
              icon-right="navigate_next"
              color="secondary"
              label="Baan"
              @click="step = 2"
              :disabled="gsnIsInvalid || !date || !time"
          />
        </q-btn-group>
      </div>

      <!--Step 2: course-->
      <div v-if="step == 2">
        <q-select
            v-model="local_scorecard.course"
            :options="courseFilteredArray"
            use-input
            @input-value="setCourseFilterString"
            behavior="menu"
            map-options
            emit-value
        >
        </q-select>

        <q-btn-group class="q-mt-lg" spread>
          <q-btn
              icon="navigate_before"
              color="secondary"
              label="datum"
              @click="step = 1"
          />
          <q-btn
              icon-right="navigate_next"
              color="secondary"
              label="Lus"
              @click="step = 3"
              :disabled="!course"
          />
        </q-btn-group>
      </div>

      <!--Step 3: lus-->
      <div v-if="step == 3">
        <q-list bordered separator>
          <q-item
              clickable
              class="itg-q-item"
              v-ripple
              v-for="(loop, index) in course.baan_lussen"
              v-bind:key="index"
              @click="onChangeLus(loop)"
          >
            <q-item-section>
              <q-item-label class="itg-text-overflow">{{
                  loop.bnlName
                }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-btn-group class="q-mt-lg" spread>
          <q-btn
              icon="navigate_before"
              color="secondary"
              label="Baan"
              @click="step = 2"
          />
        </q-btn-group>
      </div>

      <!--Step 4: tee -->
      <div v-if="step == 4">
        <q-list bordered separator>
          <q-item
              clickable
              class="itg-q-item"
              v-ripple
              v-for="(tee, index) in genderTeeList"
              v-bind:key="index"
              @click="onChangeTee(tee)"
          >
            <q-item-section>
              <q-item-label class="itg-text-overflow">
                <q-icon
                    class="fal fa-golf-ball"
                    :class="teeColor(tee)"
                ></q-icon>
                {{ getTeeName(tee.bltCategory) }}
                <div class="float-right">
                  {{ getTeeAdvise(tee.bltCategory) }}
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-btn-group class="q-mt-lg" spread>
          <q-btn
              icon="navigate_before"
              color="secondary"
              label="Lus"
              @click="step = 3"
          />
        </q-btn-group>
      </div>

      <!--Step 5: confirmation-->
      <div id="div-scorecard-details" v-if="step == 5">
        <div class="row q-mt-md">
          <div class="col" style="font-weight: bold">Datum</div>
          <div class="col text-right itg-text-overflow">
            {{ date }}
          </div>
        </div>

        <div class="row">
          <div class="col" style="font-weight: bold">Tijd</div>
          <div class="col text-right itg-text-overflow">
            {{ time }}
          </div>
        </div>

        <div class="row">
          <div class="col" style="font-weight: bold">Baan</div>
          <div class="col text-right itg-text-overflow">
            {{ courseName }}
          </div>
        </div>

        <div class="row">
          <div class="col" style="font-weight: bold">Lus</div>
          <div class="col text-right itg-text-overflow">
            {{ loopName }}
          </div>
        </div>

        <div class="row">
          <div class="col" style="font-weight: bold">Tee</div>
          <div class="col text-right itg-text-overflow">
            {{ teeName }}
          </div>
        </div>

        <div class="row">
          <div class="col" style="font-weight: bold">Courserating</div>
          <div class="col text-right itg-text-overflow">
            {{ tee.bltCourseRating }}
          </div>
        </div>

        <div class="row">
          <div class="col" style="font-weight: bold">Sloperating</div>
          <div class="col text-right itg-text-overflow">
            {{ tee.bltSlopeRating }}
          </div>
        </div>

        <div class="row">
          <div class="col" style="font-weight: bold">Par</div>
          <div class="col text-right itg-text-overflow">
            {{ par }}
          </div>
        </div>

        <q-btn-group class="q-mt-lg" spread>
          <q-btn
              icon="navigate_before"
              color="secondary"
              @click="step = 4"
          />

          <q-btn
              icon="check"
              color="secondary"
              @click="onSaveScorecard"/>

          <q-btn
              icon="close"
              color="secondary"
              @click="onCancelScorecard"
          />
        </q-btn-group>
      </div>

    </q-card-section>

  </q-card>

</template>

<style lang="scss" scoped>
#div-scorecard-details {
  .row {
    margin-bottom: 10px;
  }
}
</style>

<script>
export default {
  props: {
    artificialDate: Date,
    currentUser: Object,
    scorecard: Object,
    teeArray: Array,
    courseArray: Array,
    handicap: Number
  },
  data() {
    return {
      step: 1,
      date: this.$dayjs(this.scorecard.datetime).format('YYYY-MM-DD'),
      time: this.$dayjs(this.scorecard.datetime).format('HH:mm'),
      local_scorecard: this.scorecard,
      courseFilterString: ''
    };
  },
  watch: {
    date: function (newValue) {
      this.local_scorecard.datetime = newValue + ' ' + this.time;
    },
    time: function (newValue) {
      this.local_scorecard.datetime = this.date + ' ' + newValue;
    }
  },
  computed: {
    genderTeeList: function () {
      let that = this;
      let result = [];
      let femaleTees = [13, 14, 15, 16, 17];
      this.loop.baan_lus_tees.forEach(function (item) {
        if (that.currentUser.relGender == 1) {
          if (!femaleTees.includes(item.bltCategory)) {
            result.push(item);
          }
        } else {
          if (femaleTees.includes(item.bltCategory)) {
            result.push(item);
          }
        }
      });
      return result;
    },
    teeFont: function () {
      if (this.tee == null) {
        return "bg-grey-2";
      }
      return "bg-grey-10";
    },
    courseFilteredArray: function () {
      let array = this.courseArray;
      if (this.courseFilterString != '') {
        array = this.courseArray.filter(course => course.baaClubName.toLowerCase().indexOf(this.courseFilterString) > -1);
      }
      return array.map(course => ({label: course.baaClubName, value: course.baaId}));
    },
    course: function () {
      return this.courseArray.find(course => course.baaId == this.local_scorecard.course);
    },
    courseName: function () {
      if (this.course == null) {
        return "";
      }
      return this.course.baaName;
    },
    loop: function () {
      return this.course.baan_lussen.find(loop => loop.bnlLusNr == this.local_scorecard.loop);
    },
    loopName: function () {
      if (this.loop == null) {
        return "";
      }
      return this.loop.bnlName;
    },
    tee: function () {
      return this.loop.baan_lus_tees.find(item => item.bltCategory == this.local_scorecard.tee);
    },
    teeName: function () {
      if (this.tee == null) {
        return "";
      }
      return this.teeArray.find(tee => tee.Category == this.tee.bltCategory).Omschrijving
    },
    par: function () {
      let result = 0;
      for (let h = 1; h <= 18; h++) {
        result += parseInt(this.tee['bltPar' + h]);
      }
      return result;
    },
    numberOfHoles: function () {
      return this.loop.bnlLusNr > 100 ? 18 : 9;
    },
    plHcp() {
      let hcp = this.handicap == 55 ? 54 : this.handicap;
      if (this.numberOfHoles == 18) {
        return Math.round(hcp * (this.tee.bltSlopeRating / 113) + (this.tee.bltCourseRating - this.par),0);
      }
      return Math.round((hcp / 2) * (this.tee.bltSlopeRating / 113) + (this.tee.bltCourseRating - this.par),0);
    },
    validDate: function () {
      if (this.date == "" || this.date == null) {
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
      if (this.step == 1 && this.date.length > 0) {
        if (this.$refs.date == undefined) {
          return true;
        } else {
          return !this.$refs.date.hasError;
        }
      }
      if (this.step == 2) {
        return (
            this.local_scorecard.course.length > 0 &&
            this.local_scorecard.loop_name.length > 0 &&
            this.local_scorecard.tee_name.length > 0
        );
      }
      if (this.step == 3) {
        return (
            this.local_scorecard.courserate > 20 &&
            this.local_scorecard.courserate < 100 &&
            this.local_scorecard.sloperate > 0 &&
            this.local_scorecard.sloperate < 200 &&
            this.local_scorecard.total_par > 0 &&
            this.local_scorecard.total_par < 100
        );
      }
      if (this.step == 4) {
        return (
            this.local_scorecard.stableford > 20 &&
            this.local_scorecard.stableford < 100 &&
            !this.gsnIsInvalid
        );
      }
      return false;
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
        } else if (this.local_scorecard.marker == "NL00000000") {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    teeColor: function (tee) {

      if ([7, 17].indexOf(tee.bltCategory) > -1) {
        return "bg-grey-6";
      } else if ([9, 13].indexOf(tee.bltCategory) > -1) {
        return "bg-yellow-6";
      } else if ([10, 14].indexOf(tee.bltCategory) > -1) {
        return "bg-blue-6";
      } else if ([11, 15].indexOf(tee.bltCategory) > -1) {
        return "bg-red-6";
      } else if ([12, 16].indexOf(tee.bltCategory) > -1) {
        return "bg-orange-6";
      } else if (tee.bltCategory == 8) {
        return "bg-white";
      }

      return "bg-grey-6";
    },
    setStep: function (value) {
      if (this.step == 1 && value == -1) {
        return;
      }
      this.step += value;
    },
    getTeeName: function (id) {
      let result = null;
      this.teeArray.forEach((item) => {
        if (item.Category == id) {
          result = item.Omschrijving;
        }
      });
      return result;
    },
    getTeeAdvise: function (id) {
      let result = "";
      this.teeArray.forEach((item) => {
        if (item.Category == id) {
          result =
              this.currentUser.relHandicap <= item.HcpMin &&
              this.currentUser.relHandicap >= item.HcpMax
                  ? "advies "
                  : "";
        }
      });
      return result;
    },
    getTeeColor: function (id) {
      let result = null;
      this.teeArray.forEach((item) => {
        if (item.Category == id) {
          result = item.Achtergrond;
        }
      });
      return result;
    },
    onSaveScorecard: function () {
      this.$emit("handleSave", this.local_scorecard, true);
    },
    onCancelScorecard: function () {
      this.$emit("handleClose", true);
    },
    onChangeLus: function (loop) {
      this.local_scorecard.loop = loop.bnlLusNr;
      this.step = 4;
    },
    onChangeTee: function (tee) {
      this.local_scorecard.tee = tee.bltCategory;
      this.local_scorecard.holes = [];
      for (let i = 1; i <= this.numberOfHoles; i++) {
        let hole = {
          number: i,
          par: tee["bltPar" + i],
          strokeIndex: tee["bltSi" + i],
          stableford: 2,
          is_computed: 0,
        };
        hole.strokes = this.plHcpHole(hole);
        this.local_scorecard.holes.push(hole);
      }

      this.local_scorecard.foreign_course_details.total_par = this.par;
      this.step = 5;
    },
    setCourseFilterString: function (value) {
      this.courseFilterString = value;
    },
    getIsOdd: function (num) {
      return num % 2;
    },
    plHcpHole: function (hole) {
      if (hole.personal_par != undefined && hole.personal_par > 0) {
        return hole.personal_par;
      }

      let siPos, si, extra;

      let fixed = Math.trunc(this.plHcp / this.numberOfHoles);
      let part = this.plHcp - fixed * this.numberOfHoles;

      part = this.plHcp < 0 ? part * -1 : part;

      const array_odd = {
        1: 1,
        3: 2,
        5: 3,
        7: 4,
        9: 5,
        11: 6,
        13: 7,
        15: 8,
        17: 9,
      };

      const array_eve = {
        2: 1,
        4: 2,
        6: 3,
        8: 4,
        10: 5,
        12: 6,
        14: 7,
        16: 8,
        18: 9,
      };

      const neg_array_odd = {
        17: 1,
        15: 2,
        13: 3,
        11: 4,
        9: 5,
        7: 6,
        5: 7,
        3: 8,
        1: 9,
      };

      const neg_array_eve = {
        18: 1,
        16: 2,
        14: 3,
        12: 4,
        10: 5,
        8: 6,
        6: 7,
        4: 8,
        2: 9,
      };

      let array;
      if (this.getIsOdd(hole.strokeIndex) && this.numberOfHoles == 9) {
        array = this.plHcp < 0 ? neg_array_odd : array_odd;
        siPos = array[hole.strokeIndex];
      } else if (!this.getIsOdd(hole.strokeIndex) && this.numberOfHoles == 9) {
        array = this.plHcp < 0 ? neg_array_eve : array_eve;
        siPos = array[hole.strokeIndex];
      } else {
        siPos = this.plHcp >= 0 ? hole.strokeIndex : 18 - (hole.strokeIndex - 1);
      }

      extra = this.plHcp < 0 ? -1 : 1;
      return hole.par + fixed + (part >= siPos ? extra : 0);
    },
  },
};
</script>
