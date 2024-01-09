<template>
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
        {{ flight.loop1.crlName }}
      </div>
    </div>

    <div v-if="flight.fltCrlNr2 > 0" class="row q-mb-sm">
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

    <div v-show="showPay" class="row q-mb-sm">
      <div class="col text-bold">Greenfee</div>
      <div class="col-8 text-right">
        {{
          flight.flight_players[0].greenfee === null
            ? "-"
            : flight.flight_players[0].greenfee.grfName
        }}
      </div>
    </div>

    <div v-show="showPay" class="row q-mb-sm">
      <div class="col text-bold">Greenfee tarief</div>
      <div class="col-8 text-right">
        {{
          flight.flight_players[0].flpPrice === null
            ? $filters.money(0)
            : $filters.money(flight.flight_players[0].flpPrice)
        }}
      </div>
    </div>

    <div v-show="showPay" class="row q-mb-sm">
      <div class="col text-bold">Greenfee totaal</div>
      <div class="col-8 text-right">
        {{ $filters.money(total) }}
      </div>
    </div>

    <div v-show="showPay && !paid" class="row">
      <div class="col text-bold">Vervalt op</div>
      <div class="col-8 text-right">
        {{
          $dayjs(flight.fltTimestamp)
            .add(30, "minutes")
            .format("dddd D MMM HH:mm")
        }}
      </div>
    </div>

    <div v-show="showPay && paid" class="row">
      <div class="col text-bold">Status</div>
      <div class="col-8 text-right">Betaald</div>
    </div>
  </q-card-section>
</template>

<script>
import authMixin from "../../../mixins/auth";

export default {
  mixins: [authMixin],
  props: {
    flight: Object,
  },
  computed: {
    showPay() {
      return this.settings.app_display_greenfee_pay === "1";
    },
    slot: function () {
      return this.$dayjs(
        this.$filters.unixToDate(this.flight.fltDate) +
          " " +
          this.$filters.minuteToTime(this.flight.fltTime1),
        "DD-MM-YYYY H:mm"
      ).format("dddd D MMM HH:mm");
    },
    courseLoop: function () {
      return (
        this.$filters.minuteToTime(this.flight.fltTime2) +
        " - " +
        this.flight.loop2.crlName
      );
    },
    bookerName: function () {
      return this.flight.flight_players[0].flpName;
    },
    total: function () {
      return this.flight.flight_players.reduce(function (result, item) {
        return result + item.flpPrice;
      }, 0);
    },
    paid: function () {
      return (
        this.flight.flight_players.filter(
          (player) => player.flpBilNr > 0 || player.flpScorecard > 0
        ).length > 0
      );
    },
  },
};
</script>
