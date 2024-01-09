<template>
  <q-list bordered separator>
    <detail-players-player
      v-for="(player, key) in players"
      :key="key"
      :flight="flight"
      :player="player"
      v-on:handleSave="handleSave"
    />
  </q-list>
</template>

<script>
import DetailPlayersPlayer from "components/teetime/reservation/detailPlayersPlayer.vue";

export default {
  components: { DetailPlayersPlayer },
  props: {
    flight: Object,
  },
  computed: {
    playerArray: function () {
      return this.flight.flight_players.filter(
        (item) =>
          item.flpSide !== this.firstNr &&
          item.flpCarNr === null &&
          (this.isMyBooking || item.flpName !== null)
      );
    },
    players() {
      return this.playerArray.filter((item) => item.flpName !== "");
    },
  },
  methods: {
    handleSave(flight) {
      this.$emit("handleSave", flight);
    },
  },
};
</script>
