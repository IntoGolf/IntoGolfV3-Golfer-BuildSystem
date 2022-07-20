<template>
  <q-page>

    <main v-if="showHole == 0">

      <q-card>
        <q-card-section>
          <q-list bordered separator>

            <q-item class="itg-q-item">
              <q-item-section class="text-h6 text-center q-pt-md q-pb-md">
                {{ title }}

                <q-btn-group unelevated spread>
                  <q-btn
                      v-show="scorecard.ngf_card_id.length == 0"
                      outline
                      color="secondary"
                      label="opslaan"
                      @click="handleSave"
                  />
                  <q-btn
                      outline
                      color="secondary"
                      label="sluiten"
                      @click="onClose"
                  />
                  <q-btn
                      v-show="scorecard.course != -1 && scorecard.course != 993 && scorecard.course_country_code == 'NL'"
                      outline
                      color="secondary"
                      label="score"
                      @click="showHole = 9"/>
                </q-btn-group>


              </q-item-section>
            </q-item>

            <q-item v-ripple>
              <q-item-section>
                <q-item-label class="font-weight-bold">Datum</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-right"
                >{{ $dayjs(scorecard.date).format("dddd D MMM") }}
                  {{ $dayjs(str).format('H:m') }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-show="scorecard.course == 993" v-ripple>
              <q-item-section>
                <q-item-label class="font-weight-bold">Land</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-right"
                >{{ scorecard.course_country_code }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-ripple>
              <q-item-section>
                <q-item-label class="font-weight-bold">Baan</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-right">{{
                    scorecard.course_name
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-show="scorecard.course != -1" v-ripple>
              <q-item-section>
                <q-item-label class="font-weight-bold">Lus</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-right">{{
                    scorecard.loop_name
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-show="scorecard.course != -1" v-ripple>
              <q-item-section>
                <q-item-label class="font-weight-bold">Tee</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-right">{{
                    scorecard.tee_name
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-ripple>
              <q-item-section>
                <q-item-label class="font-weight-bold">Qualifying</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-right">
                  <i
                      v-if="scorecard.is_qualifying"
                      class="el-icon-check el-color"
                      style="color: #67c23a"
                  ></i>
                  <i
                      v-if="!scorecard.is_qualifying"
                      class="el-icon-close el-color"
                      style="color: #f56c6c"
                  ></i>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-show="scorecard.course != -1" v-ripple>
              <q-item-section>
                <q-item-label class="font-weight-bold">Courserating</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-right">{{
                    scorecard.courserate
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-show="scorecard.course != -1" v-ripple>
              <q-item-section>
                <q-item-label class="font-weight-bold">Sloperating</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-right">{{
                    scorecard.sloperate
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-show="scorecard.course != -1" v-ripple>
              <q-item-section>
                <q-item-label class="font-weight-bold">Par</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-right">{{
                    scorecard.total_par
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-show="scorecard.course != -1" v-ripple>
              <q-item-section>
                <q-item-label class="font-weight-bold">Punten</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-right"
                >{{ scorecard.total_stableford }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-ripple>
              <q-item-section>
                <q-item-label class="font-weight-bold">Dag resultaat</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-right"
                >{{ scorecard.score_differential }}
                </q-item-label>
              </q-item-section>
            </q-item>

          </q-list>
        </q-card-section>
      </q-card>

    </main>

    <scorecard-holes
        v-else-if="showHole == 1"
        :scorecardData="scorecard"
        :page="page"
        v-on:handleCloseHoles="handleCloseHoles"
        v-on:handleSwitchHoles="handleSwitchHoles"
    />

    <scorecard-holes-table
        v-else-if="showHole == 9"
        :scorecardData="scorecard"
        :page="page"
        v-on:handleCloseHoles="handleCloseHoles"
        v-on:handleSwitchHoles="handleSwitchHoles"
    />

    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Uw scorekaart is nog niet opgeslagen</span>
        </q-card-section>

        <q-card-actions class="row">
          <q-btn
              label="Pauzeren"
              color="secondary"
              style="margin-left: auto; margin-right: auto"
              @click="handlePauzeScorecard"
          />
        </q-card-actions>

        <q-card-actions class="row items-center">
          <q-btn
              label="Verwijderen"
              color="secondary"
              style="margin-left: auto; margin-right: auto"
              @click="handleCloseScorecard"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>

</template>

<script>
import ScorecardHoles from "./holes";
import ScorecardHolesTable from "./holes_table";

export default {
  props: ["page", "scorecard"],
  components: {
    ScorecardHoles,
    ScorecardHolesTable,
  },
  data() {
    return {
      showHole: 0,
      confirm: false,
    };
  },
  created: function () {
  },
  computed: {
    title: function () {
      if (this.scorecard.course == -1) {
        return "Aanpassing";
      } else if (this.scorecard.course == 993) {
        return "Buitenland kaart";
      } else {
        return "Binnenland kaart";
      }
    },
  },
  methods: {
    handleNewScorecard: function (value) {
      this.$emit("handleNewScorecard", value);
    },

    onClose: function () {
      if (this.scorecard.ngf_card_id.length == 0) {
        this.confirm = true;
      } else {
        this.confirm = false;
        this.$emit("handleCloseScorecard", false);
      }
    },

    handleCloseScorecard: function () {
      this.$ls.removeItem('scorecard');
      this.confirm = false;
      this.$emit("handleCloseScorecard", false);
    },

    handleCloseHoles: function () {
      this.showHole = 0;
    },

    handlePauzeScorecard: function () {
      this.$ls.setItem('scorecard', this.scorecard, 1000 * 60 * 60 * 24 * 7);
      this.confirm = false;
      this.$emit("handleCloseScorecard", false);
    },

    handleSave: function () {
      this.$http.post("golfer/handicap", this.scorecard).then((res) => {
        this.$ls.removeItem('scorecard');
        this.$emit("handleCloseScorecard", true);
      });
    },

    handleSwitchHoles: function () {
      this.showHole = this.showHole == 9 ? 1 : 9;
    },
  },
};
</script>
