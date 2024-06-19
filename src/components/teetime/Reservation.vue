<template>
  <q-page class="q-pa-sm">
    <comp-details
      v-if="editPlayer === null && addPlayer === null && !addRent && !checkIn"
      :flight="local_flight"
      v-on:handleAddPlayer="handleAddPlayer"
      v-on:handleAddRent="handleAddRent"
      v-on:handleCheckIn="handleCheckIn"
      v-on:handleClose="handleClose"
      v-on:handleEditPlayer="handleEditPlayer"
      v-on:handleRefresh="handleRefresh"
      v-on:handleSave="handleSave"
    />

    <select-player
      v-else-if="addPlayer"
      :flight="local_flight"
      :player="addPlayer"
      v-on:handleCloseEditPlayer="handleCloseEditPlayer"
      v-on:handleSave="handleSave"
    />

    <comp-edit-player
      v-else-if="editPlayer"
      :flight="local_flight"
      :player="editPlayer"
      v-on:handleCloseEditPlayer="handleCloseEditPlayer"
      v-on:handleSave="handleSave"
    />

    <rent-add
      v-else-if="addRent"
      :flight="local_flight"
      v-on:handleCloseEditPlayer="handleCloseEditPlayer"
      v-on:handleRefresh="handleRefresh"
      v-on:handleSave="handleSave"
    />

    <check-in v-else-if="checkIn" :flight="local_flight" />
  </q-page>
</template>

<script>
import compDetails from "components/teetime/reservation/Details";
import compEditPlayer from "components/teetime/reservation/EditPlayer";
import authMixin from "../../mixins/auth";
import SelectPlayer from "components/teetime/reservation/SelectPlayer.vue";
import rentAdd from "components/teetime/reservation/rentAdd.vue";
import CheckIn from "pages/CheckIn.vue";

export default {
  mixins: [authMixin],
  components: {
    CheckIn,
    rentAdd,
    SelectPlayer,
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
      addPlayer: null,
      addRent: false,
      local_flight: { ...this.flight },
      checkIn: false,
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
      if (!this.local_flight.flight_players) {
        return 0;
      }
      return this.local_flight.flight_players[0].flpSide;
    },
  },
  methods: {
    handleSave: function (flight) {
      this.loading = false;
      this.$http
        .post(`golfer/booking`, flight)
        .then((res) => {
          if (flight.fltCarNr > 0) {
            this.handleClose();
          } else {
            this.local_flight = res.flight;
            this.handleCloseEditPlayer();
          }
        })
        .catch(() => {
          this.handleRefresh();
        });
    },
    handleClose: function () {
      this.$emit("handleClose");
    },
    handleEditPlayer: function (player) {
      this.editPlayer = player;
    },
    handleAddPlayer: function (player) {
      this.addPlayer = player;
    },
    handleAddRent: function () {
      this.addRent = true;
    },
    handleCloseEditPlayer: function () {
      this.editPlayer = null;
      this.addPlayer = null;
      this.addRent = false;
    },
    async handleRefresh() {
      this.local_flight = await this.$http.get("golfer/booking", {
        params: this.local_flight,
      });
      this.editPlayer = null;
      this.addPlayer = null;
      this.addRent = false;
    },
    handleCheckIn() {
      this.checkIn = true;
    },
  },
};
</script>
