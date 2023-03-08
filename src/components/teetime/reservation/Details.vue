<template>

  <q-card
      class="q-mb-md">

    <q-card-section class="text-h6">
      Uw starttijd

      <q-btn
          v-show="canCancel && !paid && isMyBooking"
          v-on:click="handleCancel"
          color="negative"
          class="float-right"
          icon="delete"/>

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

      <div
          v-show="!paid"
          class="row">
        <div class="col text-bold">Vervalt op</div>
        <div class="col-8 text-right">
          {{ $dayjs(flight.fltTimestamp).add(30, 'minutes').format('dddd D MMM HH:mm') }}
        </div>
      </div>

      <div
          v-show="paid"
          class="row">
        <div class="col text-bold">Status</div>
        <div class="col-8 text-right">
          Betaald
        </div>
      </div>


    </q-card-section>

    <q-separator/>

    <q-card-section>

      <div
          class="row q-gutter-md">
        <div v-if="canCancel" class="col">
          <q-btn
              v-on:click="$emit('handleClose')"
              class="q-mr-sm"
              color="primary"
              icon="arrow_back"/>
          <q-btn
              v-if="isMyBooking && !paid"
              v-on:click="dialogVisible = true"
              class="q-mr-sm"
              color="primary"
              label="Wijzig 18"/>
          <q-btn
              v-if="isMyBooking && !paid"
              v-show="!paid"
              v-on:click="onPay"
              class="float-right"
              color="primary"
              icon="payments"/>
        </div>
      </div>

    </q-card-section>

    <comp-dialog18-holes
        :dialogVisible="dialogVisible"
        :flight="flight" v-on:handleClose="handleClose18"/>

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
      dialogVisible: false,
      currentUser: this.$ls.getItem("currentUser").value,
    }
  },
  computed: {
    canCancel: function () {
      return true;
      if (this.$dayjs(this.$filters.unixToDate(this.local_flight.fltDate)).isBefore(this.$dayjs())) {
        return false;
      }
      if (this.$dayjs(this.$filters.unixToDate(this.local_flight.fltDate)).isAfter(this.$dayjs())) {
        return true;
      }
      return this.local_flight.fltTime1 + 20 < this.$filters.timeToMinute(this.$dayjs().format('HH:mm'))
    },
    slot: function () {
      return this.$dayjs(this.$filters.unixToDate(this.local_flight.fltDate) + ' ' + this.$filters.minuteToTime(this.local_flight.fltTime1), 'DD-MM-YYYY H:mm').format('dddd D MMM HH:mm')
    },
    courseLoop: function () {
      return this.$filters.minuteToTime(this.local_flight.fltTime2) + ' - ' + this.local_flight.loop2.crlName
    },
    bookerName: function () {
      return this.local_flight.flight_players[0].flpName;
    },
    isMyBooking: function () {
      return this.local_flight.flight_players[0].flpRelNr == this.currentUser.relNr;
    },
    total: function () {
      return this.local_flight.flight_players.reduce(function (result, item) {
        return result + item.flpPrice;
      }, 0);
    },
    paid: function () {
      return this.local_flight.flight_players.filter(player => player.flpBilNr > 0 || player.flpScorecard > 0).length > 0;
    }
  },
  methods: {
    handleCancel: function () {
      this.local_flight.fltCarNr = 1;
      this.$q
          .dialog({
            title: "Starttijd annuleren",
            message: "Wilt u doorgaan?",
            cancel: true,
            persistent: true,
          })
          .onOk(() => {
            this.$emit('handleSave', this.local_flight, true)
          });
    },
    handleSave: function () {
      this.local_flight.fltCarNr = 1;
      this.$q
          .dialog({
            title: "Starttijd annuleren",
            message: "Wilt u doorgaan?",
            cancel: true,
            persistent: true,
          })
          .onOk(() => {
            this.$emit('handleSave', this.local_flight, true)
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
    },
    handleClose18: function (flight) {
      if (flight != undefined) {
        this.local_flight = flight;
      }
      this.dialogVisible = false;
    }
  }
};
</script>
