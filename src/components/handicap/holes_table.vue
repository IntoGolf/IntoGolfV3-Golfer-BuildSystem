<template>
  <div>
    <q-item-section class="text-h6 text-center q-pt-md q-pb-md">
      Score
    </q-item-section>

    <div class="row q-gutter-sm q-pa-md">
      <div class="col">
        <q-btn
          class="full-width"
          color="primary"
          label="Details"
          @click="handleSwitchHoles"
        />
      </div>
      <div class="col">
        <q-btn
          class="full-width"
          color="primary"
          label="Terug"
          @click="handleCloseHoles"
        />
      </div>
    </div>

    <q-list bordered separator>
      <q-item class="itg-q-item">
        <q-item-section class="col-2 text-bold"> Hole</q-item-section>

        <q-item-section class="col-2 text-bold"> Par</q-item-section>

        <q-item-section class="col-5 text-center text-bold">
          Slagen
        </q-item-section>

        <q-item-section class="col-3 text-bold text-center">
          Stb
        </q-item-section>
      </q-item>

      <q-item
        v-for="(hole, index) in scorecard.holes"
        v-show="hole.par > 0"
        :key="index"
        class="itg-q-item"
      >
        <q-item-section class="col-2 text-bold">
          {{ hole.number }}
        </q-item-section>

        <q-item-section class="col-2">
          {{ plHcpHole(hole) }}
        </q-item-section>

        <q-item-section class="col-5">
          <div class="row">
            <div
              v-show="canEdit"
              class="col-4"
              style="padding: 0px; text-align: left"
            >
              <q-btn
                color="primary"
                label="-"
                outline
                round
                @click="onScoreChangeHandler(hole, -1)"
              />
            </div>

            <div
              v-show="canEdit"
              class="text-center col-4"
              style="padding-top: 10px; font-weight: bold"
            >
              <q-item-label>
                {{ scorecard.holes[index].strokes }}
              </q-item-label>
            </div>

            <div
              v-show="!canEdit"
              class="text-center col-12"
              style="padding-top: 10px; font-weight: bold"
            >
              <q-item-label>
                {{ scorecard.holes[index].strokes }}
              </q-item-label>
            </div>

            <div
              v-show="canEdit"
              class="col-4"
              style="
                padding: 0px;
                text-align: right;
                font-size: 18px;
                font-weight: bold;
              "
            >
              <q-btn
                color="primary"
                label="+"
                outline
                round
                @click="onScoreChangeHandler(hole, 1)"
              />
            </div>
          </div>
        </q-item-section>

        <q-item-section class="col-3 text-center">
          {{ hole.stableford }}
        </q-item-section>
      </q-item>

      <q-item class="itg-q-item">
        <q-item-section class="col-9">
          <q-item-label>Totaal punten</q-item-label>
        </q-item-section>

        <q-item-section class="col-3 text-center" style="font-size: 24px">
          {{ scorecard.total_stableford }}
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<style lang="scss" scoped>
.itg-text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.itg-q-item {
  background-color: white;
}
</style>

<script>
import authMixin from "../../mixins/auth";

export default {
  mixins: [authMixin],
  props: {
    scorecardData: Object,
    teeArray: Array,
    courseArray: Array,
  },
  data() {
    return {
      showHole: 1,
      scorecard: this.scorecardData,
    };
  },
  created() {
    let that = this;

    if (this.scorecard.ngf_card_id.length > 0) {
      this.scorecard.holes.forEach(function (hole) {
        if (hole.strokes === 0) {
          hole.strokes = that.plHcpHole(hole);
          that.onScoreChangeHandler(hole, 0);
        }
      });
    }
  },
  computed: {
    canEdit: function () {
      let max = parseInt(this.settings.handicap_maximum_days_of_score) * -1;
      return this.$dayjs(this.scorecard.datetime).isAfter(
        this.$dayjs().add(max, "day")
      );
    },
    plHcp() {
      let result = 0;
      let hcp = this.scorecard.handicap === 55 ? 54 : this.scorecard.handicap;

      if (this.number_of_holes_played === 18) {
        result = Math.round(
          hcp * (this.scorecard.sloperate / 113) +
            (this.scorecard.courserate - this.scorecard.total_par),
          0
        );
      } else {
        result = Math.round(
          (hcp / 2) * (this.scorecard.sloperate / 113) +
            (this.scorecard.courserate - this.scorecard.total_par),
          0
        );
      }
      return result;
    },
    numberOfHoles() {
      return this.scorecard.holes[9] !== undefined &&
        this.scorecard.holes[9].bltSi10 > 0
        ? 18
        : 9;
    },
  },
  methods: {
    nextHole: function () {
      let maxHoles =
        this.scorecard.holes[9] !== undefined && this.scorecard.holes[9].par > 0
          ? 18
          : 9;
      this.showHole = this.showHole === maxHoles ? 1 : this.showHole + 1;
    },
    prevHole: function () {
      let maxHoles =
        this.scorecard.holes[9] !== undefined && this.scorecard.holes[9].par > 0
          ? 18
          : 9;
      this.showHole = this.showHole === 1 ? maxHoles : this.showHole - 1;
    },
    getIsOdd: function (num) {
      return num % 2;
    },
    plHcpHole: function (hole) {
      if (hole.personal_par !== undefined && hole.personal_par > 0) {
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

      siPos = 0;

      si = hole.strokeindex;

      let array;

      if (this.getIsOdd(si) && this.numberOfHoles === 9) {
        array = this.plHcp < 0 ? neg_array_odd : array_odd;
        siPos = array[si];
      } else if (!this.getIsOdd(si) && this.numberOfHoles === 9) {
        array = this.plHcp < 0 ? neg_array_eve : array_eve;
        siPos = array[si];
      } else {
        siPos = this.plHcp >= 0 ? si : 18 - (si - 1);
      }

      extra = this.plHcp < 0 ? -1 : 1;

      hole.personal_par = hole.par + fixed + (part >= siPos ? extra : 0);
      return hole.personal_par;
    },
    onScoreChangeHandler: function (hole, value) {
      hole.strokes += value;
      hole.strokes = hole.strokes === 0 ? 1 : hole.strokes;

      hole.stableford = hole.personal_par + 2 - hole.strokes;
      hole.stableford = hole.stableford < 0 ? 0 : hole.stableford;

      let that = this;
      this.scorecard.total_stableford = 0;
      this.scorecard.holes.forEach(function (hole) {
        that.scorecard.total_stableford += hole.stableford;
      });
    },
    handleCloseHoles: function () {
      this.$emit("handleCloseHoles");
    },
    handleSwitchHoles: function () {
      this.$emit("handleSwitchHoles");
    },
  },
};
</script>
