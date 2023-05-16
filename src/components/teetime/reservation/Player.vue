<template>
  <div>
    <select-player
      v-if="player.flpName === null"
      :flight="flight"
      :player="player"
      v-on:handleSave="handleSave"
    />

    <player-details
      v-else
      :flight="flight"
      :player="player"
      v-on:handleEditPlayer="handleEditPlayer"
      v-on:handleSave="handleSave"
    />
  </div>
</template>

<script>
import SelectPlayer from "components/teetime/reservation/SelectPlayer";
import PlayerDetails from "components/teetime/reservation/PlayerDetails";

export default {
  components: { PlayerDetails, SelectPlayer },
  props: {
    flight: Object,
    player: Object,
  },
  data: function () {
    return {};
  },
  methods: {
    handleSave: function (flight, close, index) {
      this.$emit("handleSave", flight, close, index);
    },
    handleEditPlayer: function (player) {
      this.$emit("handleEditPlayer", player);
    },
  },
};
</script>
