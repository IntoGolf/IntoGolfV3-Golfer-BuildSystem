<template>
  <q-page>
    <div class="row">
      <div class="col">
        Datum:
        <q-btn-group class="full-width" unelevated>
          <q-btn
            color="secondary"
            icon="chevron_left"
            style="width: 50px"
            v-on:click="navDay(-1)"
          />
          <q-btn
            class="full-width"
            color="secondary"
            style="width: calc(100% - 100px)"
          >
            {{ $dayjs(form.fltDate).format("dddd DD MMMM") }}

            <q-popup-proxy
              ref="qDateTeeTime"
              transition-hide="scale"
              transition-show="scale"
            >
              <q-date
                v-model="date"
                :options="optionsFn"
                mask="YYYY-MM-DD"
                today-btn
                @change="loadTeetimes"
              >
                <div class="row items-center justify-end" flat>
                  <q-btn v-close-popup color="primary" flat label="Sluiten" />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-btn>
          <q-btn
            color="secondary"
            icon="chevron_right"
            style="width: 50px"
            v-on:click="navDay(1)"
          />
        </q-btn-group>
      </div>
    </div>

    <div class="row q-mt-md">
      <div class="col-5 q-pr-sm">
        Holes:
        <q-btn-group class="full-width" spread unelevated>
          <q-btn
            v-for="(item, index) of filterForm.holes"
            :key="index"
            :color="form.holes === item ? 'secondary' : 'white'"
            :label="item"
            :text-color="form.holes === item ? '' : 'black'"
            @click="handleFilterHole(item)"
          />
        </q-btn-group>
      </div>

      <div class="col-7">
        Spelers:
        <q-btn-group class="full-width" spread unelevated>
          <q-btn
            v-for="(item, index) of filterForm.players"
            :key="index"
            :color="form.fltSize === item ? 'secondary' : 'white'"
            :label="item"
            :text-color="form.fltSize === item ? '' : 'black'"
            @click="handleFilterPlayers(item)"
          />
        </q-btn-group>
      </div>
    </div>

    <div v-if="teetimes.length > 0" class="row">
      <div
        v-for="(course, cKey) of teetimes"
        :key="cKey"
        class="q-mt-md col items-start"
      >
        <div
          class="row text-center text-white bg-secondary"
          style="height: 40px; border-bottom: black"
        >
          <div
            class="col"
            style="
              font-size: 18px;
              margin-top: 5px;
              font-weight: bold;
              border-bottom: black;
            "
          >
            {{ course.crlName }}
          </div>
        </div>
      </div>
    </div>

    <q-separator />

    <div class="row q-gutter-xs" style="max-height: 600px; overflow: scroll">
      <div
        v-for="(course, cKey) of teetimes"
        :key="cKey"
        class="col text-grey-8 text-bold"
      >
        <div
          v-for="(time, tKey) of timeFilter(course.times)"
          :key="tKey"
          class="row text-center q-pt-xs"
          @click="handleOpenDialog(time, course)"
        >
          <div
            :class="time.sttRefNr > 0 ? 'bg-blue-3' : 'bg-green-3'"
            class="col q-pa-sm"
          >
            {{ $filters.minuteToTime(time.sttTimeFrom) }}
            <q-icon
              v-show="time.sttRefNr > 0"
              class="q-ml-sm q-mb-xs q-mr-xs"
              name="group"
              size="18px"
            >
              {{ time.sttMPlayers }}
            </q-icon>
          </div>
        </div>
      </div>
    </div>

    <!--    <div v-else class="row">-->
    <!--      <div class="col">-->
    <!--        <p class="text-center">Geen starttijden beschikbaar~</p>-->
    <!--      </div>-->
    <!--    </div>-->

    <q-dialog v-if="dialogVisible" v-model="dialogVisible">
      <q-card style="max-width: 320px; width: 95%">
        <q-card-section class="text-h6">
          <div v-if="dialogErrors.length === 0">Uw reservering</div>
          <div v-if="dialogErrors.length > 0">Probleem gevonden!</div>
        </q-card-section>

        <q-separator inset />

        <q-card-section v-if="dialogErrors.length === 0">
          <div class="row">
            <div class="col text-left text-bold">Datum</div>
            <div class="col text-right">
              {{ $dayjs(form.fltDate).format("dddd DD MMMM") }}
            </div>
          </div>

          <div class="row q-mt-xs">
            <div class="col text-left text-bold">Tijd</div>
            <div class="col text-right">
              {{ $filters.minuteToTime(selectedTimeItem.sttTimeFrom) }}
            </div>
          </div>

          <div class="row q-mt-xs">
            <div class="col text-left text-bold">Spelers</div>
            <div class="col text-right">{{ form.fltSize }}</div>
          </div>

          <!--          <div class="row q-mt-xs">-->
          <!--            <div class="col text-left text-bold">Holes</div>-->
          <!--            <div class="col text-right">{{ form.holes }}</div>-->
          <!--          </div>-->

          <div class="row q-mt-xs">
            <div class="col text-left text-bold">Baan</div>
            <div class="col text-right">{{ selectedCourseItem.crlName }}</div>
          </div>
        </q-card-section>

        <q-card-section v-if="dialogErrors.length > 0">
          <div v-for="(error, index) in dialogErrors" :key="index" class="row">
            <div class="col text-left">{{ error }}</div>
          </div>
        </q-card-section>

        <q-separator inset />

        <q-card-actions align="right">
          <q-btn
            color="secondary"
            flat
            size="mds"
            v-on:click="handleDialogClose"
          >
            Annuleer
          </q-btn>

          <q-btn
            v-if="dialogErrors.length === 0"
            color="secondary"
            size="md"
            v-on:click="handleReservation"
          >
            Reserveer
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import authMixin from "../../mixins/auth";

export default {
  mixins: [authMixin],
  data: function () {
    return {
      loading: false,
      flight: null,
      teetimes: [],
      dialogVisible: false,
      dialogErrors: [],
      selectedTimeItem: null,
      filterForm: {
        holes: [9, 18],
        players: [1, 2, 3, 4],
      },
      form: {
        fltDate: this.$dayjs().format("YYYY-MM-DD"),
        fltTime: "",
        fltCrlNr1: "",
        fltCrlNr2: "",
        fltSize: 0,
        players: [],
        holes: 9,
        size: 3,
      },
      date: this.$dayjs().format("YYYY-MM-DD"),
    };
  },
  created: function () {
    this.loadTeetimes();
  },
  mounted() {
    this.form.fltSize = this.settings.planner_default_reservation_count;
    this.form.holes = this.settings.planner_default_holes;
  },
  watch: {
    date: function (newValue, oldValue) {
      this.form.fltDate = newValue;
      this.loadTeetimes();
      this.$refs.qDateTeeTime.hide();
    },
  },
  methods: {
    timeFilter: function (array) {
      return array.filter(
        (time) =>
          time.sttPlayers >= this.form.fltSize &&
          (this.form.holes === 9 ||
            (time.sttAvailable18 && this.form.holes === 18)) &&
          (this.form.holes === 9 ||
            (time.sttCrlNrNext > 0 && this.form.holes === 18))
      );
    },

    optionsFn(date) {
      return (
        this.$dayjs(date) >= this.$dayjs().add(-1, "day") &&
        this.$dayjs(date) <= this.$dayjs().add(21, "day")
      );
    },

    navDay: function (value) {
      this.date = this.$dayjs(this.date).add(value, "day").format("YYYY-MM-DD");
    },

    loadTeetimes: function () {
      this.loading = true;
      this.$http
        .get("golfer/teetimes", {
          params: {
            date: this.$dayjs(this.form.fltDate).format("YYYY-MM-DD"),
            relNr: this.currentUser.relNr,
          },
        })
        .then((res) => {
          this.teetimes = res.payload;
          this.loading = false;
        });
    },

    handleOpenDialog: function (timeItem, courseItem) {
      this.selectedTimeItem = timeItem;
      this.selectedCourseItem = Object.assign({}, courseItem);
      delete this.selectedCourseItem.times;
      this.dialogVisible = true;
    },

    handleReservation: function () {
      let flight_players = [];

      for (let i = 1; i <= this.form.fltSize; i++) {
        flight_players.push({
          flpNr: null,
          flpSide: i,
          flpRelNr: null,
          flpName: "",
          flpEmail: "",
          flpHandicap: "",
          flpCarNr: null,
        });
      }

      flight_players[0].flpRelNr = this.currentUser.relNr;
      flight_players[0].flpName = this.currentUser.full_name2;

      const info = {
        fltNr: this.selectedTimeItem.sttRefNr,
        fltTime1: this.selectedTimeItem.sttTimeFrom,
        fltDate: this.$filters.dateToUnix(this.form.fltDate, "YYYY-MM-DD"),
        fltSize: this.form.fltSize,
        fltCrlNr1: this.selectedCourseItem.crlNr,
        fltCrlNr2:
          this.form.holes === 18 ? this.selectedTimeItem.sttCrlNrNext : null,
        fltOrigin: 2,
        flight_players: flight_players,
      };

      let that = this;
      this.$http
        .post(`golfer/booking`, info)
        .then((res) => {
          that.flight = res.flight;
          this.$emit("handleOpenFlight", that.flight);
        })
        .catch((error) => {
          that.dialogErrors = error;
        });
    },

    handleDialogClose: function () {
      this.dialogErrors = [];
      this.dialogVisible = false;
    },

    handleFilterHole: function (n) {
      this.form.holes = n;
    },

    handleFilterPlayers: function (n) {
      this.form.fltSize = n;
    },
  },
};
</script>
