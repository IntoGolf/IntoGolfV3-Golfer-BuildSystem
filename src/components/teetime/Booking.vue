<template>

  <q-page class="q-pa-md">

    <div class="row">
      <div class="col">
        Datum:
        <q-btn-group unelevated class="full-width">
          <q-btn color="secondary" icon="chevron_left" style="width: 50px" v-on:click="navDay(-1)"/>
          <q-btn color="secondary" class="full-width" style="width: calc(100% - 100px)">
            {{ $dayjs(form.fltDate).format("dddd DD MMMM") }}

            <q-popup-proxy
                ref="qDateTeeTime"
                transition-show="scale"
                transition-hide="scale">

              <q-date
                  v-model="date"
                  mask="YYYY-MM-DD"
                  :options="optionsFn"
                  @change="loadTeetimes"
                  today-btn>

                <div
                    class="row items-center justify-end"
                    flat>

                  <q-btn
                      v-close-popup
                      label="Closee"
                      color="primary"
                      flat/>

                </div>

              </q-date>

            </q-popup-proxy>

          </q-btn>
          <q-btn color="secondary" icon="chevron_right" style="width: 50px" v-on:click="navDay(1)"/>
        </q-btn-group>
      </div>
    </div>

    <div class="row q-mt-md">

      <div class="col-5 q-pr-sm">
        Holes:
        <q-btn-group unelevated spread class="full-width">
          <q-btn
              v-for="(item, index) of filterForm.holes"
              :key="index"
              :label="item"
              :color="form.holes === item ? 'secondary' : 'white'"
              :text-color="form.holes === item ? '' : 'black'"
              @click="handleFilterHole(item)"
          />
        </q-btn-group>

      </div>

      <div class="col-7">
        Spelers:
        <q-btn-group unelevated spread class="full-width">
          <q-btn
              v-for="(item, index) of filterForm.players"
              :key="index"
              :label="item"
              :color="form.fltSize === item ? 'secondary' : 'white'"
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
          class="q-mt-md col items-start">

        <div
            class="row text-center text-white bg-secondary"
            style="height: 40px; border-bottom: black">

          <div
              style="font-size: 18px; margin-top: 5px; font-weight: bold; border-bottom: black"
              class="col">

            {{ course.crlName }}

          </div>

        </div>

      </div>

    </div>

    <q-separator/>

    <div class="row q-gutter-xs" style="max-height: 600px; overflow: scroll">

      <div
          v-for="(course, cKey) of teetimes"
          :key="cKey"
          class="col text-grey-8 text-bold">

        <div
            v-for="(time, tKey) of timeFilter(course.times)"
            :key="tKey"
            class="row text-center q-pt-xs"
            @click="handleOpenDialog(time, course)">

          <div class="col  q-pa-sm" :class="time.sttRefNr>0?'bg-blue-3':'bg-green-3'">

            {{ $filters.minuteToTime(time.sttTimeFrom) }} <br>
            <i v-show="time.sttRefNr>0">merged</i>

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
          <div v-if="dialogErrors.length == 0">Uw reservering</div>
          <div v-if="dialogErrors.length > 0">Probleem gevonden!</div>
        </q-card-section>

        <q-separator inset />

        <q-card-section v-if="dialogErrors.length == 0">

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
              flat
              v-on:click="handleDialogClose"
              color="secondary"
              size="mds">
            Annuleer
          </q-btn>

          <q-btn
              v-if="dialogErrors.length == 0"
              v-on:click="handleReservation"
              color="secondary"
              size="md">
            Reserveer
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
export default {
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
        players: [1, 2, 3, 4]
      },
      form: {
        fltDate: this.$dayjs().format("YYYY-MM-DD"),
        fltTime: "",
        fltCrlNr1: "",
        fltCrlNr2: "",
        fltSize: this.$ls.getItem('settings').value.planner_default_reservation_count,
        players: [],
        holes: 9,
        size: 3
      },
      date: this.$dayjs().format("YYYY-MM-DD"),
    };
  },
  created: function () {
    this.loadTeetimes();
  },
  watch: {
    date: function (newValue, oldValue) {
      this.form.fltDate = newValue;
      this.loadTeetimes();
      this.$refs.qDateTeeTime.hide();
    }
  },
  methods: {

    timeFilter: function(array) {
      return array.filter((time) =>
          (time.sttPlayers >= this.form.fltSize) &&
          (this.form.holes == 9 || (time.sttAvailable18 && this.form.holes == 18)) &&
          ((this.form.holes == 9) || (time.sttCrlNrNext > 0 && this.form.holes == 18)))
    },

    optionsFn(date) {
      return this.$dayjs(date) >= this.$dayjs().add(-1, 'day') && this.$dayjs(date) <= this.$dayjs().add(21, 'day')
    },

    navDay: function (value) {
      this.date = this.$dayjs(this.date).add(value, 'day').format('YYYY-MM-DD')
    },

    loadTeetimes: function () {
      let currentUser = this.$ls.getItem("currentUser").value;
      this.loading = true;
      this.$http.get("golfer/teetimes", {
            params: {
              date: this.$dayjs(this.form.fltDate).format("YYYY-MM-DD"),
              relNr: currentUser.relNr
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

      for (let i = 0; i < this.form.fltSize; i++) {
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

      let currentUser = this.$ls.getItem("currentUser").value;
      flight_players[0].flpRelNr = currentUser.relNr;
      flight_players[0].flpName = currentUser.full_name2;

      const info = {
        fltNr: this.selectedTimeItem.sttRefNr,
        fltTime1: this.selectedTimeItem.sttTimeFrom,
        fltDate: this.$filters.dateToUnix(this.form.fltDate,'YYYY-MM-DD'),
        fltSize: this.form.fltSize,
        fltCrlNr1: this.selectedCourseItem.crlNr,
        fltCrlNr2: this.form.holes == 18 ? this.selectedTimeItem.sttCrlNrNext : null,
        fltOrigin: 2,
        flight_players: flight_players,
      };

      let that = this;
      this.$http.post(`golfer/booking`, info)
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
