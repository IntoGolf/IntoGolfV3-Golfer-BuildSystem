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
            placeholder="'NL00000000'"
            mask="AA########"
            :rules="validGsn"
        />

        <q-input
            v-show="step == 1"
            type="text"
            v-model="local_scorecard.remarks"
            label="Opmerking"
            hint="Heeft u een opmerking voer deze hier in"
        />

        <q-select
            v-show="step == 1"
            v-model="local_scorecard.is_qualifying"
            map-options
            emit-value
            :options="[{value:0,label:'Nee'},{value:1,label:'Ja'}]"
            label="Qualifying"
            hint="Wilt u deze kaart als qualifying registreren"/>

        <q-select
            v-show="step == 1"
            v-model="local_scorecard.is_competition"
            :options="[{value:0,label:'Nee'},{value:1,label:'Ja'}]"
            map-options
            emit-value
            label="Wedstrijdkaart"
            hint="Wilt u deze kaart als wedstrijdkaart registreren"/>

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
              v-for="(loop, index) in course.courses"
              v-bind:key="index"
              @click="onChangeLus(loop)"
          >
            <q-item-section>
              <q-item-label class="itg-text-overflow">{{
                  loop.name
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
                    :style="{backgroundColor:tee.backgroundColor}"/>
                {{ tee.name }}
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
            {{ course.name }}
          </div>
        </div>

        <div class="row">
          <div class="col" style="font-weight: bold">Lus</div>
          <div class="col text-right itg-text-overflow">
            {{ loop.name }}
          </div>
        </div>

        <div class="row">
          <div class="col" style="font-weight: bold">Tee</div>
          <div class="col text-right itg-text-overflow">
            {{ tee.name }}
          </div>
        </div>

        <div class="row">
          <div class="col" style="font-weight: bold">Courserating</div>
          <div class="col text-right itg-text-overflow">
            {{ tee.courseRating }}
          </div>
        </div>

        <div class="row">
          <div class="col" style="font-weight: bold">Sloperating</div>
          <div class="col text-right itg-text-overflow">
            {{ tee.slopeRating }}
          </div>
        </div>

        <div class="row">
          <div class="col" style="font-weight: bold">Par</div>
          <div class="col text-right itg-text-overflow">
            {{ tee.totalPar }}
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
      this.loop.tees.forEach(function (item) {
        if ((that.currentUser.relGender == 1 && item.gender) == 'M' ||
            (that.currentUser.relGender != 1 && item.gender == 'F')) {
            result.push(item);
        }
      });
      return result;
    },
    courseFilteredArray: function () {
      let array = this.courseArray;
      if (this.courseFilterString != '') {
        array = this.courseArray.filter(course => course.name.toLowerCase().indexOf(this.courseFilterString) > -1);
      }
      return array.map(course => ({label: course.name, value: course.ngfNumber}));
    },
    course: function () {
      return this.courseArray.find(course => course.ngfNumber == this.local_scorecard.course);
    },
    loop: function () {
      return this.course.courses.find(course => course.number == this.local_scorecard.loop);
    },
    tee: function () {
      return this.loop.tees.find(item => item.color == this.local_scorecard.tee);
    },
    plHcp() {
      let hcp = this.handicap == 55 ? 54 : this.handicap;
      if (this.loop.courseType == 18) {
        return Math.round(hcp * (this.tee.slopeRating / 113) + (this.tee.courseRating - this.tee.totalPar),0);
      }
      return Math.round((hcp / 2) * (this.tee.slopeRating / 113) + (this.tee.courseRating - this.tee.totalPar),0);
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
            this.local_scorecard.totalPar > 0 &&
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

      if ([6, 16].indexOf(tee.color) > -1) {
        return "bg-grey-6";
      } else if ([8, 12].indexOf(tee.color) > -1) {
        return "bg-yellow-6";
      } else if ([9, 13].indexOf(tee.color) > -1) {
        return "bg-blue-6";
      } else if ([10, 14].indexOf(tee.color) > -1) {
        return "bg-red-6";
      } else if ([11, 15].indexOf(tee.color) > -1) {
        return "bg-orange-6";
      } else if (tee.color == 7) {
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
        if (item.color == id) {
          result = item.name;
        }
      });
      return result;
    },
    getTeeAdvise: function (id) {
      let result = "";
      this.teeArray.forEach((item) => {
        if (item.color == id) {
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
      return this.tee.backgroundColor;
    },
    onSaveScorecard: function () {
      this.$emit("handleSave", this.local_scorecard, true);
    },
    onCancelScorecard: function () {
      this.$emit("handleClose", true);
    },
    onChangeLus: function (loop) {
      this.local_scorecard.loop = loop.number;
      this.step = 4;
    },
    onChangeTee: function (tee) {
      this.local_scorecard.tee = tee.color;
      this.local_scorecard.holes = [];

      for (let i = 1; i <= this.loop.courseType; i++) {
        let hole = {
          number: i,
          par: tee["parHole" + i],
          strokeIndex: tee["strokeIndexHole" + i],
          stableford: 0,
          is_computed: 0,
          strokes:0
        };
        //hole.strokes = this.plHcpHole(hole);
        this.local_scorecard.holes.push(hole);
      }
      console.log(this.local_scorecard);
      this.local_scorecard.foreign_course_details.total_par = this.tee.totalPar;
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

      let fixed = Math.trunc(this.plHcp / this.loop.courseType);
      let part = this.plHcp - fixed * this.loop.courseType;

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
      if (this.getIsOdd(hole.strokeIndex) && this.loop.courseType == 9) {
        array = this.plHcp < 0 ? neg_array_odd : array_odd;
        siPos = array[hole.strokeIndex];
      } else if (!this.getIsOdd(hole.strokeIndex) && this.loop.courseType == 9) {
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
