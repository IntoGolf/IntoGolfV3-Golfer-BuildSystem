<template>
  <q-card>
    <main v-if="showHole === 0">
      <q-list bordered separator>
        <q-item class="itg-q-item">
          <q-item-section class="text-h6 text-center q-pt-md q-pb-md">
            {{ title }}

            <q-btn-group
              class="q-mt-md q-gutter-sm"
              size="small"
              spread
              unelevated
            >
              <q-btn
                color="primary"
                icon="close"
                label="Sluiten"
                @click="onClose"
              />
            </q-btn-group>
          </q-item-section>
        </q-item>

        <q-item v-ripple>
          <q-item-section>
            <q-item-label class="font-weight-bold">Datum</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-right"
              >{{
                $dayjs(local_scorecard.datetime).format("ddd D MMM YYYY HH:mm")
              }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-show="local_scorecard.course === 993" v-ripple>
          <q-item-section>
            <q-item-label class="font-weight-bold">Land</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-right"
              >{{ local_scorecard.course_country_code }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-ripple>
          <q-item-section>
            <q-item-label class="font-weight-bold">Baan</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-right"
              >{{ local_scorecard.course_name }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-show="local_scorecard.course !== -1" v-ripple>
          <q-item-section>
            <q-item-label class="font-weight-bold">Lus</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-right"
              >{{ local_scorecard.loop_name }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-show="local_scorecard.course !== -1" v-ripple>
          <q-item-section>
            <q-item-label class="font-weight-bold">Tee</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-right"
              >{{ local_scorecard.tee_name }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-ripple>
          <q-item-section>
            <q-item-label class="font-weight-bold">Qualifying</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-right">
              {{ local_scorecard.is_qualifying == 0 ? "nee" : "ja" }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-show="local_scorecard.course !== -1" v-ripple>
          <q-item-section>
            <q-item-label class="font-weight-bold">Cr, Sr, Par</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-right"
              >{{
                local_scorecard.courserate +
                " / " +
                local_scorecard.sloperate +
                " / " +
                local_scorecard.total_par
              }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-show="local_scorecard.course !== -1" v-ripple>
          <q-item-section>
            <q-item-label class="font-weight-bold">Punten</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-right"
              >{{ local_scorecard.total_stableford }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-ripple>
          <q-item-section>
            <q-item-label class="font-weight-bold">Dag resultaat</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-right"
              >{{ local_scorecard.score_differential }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <div
        v-show="
          local_scorecard.course !== -1 &&
          local_scorecard.course !== 993 &&
          local_scorecard.course_country_code === 'NL'
        "
      >
        <div
          class="row q-pa-sm q-mt-md"
          style="
            border-bottom: 2px solid lightgrey;
            border-top: 1px solid lightgrey;
          "
        >
          <div class="col-2 text-bold">Hole</div>

          <div class="col-2 text-bold">Par</div>

          <div class="col-5 text-center text-bold">Slagen</div>

          <div class="col-3 text-bold text-center">Stb</div>
        </div>

        <div
          v-for="(hole, index) in firstNine"
          v-show="hole.par > 0"
          :key="index"
          class="row q-pa-sm"
          style="border-bottom: 1px solid lightgrey"
        >
          <div class="col-2 text-bold score-cv">
            {{ hole.number }}
          </div>

          <div class="col-2 score-cv">
            {{ hole.par }}
          </div>

          <div class="col-5">
            <div v-if="canEdit" class="row">
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
                  {{ local_scorecard.holes[index].strokes }}
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

            <div v-else class="row">
              <div class="col-12">
                <q-item-label class="text-center text-bold">
                  {{ local_scorecard.holes[index].strokes }}
                </q-item-label>
              </div>
            </div>
          </div>

          <div class="col-3 text-center score-cv">
            {{ hole.stableford }}
          </div>
        </div>

        <div class="row q-pa-sm">
          <div class="col-9 text-bold">
            <q-item-label>Punten 1ste 9</q-item-label>
          </div>

          <div class="col-3 text-center text-bold">
            {{ pointsFirstNine }}
          </div>
        </div>

        <div
          v-if="secondNine.length > 0"
          class="row q-pa-sm q-mt-md"
          style="
            border-bottom: 2px solid lightgrey;
            border-top: 1px solid lightgrey;
          "
        >
          <div class="col-2 text-bold">Hole</div>

          <div class="col-2 text-bold">Par</div>

          <div class="col-5 text-center text-bold">Slagen</div>

          <div class="col-3 text-bold text-center">Stb</div>
        </div>

        <div
          v-for="(hole, index) in secondNine"
          v-show="hole.par > 0"
          :key="index"
          class="row q-pa-sm"
          style="border-bottom: 1px solid lightgrey"
        >
          <div class="col-2 text-bold">
            {{ hole.number }}
          </div>

          <div class="col-2">
            {{ hole.par }}
          </div>

          <div class="col-5">
            <div v-if="canEdit" class="row">
              <div class="col-4" style="padding: 0px; text-align: left">
                <q-btn
                  color="primary"
                  label="-"
                  outline
                  round
                  @click="onScoreChangeHandler(hole, -1)"
                />
              </div>

              <div
                class="text-center col-4"
                style="padding-top: 10px; font-weight: bold"
              >
                <q-item-label>
                  {{ local_scorecard.holes[index + 9].strokes }}
                </q-item-label>
              </div>

              <div
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

            <div v-else class="row">
              <div class="col-12">
                <div class="text-center text-bold">
                  {{ local_scorecard.holes[index + 9].strokes }}
                </div>
              </div>
            </div>
          </div>

          <div class="col-3 text-center">
            {{ hole.stableford }}
          </div>
        </div>

        <div v-if="secondNine.length > 0" class="row q-pa-sm">
          <div class="col-9 text-bold">Punten 2de 9</div>

          <div class="col-3 text-center text-bold">
            {{ pointsSecondNine }}
          </div>
        </div>

        <div class="row q-pa-sm q-mb-md text-h5">
          <div class="col-9 text-bold">Totaal punten</div>

          <div class="col-3 text-center text-bold">
            {{ local_scorecard.total_stableford }}
          </div>
        </div>
      </div>

      <div v-if="canEdit" class="row q-pa-md">
        <div class="col">
          <q-btn
            class="full-width"
            color="primary"
            icon="save"
            label="Opslaan"
            @click="handleSave"
          />
        </div>
      </div>
      <div class="row q-pb-lg q-pl-md q-pr-md">
        <div class="col">
          <q-btn
            class="full-width"
            color="primary"
            icon="close"
            label="Sluiten"
            @click="onClose"
          />
        </div>
      </div>
      <div v-show="canDelete" class="row q-pb-md q-pl-md q-pr-md">
        <div class="col">
          <q-btn
            class="full-width"
            color="negative"
            icon="delete"
            label="Verwijderen"
            @click="handleDelete"
          />
        </div>
      </div>
    </main>

    <scorecard-holes
      v-else-if="showHole === 1"
      :courseArray="courseArray"
      :page="page"
      :scorecardData="local_scorecard"
      :teeArray="teeArray"
      v-on:handleCloseHoles="handleCloseHoles"
      v-on:handleSave="handleSave"
      v-on:handleSwitchHoles="handleSwitchHoles"
    />

    <scorecard-holes-table
      v-else-if="showHole === 9"
      :courseArray="courseArray"
      :page="page"
      :scorecardData="local_scorecard"
      :teeArray="teeArray"
      v-on:handleCloseHoles="handleCloseHoles"
      v-on:handleSave="handleSave"
      v-on:handleSwitchHoles="handleSwitchHoles"
    />
  </q-card>
</template>

<script>
import ScorecardHoles from "./holes";
import ScorecardHolesTable from "./holes_table";
import authMixin from "../../mixins/auth";

export default {
  mixins: [authMixin],
  props: {
    page: String,
    scorecard: Object,
    teeArray: Array,
    courseArray: Array,
  },
  components: {
    ScorecardHoles,
    ScorecardHolesTable,
  },
  data() {
    return {
      local_scorecard: this.scorecard,
      showHole: 0,
      canEdit: true,
    };
  },
  mounted() {
    if (this.scorecard.number_of_holes_played > 0) {
      this.showHole = 0;
    }
  },
  created() {
    this.canEdit = this.getCanEdit();
    if (!this.canEdit) {
      return;
    }
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
    firstNine() {
      return this.local_scorecard.holes.filter((hole) => hole.number <= 9);
    },
    secondNine() {
      return this.local_scorecard.holes.filter(
        (hole) => hole.number >= 10 && hole.par > 0
      );
    },
    pointsFirstNine() {
      return this.scorecard.holes.reduce(function (result, item) {
        return result + (item.number <= 9 ? item.stableford : 0);
      }, 0);
    },
    pointsSecondNine() {
      return this.scorecard.holes.reduce(function (result, item) {
        return result + (item.number >= 10 ? item.stableford : 0);
      }, 0);
    },
    title: function () {
      if (this.local_scorecard.course === -1) {
        return "Aanpassing";
      } else if (this.local_scorecard.course === 993) {
        return "Buitenland kaart";
      } else {
        return "Binnenland kaart";
      }
    },
    canDelete: function () {
      if (this.settings.app_allow_delete_card === 0) {
        return false;
      }
      let max = parseInt(this.settings.handicap_maximum_days_of_score) * -1;
      return (
        this.local_scorecard.ngf_card_id.length > 0 &&
        this.$dayjs(this.local_scorecard.datetime).isAfter(
          this.$dayjs().add(max, "day")
        )
      );
    },
    plHcp() {
      let result = 0;
      let hcp =
        this.local_scorecard.handicap === 55
          ? 54
          : this.local_scorecard.handicap;

      if (this.number_of_holes_played === 18) {
        result = Math.round(
          hcp * (this.local_scorecard.sloperate / 113) +
            (this.local_scorecard.courserate - this.scorecard.total_par),
          0
        );
      } else {
        result = Math.round(
          (hcp / 2) * (this.scorecard.sloperate / 113) +
            (this.local_scorecard.courserate - this.local_scorecard.total_par),
          0
        );
      }
      return result;
    },
    numberOfHoles() {
      return this.local_scorecard.holes[9] !== undefined &&
        this.local_scorecard.holes[9].bltSi10 > 0
        ? 18
        : 9;
    },
  },
  methods: {
    getCanEdit() {
      let strokes = this.scorecard.holes.reduce(function (result, item) {
        return result + item.strokes;
      }, 0);

      if (this.settings.app_allow_update_card === 0 && strokes > 0) {
        return false;
      }
      let max = parseInt(this.settings.handicap_maximum_days_of_score) * -1;
      return this.$dayjs(this.local_scorecard.datetime).isAfter(
        this.$dayjs().add(max, "day")
      );
    },
    onClose: function () {
      this.$emit("handleClose", true);
    },
    handleCloseHoles: function () {
      this.showHole = 0;
    },
    handleSave: function () {
      this.$emit("handleSave", this.local_scorecard);
    },
    handleSwitchHoles: function () {
      this.showHole = this.showHole === 9 ? 1 : 9;
    },
    async handleDelete() {
      if (!this.canDelete) {
        return;
      }
      let res = await this.$http.delete("golfer/scorecard", {
        data: { id: this.local_scorecard.ngf_card_id },
      });

      res.data.error.forEach((item) => {
        this.$q.notify({
          message: item.message,
          type: "negative",
          icon: "announcement",
          position: "center",
          actions: [
            {
              label: "Sluiten",
              color: "white",
              handler: () => {
                this.$emit("handleClose", true);
              },
            },
          ],
        });
      });
    },
    nextHole: function () {
      let maxHoles =
        this.local_scorecard.holes[9] !== undefined &&
        this.local_scorecard.holes[9].par > 0
          ? 18
          : 9;
      this.showHole = this.showHole === maxHoles ? 1 : this.showHole + 1;
    },
    prevHole: function () {
      let maxHoles =
        this.local_scorecard.holes[9] !== undefined &&
        this.local_scorecard.holes[9].par > 0
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
      this.local_scorecard.total_stableford = 0;
      this.local_scorecard.holes.forEach(function (hole) {
        that.local_scorecard.total_stableford += hole.stableford;
      });
    },
  },
};
</script>

<style>
.score-cv {
  display: grid;
  align-items: center;
}
</style>
