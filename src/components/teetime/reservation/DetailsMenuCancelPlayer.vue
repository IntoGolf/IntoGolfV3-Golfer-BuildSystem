<template>
  <q-item
    v-if="canCancel && !paid && !isMyBooking"
    v-ripple
    clickable
    v-on:click="handleCancel"
  >
    <q-item-section side>
      <q-icon name="delete" />
    </q-item-section>
    <q-item-section>
      <q-item-label>
        <b>Annuleer mijn deelname</b>
      </q-item-label>
      <q-item-label caption> tot {{ cancelHours }} uur voor start</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  props: {
    flight: Object,
    cancelHours: Number,
    canCancel: Boolean,
    paid: Boolean,
    isMyBooking: Boolean,
  },
  methods: {
    handleCancel: function () {
      let local_flight = { ...this.flight };
      local_flight.fltCarNr = 1;
      this.$q
        .dialog({
          title: "Deelname annuleren",
          message:
            "Je staat op het punt jezelf van de flight te verwijderen, wil je doorgaan?",
          cancel: true,
        })
        .onOk(() => {
          let local_flight = { ...this.flight };
          let relNr = this.$store.state.currentUser.item.relNr;

          //cancel selected player
          let player = this.flight.flight_players.find(
            (player) => player.flpRelNr === relNr
          );
          player.flpCarNr = 1;

          //add new player to flight to fill the canceled player spot
          let newPlayer = {
            flpNr: null,
            flpSide: player.flpSide,
            flpRelNr: null,
            flpName: null,
            flpEmail: "",
            flpHandicap: "",
            flpCarNr: null,
          };

          //insert the player on the canceld player spot
          local_flight.flight_players.splice(player.flpSide - 1, 0, newPlayer);

          //save the flight without closing it
          this.$emit("handleSave", local_flight);
          this.$emit("handleClose");
        });
    },
  },
};
</script>
