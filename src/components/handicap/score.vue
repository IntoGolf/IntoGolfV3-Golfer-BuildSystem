<template>

  <q-card>

    <main v-if="showHole == 0">

      <q-list bordered separator>

        <q-item class="itg-q-item">

          <q-item-section class="text-h6 text-center q-pt-md q-pb-md">

            {{ title }}

            <q-btn-group class="q-mt-md q-gutter-sm" size="small" unelevated spread>
              <q-btn
                  v-show="local_scorecard.course != -1 && local_scorecard.course != 993 && local_scorecard.course_country_code == 'NL'"
                  color="secondary"
                  label="score"
                  @click="showHole = 9"
              />
              <q-btn
                  v-show="local_scorecard.ngf_card_id.length == 0 || canDelete"
                  color="secondary"
                  icon="save"
                  @click="handleSave"
              />
              <q-btn
                  color="secondary"
                  icon="close"
                  @click="onClose"
              />
              <q-btn
                  v-if="canDelete"
                  color="negative"
                  icon="delete"
                  @click="handleDelete"
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
            >{{ $dayjs(local_scorecard.date).format("dddd D MMM") }}
              {{ $dayjs(str).format('H:m') }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-show="local_scorecard.course == 993" v-ripple>
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
            <q-item-label class="text-right">{{
                local_scorecard.course_name
              }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-show="local_scorecard.course != -1" v-ripple>
          <q-item-section>
            <q-item-label class="font-weight-bold">Lus</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-right">{{
                local_scorecard.loop_name
              }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-show="local_scorecard.course != -1" v-ripple>
          <q-item-section>
            <q-item-label class="font-weight-bold">Tee</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-right">{{
                local_scorecard.tee_name
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
              {{ local_scorecard.is_qualifying ? 'ja' : 'nee' }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-show="local_scorecard.course != -1" v-ripple>
          <q-item-section>
            <q-item-label class="font-weight-bold">Courserating</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-right">{{
                local_scorecard.courserate
              }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-show="local_scorecard.course != -1" v-ripple>
          <q-item-section>
            <q-item-label class="font-weight-bold">Sloperating</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-right">{{
                local_scorecard.sloperate
              }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-show="local_scorecard.course != -1" v-ripple>
          <q-item-section>
            <q-item-label class="font-weight-bold">Par</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-right">{{
                local_scorecard.total_par
              }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-show="local_scorecard.course != -1" v-ripple>
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

    </main>

    <scorecard-holes
        v-else-if="showHole == 1"
        :scorecardData="local_scorecard"
        :page="page"
        :currentUser="currentUser"
        :courseArray="courseArray"
        :teeArray="teeArray"
        v-on:handleCloseHoles="handleCloseHoles"
        v-on:handleSwitchHoles="handleSwitchHoles"
    />

    <scorecard-holes-table
        v-else-if="showHole == 9"
        :scorecardData="local_scorecard"
        :page="page"
        :currentUser="currentUser"
        :courseArray="courseArray"
        :teeArray="teeArray"
        v-on:handleCloseHoles="handleCloseHoles"
        v-on:handleSwitchHoles="handleSwitchHoles"
    />

  </q-card>

</template>

<script>
import ScorecardHoles from "./holes";
import ScorecardHolesTable from "./holes_table";

export default {
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
      showHole: 0
    };
  },
  mounted() {
    console.log(this.local_scorecard);
  },
  computed: {
    title: function () {
      if (this.local_scorecard.course == -1) {
        return "Aanpassing";
      } else if (this.local_scorecard.course == 993) {
        return "Buitenland kaart";
      } else {
        return "Binnenland kaart";
      }
    },
    canDelete: function () {
      return this.local_scorecard.ngf_card_id.length > 0 && this.$dayjs(this.local_scorecard.datetime).isToday();
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
      this.showHole = this.showHole == 9 ? 1 : 9;
    },
    handleDelete: function () {
      if (!this.$dayjs(this.local_scorecard.datetime).isToday()) {
        return;
      }
      this.$http.delete("golfer/scorecard", {data: {id: this.local_scorecard.ngf_card_id}}).then((res) => {
        this.$emit("handleClose", true);
      });
    }
  },
};
</script>
