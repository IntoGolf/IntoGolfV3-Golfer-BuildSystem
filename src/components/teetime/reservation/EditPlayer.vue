<template>

  <q-card>

    <q-card-section class="text-h6">

      Speler {{ player.flpSide }}

      <q-btn
          v-if="canCancel"
          v-on:click="handleCancel"
          color="accent"
          size="md"
          class="float-right"
          label="Annuleer speler"/>

    </q-card-section>

    <q-separator/>

    <q-card-section>

      <q-input
          v-show="!scan"
          class="q-mb-sm"
          :readonly="player.flpRelNr > 0"
          label="Naam speler"
          outlined counter maxlength="40" clearable
          v-model="flpName"/>

      <q-input
          v-show="!scan"
          class="q-mb-sm"
          :readonly="player.flpRelNr > 0"
          label="Handicap"
          outlined counter maxlength="4" clearable
          v-model="flpHandicap"/>

      <q-input
          v-show="!scan"
          class="q-mb-sm"
          :readonly="player.flpRelNr > 0"
          label="E-mailadres"
          outlined counter maxlength="40" clearable
          v-model="flpEmail"/>

      <q-input
          v-show="!scan"
          class="q-mb-sm"
          :readonly="player.flpRelNr > 0"
          label="Telefoonnummer"
          outlined counter maxlength="15" clearable
          v-model="flpPhone"/>

      <q-input
          v-show="!scan"
          class="q-mb-sm"
          :readonly="player.flpRelNr > 0"
          label="Golfservicenummer"
          outlined counter maxlength="10" clearable
          v-model="flpGsn"/>

      <qrcode-stream
          v-if="scan"
          @decode="onDecode" @init="onInit"/>

    </q-card-section>

    <q-separator/>

    <q-card-section>

      <q-btn
          v-on:click="handleSave"
          class="q-mr-sm"
          color="primary"
          label="Opslaan"/>

      <q-btn
          v-on:click="$emit('handleCloseEditPlayer',player)"
          class="q-mr-sm"
          color="primary"
          label="Sluiten"/>

      <q-btn
          v-on:click="scan = true"
          class="q-mr-sm"
          color="primary"
          label="Scan"/>

    </q-card-section>

  </q-card>

</template>

<script>

import {QrcodeStream} from "vue3-qrcode-reader";

export default {
  components: {
    QrcodeStream
  },
  props: {
    flight: Object,
    player: Object
  },
  data: function () {
    return {
      local_flight: this.flight,
      local_player: this.player,
      flpName: this.player.flpName,
      flpHandicap: this.player.flpHandicap,
      flpEmail: this.player.flpEmail,
      flpPhone: this.player.flpPhone,
      flpGsn: this.player.flpGsn,
      scan: false
    };
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
  },
  watch: {
    flpHandicap: function(newValue) {
      this.flpHandicap = newValue.replace(",", ".");
    }
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
            //cancel selected player
            let player = this.local_flight.flight_players.find(player => player.flpNr = this.player.flpNr);
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
            this.local_flight.flight_players.splice(
                player.flpSide - 1,
                0,
                newPlayer
            );

            //save the flight without closing it
            this.$emit('handleSave', this.local_flight);
          });
    },
    handleSave: function () {
      this.local_player.flpName = this.flpName;
      this.local_player.flpHandicap = this.flpHandicap;
      this.local_player.flpEmail = this.flpEmail;
      this.local_player.flpPhone = this.flpPhone;
      this.local_player.flpGsn = this.flpGsn;
      this.$emit('handleSave', this.local_flight);
    },
    onDecode: function (decodedString) {

      this.flpName = decodedString.substring(11, 59).trim();
      this.flpHandicap = decodedString.substring(77, 82).trim();
      this.flpGsn = decodedString.substring(83, 95).trim();
      this.flpGender = decodedString.substring(82, 83).trim();

      console.log(decodedString);
      this.scan = false;
    },
    onInit(promise) {
      promise
          .then(console.log)
          .catch(console.error)
    }
  },
};
</script>
