<template>
  <q-page class="q-page q-pa-md">
    <div v-if="editPlayer === null">
      <comp-details
        :flight="local_flight"
        v-on:handleClose="handleClose"
        v-on:handleSave="handleSave"
      />

      <comp-player
        v-for="(player, key) in playerArray"
        :key="key"
        :flight="local_flight"
        :player="player"
        class="q-mb-md"
        v-on:handleEditPlayer="handleEditPlayer"
        v-on:handleSave="handleSave"
      />
    </div>

    <comp-edit-player
      v-if="editPlayer"
      :flight="local_flight"
      :player="editPlayer"
      v-on:handleCloseEditPlayer="handleCloseEditPlayer"
      v-on:handleSave="handleSave"
    />
  </q-page>
</template>

<script>
import compDetails from "components/teetime/reservation/Details";
import compPlayer from "components/teetime/reservation/Player";
import compEditPlayer from "components/teetime/reservation/EditPlayer";
import authMixin from "../../mixins/auth";

export default {
  mixins: [authMixin],
  components: {
    compPlayer,
    compDetails,
    compEditPlayer,
  },
  props: {
    flight: Object,
  },
  data: function () {
    return {
      loading: false,
      dialogVisible: false,
      editPlayer: null,
      local_flight: { ...this.flight },
    };
  },
  computed: {
    playerArray: function () {
      return this.local_flight.flight_players.filter(
        (item) =>
          item.flpSide !== this.firstNr &&
          item.flpCarNr === null &&
          (this.isMyBooking || item.flpName !== null)
      );
    },
    isMyBooking: function () {
      return (
        this.local_flight.flight_players[0].flpRelNr === this.currentUser.relNr
      );
    },
    firstNr: function () {
      return this.local_flight.flight_players[0].flpSide;
    },
  },
  methods: {
    handleSave: function (flight, close, index) {
      let that = this;
      this.loading = false;
      this.$http.post(`golfer/booking`, flight).then((res) => {
        if (res.errors.length > 0) {
          that.$q
            .dialog({
              title: "Probleem gevonden!",
              message: res.data.errors[0],
              cancel: false,
              persistent: true,
            })
            .onOk(() => {});
        } else {
          this.local_flight = res.flight;
        }

        if (index > -1) {
          this.handleEditPlayer(this.local_flight.flight_players[index]);
        } else if (close) {
          this.$emit("handleClose");
        }
      });
    },
    handleClose: function () {
      this.$emit("handleClose");
    },
    handleEditPlayer: function (player) {
      this.editPlayer = player;
    },
    handleCloseEditPlayer: function () {
      this.editPlayer = null;
    },
  },
};
</script>
