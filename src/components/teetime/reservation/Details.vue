<template>

  <q-card
      class="q-mb-md">

    <q-card-section class="text-h6">
      Uw starttijd

      <q-btn
          v-show="canCancel && !paid"
          v-on:click="handleCancel"
          color="accent"
          class="float-right"
          label="Annuleer"/>

    </q-card-section>

    <q-separator/>

    <q-card-section>

      <div class="row q-mb-sm">
        <div class="col text-bold">Slot</div>
        <div class="col-8 text-right">
          {{ slot }}
        </div>
      </div>

      <div class="row q-mb-sm">
        <div class="col text-bold">Lus uit</div>
        <div class="col-8 text-right">
          {{ local_flight.loop1.crlName }}
        </div>
      </div>

      <div v-if="local_flight.fltCrlNr2 > 0" class="row q-mb-sm">
        <div class="col text-bold">Lus in</div>
        <div class="col-8 text-right">
          {{ courseLoop }}
        </div>
      </div>

      <div class="row q-mb-sm">
        <div class="col text-bold">Boeker</div>
        <div class="col-8 text-right">
          {{ bookerName }}
        </div>
      </div>

      <div class="row q-mb-sm">
        <div class="col text-bold">Spelers</div>
        <div class="col-8 text-right">
          {{ flight.fltSize }}
        </div>
      </div>

      <div class="row q-mb-sm">
        <div class="col text-bold">Intro ruimte</div>
        <div class="col-8 text-right">
          {{ flight.IntroMax - flight.IntroCount }}X
        </div>
      </div>

      <div class="row q-mb-sm">
        <div class="col text-bold">Greenfee</div>
        <div class="col-8 text-right">
          {{ flight.flight_players[0].greenfee == null ? '-' : flight.flight_players[0].greenfee.grfName }}
        </div>
      </div>

      <div class="row q-mb-sm">
        <div class="col text-bold">Greenfee tarief</div>
        <div class="col-8 text-right">
          {{
            flight.flight_players[0].flpPrice == null ? $filters.money(0) : $filters.money(flight.flight_players[0].flpPrice)
          }}
        </div>
      </div>

      <div class="row q-mb-sm">
        <div class="col text-bold">Greenfee totaal</div>
        <div class="col-8 text-right">
          {{ $filters.money(total) }}
        </div>
      </div>

      <div class="row">
        <div class="col text-bold">Vervalt op</div>
        <div class="col-8 text-right">
          {{ $dayjs(flight.fltTimestamp).add(30, 'minutes').format('dddd D MMM HH:mm') }}
        </div>
      </div>

    </q-card-section>

    <q-separator v-if="isMyBooking"/>

    <q-card-section>

      <div v-if="isMyBooking" class="row q-gutter-md">
        <div v-if="canCancel" class="col">
          <q-btn
              v-on:click="$emit('handleClose')"
              class="q-mr-sm"
              color="primary"
              label="sluiten"/>
          <q-btn
              v-on:click="handleBook18"
              class="q-mr-sm"
              color="primary"
              label="Wijzig 18"/>
          <q-btn
              v-show="!paid"
              v-on:click="onPay"
              class="float-right"
              color="primary"
              label="Betaal"/>
        </div>
      </div>

    </q-card-section>

    <comp-dialog18-holes
        :flight="flight"/>

  </q-card>

</template>

<script>

import compDialog18Holes from "components/teetime/reservation/Dialog18Holes";

export default {
  components: {
    compDialog18Holes
  },
  props: {
    flight: Object,
  },
  data: function () {
    return {
      local_flight: this.flight,
      currentUser: this.$ls.getItem("currentUser").value,
    }
  },
  computed: {
    canCancel: function () {
      return true;
      if (this.$dayjs(this.$filters.unixToDate(this.flight.fltDate)).isBefore(this.$dayjs())) {
        return false;
      }
      if (this.$dayjs(this.$filters.unixToDate(this.flight.fltDate)).isAfter(this.$dayjs())) {
        return true;
      }
      return this.flight.fltTime1 + 20 < this.$filters.timeToMinute(this.$dayjs().format('HH:mm'))
    },
    slot: function () {
      return this.$dayjs(this.$filters.unixToDate(this.flight.fltDate) + ' ' + this.$filters.minuteToTime(this.flight.fltTime1), 'DD-MM-YYYY H:mm').format('dddd D MMM HH:mm')
    },
    courseLoop: function () {
      return this.$filters.minuteToTime(this.flight.fltTime2) + ' - ' + this.flight.loop2.crlName
    },
    bookerName: function () {
      return this.flight.flight_players[0].flpName;
    },
    isMyBooking: function () {
      return this.flight.flight_players[0].flpRelNr == this.currentUser.relNr;
    },
    total: function () {
      return this.flight.flight_players.reduce(function (result, item) {
        return result + item.flpPrice;
      }, 0);
    },
    paid: function () {
      return this.flight.flight_players.filter(player => player.flpBilNr > 0).length > 0;
    }
  },
  methods: {
    handleCancel: function () {
      this.local_flight.fltCarNr = 1;
      this.$emit('handleSave', this.local_flight, true)
    },
    handleBook18: function () {
      let currentUser = this.$ls.getItem("currentUser").value;

      let that = this;
      this.$http.get("golfer/teetimes", {
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
    onPay: function () {

      this.$http.get("golfer/pay", {
        params: {
          fltNr: this.flight.fltNr
        },
      }).then((res) => {
        window.location.href = res.url;
      })
    }
  }
};
</script>
