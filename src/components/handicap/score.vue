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
              <!--              <q-btn-->
              <!--                v-show="-->
              <!--                  1 === 2 &&-->
              <!--                  local_scorecard.course !== -1 &&-->
              <!--                  local_scorecard.course !== 993 &&-->
              <!--                  local_scorecard.course_country_code === 'NL'-->
              <!--                "-->
              <!--                color="primary"-->
              <!--                label="score"-->
              <!--                @click="showHole = 9"-->
              <!--              />-->
              <!--              <q-btn-->
              <!--                v-show="canDelete"-->
              <!--                color="primary"-->
              <!--                icon="save"-->
              <!--                @click="handleSave"-->
              <!--              />-->
              <q-btn
                color="primary"
                icon="close"
                label="Sluiten"
                @click="onClose"
              />
              <!--              <q-btn-->
              <!--                v-if="canDelete"-->
              <!--                color="negative"-->
              <!--                icon="delete"-->
              <!--                @click="handleDelete"-->
              <!--              />-->
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
              {{ local_scorecard.is_qualifying ? "ja" : "nee" }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-show="local_scorecard.course !== -1" v-ripple>
          <q-item-section>
            <q-item-label class="font-weight-bold">Courserating</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-right"
              >{{ local_scorecard.courserate }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-show="local_scorecard.course !== -1" v-ripple>
          <q-item-section>
            <q-item-label class="font-weight-bold">Sloperating</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-right"
              >{{ local_scorecard.sloperate }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-show="local_scorecard.course !== -1" v-ripple>
          <q-item-section>
            <q-item-label class="font-weight-bold">Par</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-right"
              >{{ local_scorecard.total_par }}
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

      <q-list
        v-show="
          local_scorecard.course !== -1 &&
          local_scorecard.course !== 993 &&
          local_scorecard.course_country_code === 'NL'
        "
        bordered
        separator
      >
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
          v-for="(hole, index) in local_scorecard.holes"
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
                  {{ local_scorecard.holes[index].strokes }}
                </q-item-label>
              </div>

              <div
                v-show="!canEdit"
                class="text-center col-12"
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
            {{ local_scorecard.total_stableford }}
          </q-item-section>
        </q-item>
      </q-list>

      <div class="row q-pa-md">
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
      <div class="row q-gutter-sm q-pb-lg">
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
      <div class="row q-gutter-sm q-pb-md">
        <div class="col">
          <q-btn
            v-show="canDelete"
            class="full-width"
            color="danger"
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
      :currentUser="currentUser"
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
    currentUser: Object,
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
    };
  },
  mounted() {
    if (this.scorecard.number_of_holes_played > 0) {
      this.showHole = 0;
    }
  },
  computed: {
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
      let max = parseInt(this.settings.handicap_maximum_days_of_score) * -1;
      return (
        this.local_scorecard.ngf_card_id.length > 0 &&
        this.$dayjs(this.local_scorecard.datetime).isAfter(
          this.$dayjs().add(max, "day")
        )
      );
    },
    canEdit: function () {
      let max = parseInt(this.settings.handicap_maximum_days_of_score) * -1;
      return this.$dayjs(this.local_scorecard.datetime).isAfter(
        this.$dayjs().add(max, "day")
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
    handleDelete: function () {
      if (!this.canDelete) {
        return;
      }
      this.$http
        .delete("golfer/scorecard", {
          data: { id: this.local_scorecard.ngf_card_id },
        })
        .then((res) => {
          this.$emit("handleClose", true);
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
