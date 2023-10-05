<template>
  <q-card>
    <q-card-section class="text-h6">
      {{ player.flpName === null ? "Vrije plaats" : player.flpName }}
    </q-card-section>

    <q-separator />

    <q-card-section v-show="player.flpName !== null">
      <div v-show="player.flpRelNr === null" class="row q-mb-sm">
        <div class="col text-bold">E-mail</div>
        <div class="col-8 text-right">
          {{ player.flpEmail === null ? "-" : player.flpEmail }}
        </div>
      </div>

      <div v-show="player.flpRelNr === null" class="row q-mb-sm">
        <div class="col text-bold">Telefoon</div>
        <div class="col-8 text-right">
          {{ player.flpPhone === null ? "-" : player.flpPhone }}
        </div>
      </div>

      <div class="row q-mb-sm">
        <div class="col text-bold">Handicap</div>
        <div class="col-8 text-right">
          {{ player.flpHandicap === null ? "-" : player.flpHandicap }}
        </div>
      </div>

      <div v-show="player.flpRelNr === null" class="row q-mb-sm">
        <div class="col text-bold">Gsn</div>
        <div class="col-8 text-right">
          {{ player.flpGsn === null ? "-" : player.flpGsn }}
        </div>
      </div>

      <div v-show="player.flpRelNr === null" class="row q-mb-sm">
        <div class="col text-bold">Intro</div>
        <div class="col-8 text-right">
          <q-icon v-show="player.flpIntro === 1" color="primary" name="check" />
        </div>
      </div>

      <div v-show="showPay" class="row q-mb-sm">
        <div class="col text-bold">Greenfee</div>
        <div class="col-8 text-right">
          {{ player.greenfee === null ? "-" : player.greenfee.grfName }}
        </div>
      </div>

      <div v-show="showPay" class="row">
        <div class="col text-bold">Greenfee tarief</div>
        <div class="col-8 text-right">
          {{ player.flpPrice === null ? "-" : $filters.money(player.flpPrice) }}
        </div>
      </div>
    </q-card-section>

    <q-separator v-show="canCancel && !paid" />

    <q-card-section>
      <q-btn
        v-show="canCancel && !paid"
        class="q-mr-md"
        color="primary"
        icon="edit"
        v-on:click="$emit('handleEditPlayer', player)"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import authMixin from "../../../mixins/auth";

export default {
  mixins: [authMixin],
  props: {
    flight: Object,
    player: Object,
  },
  data: function () {
    return {};
  },
  computed: {
    showPay: function () {
      return this.settings.app_display_greenfee_pay === "1";
    },
    canCancel: function () {
      if (
        this.$dayjs(
          this.$filters.unixToDate(this.flight.fltDate),
          "DD-MM-YYYY"
        ).isBefore(this.$dayjs())
      ) {
        return false;
      }
      if (
        this.$dayjs(
          this.$filters.unixToDate(this.flight.fltDate),
          "DD-MM-YYYY"
        ).isAfter(this.$dayjs())
      ) {
        return true;
      }
      return (
        this.flight.fltTime1 + 20 >
        this.$filters.timeToMinute(this.$dayjs().format("HH:mm"))
      );
    },
    isMyBooking: function () {
      return this.flight.flight_players[0].flpRelNr === this.currentUser.relNr;
    },
    paid: function () {
      return (
        this.player &&
        (this.player.flpBilNr > 0 || this.player.flpScorecard > 0)
      );
    },
  },
  methods: {
    handleCancel: function () {
      this.$q
        .dialog({
          title: "Speler annuleren",
          message: "U annuleert de deelname van deze speler, wilt u doorgaan?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          let local_flight = { ...this.flight };

          //cancel selected player
          let index = this.local_flight.flight_players.findIndex(
            (player) => (player.flpNr = this.player.flpNr)
          );
          this.local_flight.flight_players[index].flpCarNr = 1;

          //add new player to flight to fill the canceled player spot
          let newPlayer = {
            flpNr: null,
            flpSide: this.local_flight.flight_players[index].flpSide,
            flpRelNr: null,
            flpName: null,
            flpEmail: "",
            flpHandicap: "",
            flpCarNr: null,
          };

          //insert the player on the canceld player spot
          local_flight.flight_players.splice(player.flpSide - 1, 0, newPlayer);

          //save the flight without closing it
          this.$emit("handleSave", local_flight, false, -1);
        });
    },
    handleSave: function (flight, close) {
      this.$emit("handleSave", flight, close, -1);
    },
  },
};
</script>
