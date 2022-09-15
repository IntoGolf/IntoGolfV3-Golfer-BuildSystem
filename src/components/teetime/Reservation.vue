<template>

  <div class="q-page q-pa-md">

    <q-card class="q-mb-md">

      <q-card-section class="text-h6">
        Algemeen
      </q-card-section>

      <q-separator inset/>

      <q-card-section>

        <div class="row">
          <div class="col text-bold">Slot</div>
          <div class="col-8 text-right">
            {{
              $dayjs($filters.unixToDate(local_flight.fltDate) + ' ' + $filters.minuteToTime(local_flight.fltTime1), 'DD-MM-YYYY H:mm').format('dddd D MMM HH:mm')
            }}
          </div>
        </div>

        <div class="row">
          <div class="col text-bold">Lus uit</div>
          <div class="col-8 text-right">{{ local_flight.loop1.crlName }}</div>
        </div>

        <div v-if="local_flight.fltCrlNr2 > 0" class="row">
          <div class="col text-bold">Lus in</div>
          <div class="col-8 text-right">{{ $filters.minuteToTime(local_flight.fltTime2) + ' - ' + local_flight.loop2.crlName }}</div>
        </div>

        <div class="row">
          <div class="col text-bold">Boeker</div>
          <div class="col-8 text-right">
            {{ local_flight.flight_players[0].flpName }}
          </div>
        </div>

      </q-card-section>

      <q-separator inset v-if="myBooking"/>

      <q-card-section>

        <div v-if="myBooking" class="row q-gutter-md">
          <div v-if="canCancel" class="col">
            <q-btn v-on:click="handleCancelFlight" class="full-width" >Annuleer</q-btn>
          </div>
          <div v-if="canCancel" class="col">
            <q-btn v-on:click="handleSaveFlight" class="full-width" >Opslaan</q-btn>
          </div>
          <div class="col">
            <q-btn v-on:click="handleBook18" class="full-width">18</q-btn>
          </div>
        </div>

      </q-card-section>

    </q-card>

    <q-card
        class="q-pa-md q-mb-md"
        v-for="item in myBookingsArray"
        :key="item.key">

      <div class="row">
        <div class="col-10 text-h6">
          Speler {{ item.flpSide }}
        </div>
        <div
            class="col-2 text-right"
            v-on:click="handleCancelPlayer(item)"
            v-if="item.flpNr != null && item.flpName != null && item.flpCarNr == null && (myBooking || item.flpRelNr == currentUser.relNr)">
          Annuleer
        </div>
      </div>

      <q-separator/>

      <q-select
          v-if="item.flpNr == 0 || item.flpName == null"
          label="Soort speler"
          v-model="item.flpTypeNw"
          :options="playerTypeArray"
          emit-value
          map-options
      ></q-select>

      <q-select
          v-if="item.flpTypeNw > 1"
          v-model="item.flpRelNr"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          label="Zoek relatie"
          :options="relations"
          option-value="relNr"
          option-label="full_name"
          @filter="filterFn"
          emit-value
          map-options
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results</q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-input v-if="item.flpTypeNw == 1" v-model="item.flpName" label="Naam"/>

      <q-input
          v-if="item.flpTypeNw == 1"
          v-model="item.flpEmail"
          label="E-mailadres"/>

      <q-input
          v-if="item.flpName != null && item.flpTypeNw == undefined"
          :disable="item.flpRelNr > 0 || !myBooking"
          v-model="item.flpName"
          label="Naam"/>

      <q-input
          v-if="
            item.flpType == 1 &&
            item.flpName != null &&
            item.flpTypeNw == undefined &&
            myBooking"
          v-model="item.flpEmail"
          label="E-mailadres"/>

    </q-card>

  </div>

  <q-dialog v-if="dialogVisible" v-model="dialogVisible">

    <q-card style="max-width: 320px; width: 95%">

      <q-card-section class="text-h6">
        Uw tweede 9

        <q-btn class="float-right" flat v-on:click="dialogVisible = false">Sluiten</q-btn>
      </q-card-section>

      <q-separator/>

      <q-card-section>

        <div
            class="q-ma-xs button-second-nine"
            v-for="(time, key) in timesFor18"
            :key="key"
            v-on:click="onBook18(time)">
          {{ time.crlName + ' ' + time.sttTimeFromText }}
        </div>

      </q-card-section>

    </q-card>

  </q-dialog>

</template>

<script>
export default {
  props: {
    flight: Object,
  },
  data: function () {
    return {
      loading: false,
      relations: [],
      local_flight: this.flight,
      playerTypeArray: [
        {value: 1, label: "Gast"},
        {value: 2, label: "Relatie"},
        // {value: 3, label: 'Vriend'}
      ],
      currentUser: this.$ls.getItem("currentUser"),
      teetimes: [],
      dialogVisible: false
    };
  },
  computed: {
    canCancel: function() {

      if (this.$dayjs(this.$filters.unixToDate(this.local_flight.fltDate)).isBefore(this.$dayjs())) {
        return false;
      }

      if (this.$dayjs(this.$filters.unixToDate(this.local_flight.fltDate)).isAfter(this.$dayjs())) {
        return true;
      }

      return this.local_flight.fltTime1+20 < this.$filters.timeToMinute(this.$dayjs().format('HH:mm'))
    },
    myBookingsArray: function () {
      return this.local_flight.flight_players.filter(
          (item) => item.flpCarNr == null && (this.myBooking || item.flpName != null)
      );
    },
    myBooking: function () {
      return this.flight.flight_players[0].flpRelNr == this.currentUser.relNr;
    },
    timesFor18: function () {

      let array = [];
      let that = this;

      this.teetimes.forEach(function (loop) {

        loop.times.forEach(function (time) {

          array.push({
            crlNr: loop.crlNr,
            crlName: loop.crlName,
            sttTimeFrom: time.sttTimeFrom,
            sttTimeFromText: that.$filters.minuteToTime(time.sttTimeFrom),
          })

        });
      });

      return array;
    }
  },
  methods: {
    handleSaveFlight: function (close) {
      let that = this;
      this.loading = false;
      this.$http.post(`golfer/flight/create`, this.local_flight).then((res) => {
        that.local_flight = res.data.flight;

        if (res.data.errors.length > 0) {
          that.$q
              .dialog({
                title: "Probleem gevonden!",
                message: res.data.errors[0],
                cancel: false,
                persistent: true,
              })
              .onOk(() => {
              });
        } else {
          that.$q
              .dialog({
                title: "Bevestiging",
                message:
                    "Uw wijzigingen zijn opgeslagen, wilt u de flight sluiten?",
                cancel: true,
                persistent: true,
              })
              .onOk(() => {
                that.$emit("handleClose");
              });
        }
      });
    },

    handleCancelFlight: function () {
      let that = this;

      this.$q
          .dialog({
            title: "Starttijd annuleren",
            message: "Uw starttijd wordt geannuleerd, wilt u doorgaan?",
            cancel: true,
            persistent: true,
          })
          .onOk(() => {
            this.loading = false;
            this.local_flight.fltCarNr = 1;
            this.$http
                .post(`golfer/flight/create`, this.local_flight)
                .then((res) => {
                  that.$emit("handleClose");
                });
          });
    },

    handleCancelPlayer: function (player) {
      let that = this;

      this.$q
          .dialog({
            title: "Speler annuleren",
            message: "U annuleert de deelname van deze speler, wilt u doorgaan?",
            cancel: true,
            persistent: true,
          })
          .onOk(() => {
            player.flpCarNr = 1;

            let name = player.flpName;

            let newPlayer = {
              flpNr: null,
              flpSide: player.flpSide,
              flpRelNr: null,
              flpName: null,
              flpEmail: "",
              flpHandicap: "",
              flpCarNr: null,
            };

            this.local_flight.flight_players.splice(
                player.flpSide - 1,
                0,
                newPlayer
            );

            //that.$message.success("De deelname van " + name + " is geannuleerd");

            this.handleSaveFlight(false);
          });
    },

    handleBook18: function () {
      let currentUser = this.$ls.getItem("currentUser").value;
      console.log(this.flight.fltDate);
      let that = this;
      this.$http
          .get("golfer/public/teetimes/get", {
            params: {
              date: this.$filters.unixToDate(this.flight.fltDate, "YYYY-MM-DD"),
              relNr: currentUser.relNr
            },
          })
          .then((res) => {
            res.payload.forEach(function (loop, lIndex) {
              let array = [];
              Object.entries(loop.times).forEach(function (time) {
                if (time[1].sttTimeFrom > that.flight.fltTime1 + 130) {
                  array.push(time[1])
                }
              })
              res.payload[lIndex].times = array;
            })

            this.teetimes = res.payload;
            this.loading = false;

            this.dialogVisible = true;

          });


    },

    onBook18: function (object) {
      console.log(object);
      this.local_flight.fltCrlNr2 = object.crlNr;
      this.local_flight.fltTime2 = object.sttTimeFrom;
      this.handleSaveFlight();
    },

    async filterFn(val, update, abort) {
      if (val == undefined || val.length < 2) {
        return;
      }

      let that = this;
      await this.$http
          .get(`golfer/relation/0/search/${val}`)
          .then((response) => {
            update(() => {
              that.relations = response;
            });
          });
    },
  },
};
</script>
