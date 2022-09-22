<template>

  <q-page class="q-page q-pa-md">

    <comp-details
        v-show="editPlayer == null"
        :flight="flight"
        v-on:handleSave="handleSave"
        v-on:handleClose="handleClose"/>

    <comp-player
        v-show="editPlayer == null"
        v-for="(player,key) in playerArray"
        :key="key"
        :flight="flight"
        :player="player"
        class="q-mb-md"
        v-on:handleEditPlayer="handleEditPlayer"
        v-on:handleSave="handleSave"/>

    <comp-edit-player
        v-if="editPlayer"
        :flight="flight"
        :player="editPlayer"
        v-on:handleSave="handleSave"
        v-on:handleCloseEditPlayer="handleCloseEditPlayer"/>

  </q-page>

</template>

<script>

import compDetails from "components/teetime/reservation/Details";
import compPlayer from "components/teetime/reservation/Player";
import compEditPlayer from "components/teetime/reservation/EditPlayer";

export default {
  components: {
    compPlayer,
    compDetails,
    compEditPlayer
  },
  props: {
    flight: Object
  },
  data: function () {
    return {
      loading: false,
      currentUser: this.$ls.getItem("currentUser").value,
      dialogVisible: false,
      editPlayer: null
    };
  },
  computed: {
    playerArray: function () {
      return this.flight.flight_players.filter(
          (item) => item.flpSide != 1 && item.flpCarNr == null && (this.isMyBooking || item.flpName != null)
      );
    },
    isMyBooking: function () {
      return this.flight.flight_players[0].flpRelNr == this.currentUser.relNr;
    }
  },
  methods: {
    handleSave: function (flight) {
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
                this.$emit("handleClose");
              });
        }

      });
    },
    handleClose: function () {
      this.$emit("handleClose");
    },
    handleEditPlayer: function(player) {
      this.editPlayer = player;
    },
    handleCloseEditPlayer: function(player) {
      this.editPlayer = null;
    }
  }
};
</script>
