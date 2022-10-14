<template>

  <div
      v-for="hole in scorecard.holes"
      :key="'Hole_' + hole.number"
      v-show="hole.number == showHole">

    <q-list bordered separator>

      <q-item class="itg-q-item">
        <q-item-section class="text-h6 text-center">
          Hole {{ hole.number }}

          <q-btn
              class="full-width q-mt-md q-mb-md"
              color="secondary"
              label="Holes"
              @click="handleSwitchHoles"
          />

        </q-item-section>
      </q-item>

      <q-item class="itg-q-item">
        <q-item-section>
          <q-item-label class="font-weight-bold">Lengte</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-right">{{ hole.distance }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="itg-q-item">
        <q-item-section>
          <q-item-label class="font-weight-bold">Par</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-right">{{ hole.par }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="itg-q-item">
        <q-item-section>
          <q-item-label class="font-weight-bold"
          >Persoonlijke par
          </q-item-label
          >
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-right"
          >{{ plHcpHole(hole) }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="itg-q-item">
        <q-item-section>
          <q-item-label class="font-weight-bold">StrokeIndex</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-right"
          >{{ hole.strokeindex }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="itg-q-item">
        <q-item-section>
          <q-item-label class="font-weight-bold">Slagen</q-item-label>
        </q-item-section>

        <q-item-section>
          <div class="row">
            <div
                class="col"
                style="padding: 0px; text-align: left"
                v-show="scorecard.ngf_card_id.length == 0"
            >
              <q-btn
                  round
                  outline
                  color="secondary"
                  label="-"
                  @click="onScoreChangeHandler(hole, -1)"
              />
            </div>

            <div
                class="col text-center"
                style="padding-top: 10px; font-weight: bold"
                v-show="scorecard.ngf_card_id.length == 0"
            >
              <q-item-label>{{ hole.strokes }}</q-item-label>
            </div>

            <div
                class="col text-right"
                style="padding-top: 10px; font-weight: bold"
                v-show="scorecard.ngf_card_id.length > 0"
            >
              <q-item-label>{{ hole.strokes }}</q-item-label>
            </div>

            <div
                class="col"
                style="
                  padding: 0px;
                  text-align: right;
                  font-size: 18px;
                  font-weight: bold;
                "
                v-show="scorecard.ngf_card_id.length == 0"
            >
              <q-btn
                  round
                  outline
                  color="secondary"
                  label="+"
                  @click="onScoreChangeHandler(hole, 1)"
              />
            </div>
          </div>

          <q-item-label
              class="text-right"
              v-show="scorecard.ngf_card_id.length > 0 && 1 == 2"
          >
            {{ hole.strokes }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="itg-q-item">
        <q-item-section>
          <q-item-label class="font-weight-bold">Hole punten</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-right"
          >{{ hole.stableford }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="itg-q-item">
        <q-item-section>
          <q-item-label class="font-weight-bold">Totaal punten</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-right"
          >{{ scorecard.total_stableford }}
          </q-item-label>
        </q-item-section>
      </q-item>

    </q-list>

    <q-btn-group class="mt-3" spread>

      <q-btn color="secondary" @click="prevHole" icon="chevron_left"/>

      <q-btn color="secondary" @click="handleCloseHoles" icon="close"/>

      <q-btn color="secondary" @click="nextHole" icon="chevron_right"/>

    </q-btn-group>

  </div>

</template>

<style lang="scss" scoped>
q-item-label {
  font-weight: bold;
}
</style>

<script>
export default {
  props: {
    currentUser: Object,
    scorecardData: Object,
    teeArray: Array,
    courseArray: Array,
  },
  data() {
    return {
      showHole: 1,
      hole: {
        strokes: 0,
      },
      scorecard: this.scorecardData,
    };
  },
  created() {
    let that = this;
    if (this.scorecard.ngf_card_id.length == 0) {
      this.scorecard.holes.forEach((hole) => {
        if (hole.strokes == 0) {
          this.hole.strokes = that.plHcpHole(hole);
          that.onScoreChangeHandler(hole, 0);
        }
      });
    }
  },
  computed: {
    plHcp() {
      let result = 0;
      let hcp = this.scorecard.handicap == 55 ? 54 : this.scorecard.handicap;

      if (this.numberOfHoles == 18) {
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
      return this.scorecard.holes[9] != undefined &&
      this.scorecard.holes[9].bltSi10 > 0
          ? 18
          : 9;
    },
  },
  methods: {
    nextHole: function () {
      let maxHoles =
          this.scorecard.holes[9] != undefined && this.scorecard.holes[9].par > 0
              ? 18
              : 9;
      this.showHole = this.showHole == maxHoles ? 1 : this.showHole + 1;
    },

    prevHole: function () {
      let maxHoles =
          this.scorecard.holes[9] != undefined && this.scorecard.holes[9].par > 0
              ? 18
              : 9;
      this.showHole = this.showHole == 1 ? maxHoles : this.showHole - 1;
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

      siPos = 0;

      si = hole.strokeindex;

      let array;

      if (this.getIsOdd(si) && this.numberOfHoles == 9) {
        array = this.plHcp < 0 ? neg_array_odd : array_odd;
        siPos = array[si];
      } else if (!this.getIsOdd(si) && this.numberOfHoles == 9) {
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
      hole.strokes = hole.strokes == 0 ? 1 : hole.strokes;
      const result = hole.strokes;
      this.hole.strokes = result;
      hole.stableford = hole.personal_par + 2 - result;
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
