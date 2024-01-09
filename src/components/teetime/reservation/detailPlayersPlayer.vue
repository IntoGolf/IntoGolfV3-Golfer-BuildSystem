<template>
  <q-item v-ripple clickable v-on:click="handleCancelPlayer(player)">
    <q-item-section avatar>
      <player-avatar :player="player" />
    </q-item-section>
    <q-item-section>
      <q-item-label>
        <b>{{ player.flpName }}</b>
      </q-item-label>
      <q-item-label caption>
        {{ player.flpEmail }}
      </q-item-label>
    </q-item-section>
    <q-item-section side style="font-size: 24px">
      {{ player.flpHandicap }}
    </q-item-section>
  </q-item>
</template>

<script>
import PlayerAvatar from "components/teetime/reservation/playerAvatar.vue";

export default {
  components: { PlayerAvatar },
  props: {
    player: Object,
    flight: Object,
  },
  computed: {
    isMyBooking: function () {
      return (
        this.flight.flight_players[0].flpRelNr ===
        this.$store.state.currentUser.item.relNr
      );
    },
    canCancel: function () {
      return this.$dayjs(
        this.$filters.unixToDate(this.local_flight.fltDate),
        "DD-MM-YYYY"
      )
        .add(this.local_flight.fltTime1, "minutes")
        .isAfter(this.$dayjs().add(this.cancelHours * 60, "minutes"));
    },
  },
  methods: {
    handleCancelPlayer: function (player) {
      if (player.flpSide === 1 || !this.isMyBooking) {
        return;
      }

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
          let index = local_flight.flight_players.findIndex(
            (item) => item.flpNr === player.flpNr
          );
          local_flight.flight_players[index].flpCarNr = 1;
          //add new player to flight to fill the canceled player spot
          let newPlayer = {
            flpNr: null,
            flpSide: local_flight.flight_players[index].flpSide,
            flpRelNr: null,
            flpName: "",
            flpEmail: "",
            flpHandicap: "",
            flpCarNr: null,
          };

          //insert the player on the canceled player spot
          local_flight.flight_players.splice(player.flpSide, 0, newPlayer);

          //save the flight without closing it
          this.$emit("handleSave", local_flight);
        });
    },
  },
};
</script>
