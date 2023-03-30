<template>

  <q-card>

    <q-card-section class="text-h6">

      {{ title }}

      <q-btn
          v-if="showCancelBtn"
          v-on:click="onCancel"
          color="negative"
          size="md"
          class="float-right"
          icon="delete"/>

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
          v-show="!scan && player.flpRelNr == null"
          class="q-mb-sm"
          :readonly="player.flpRelNr > 0"
          label="E-mailadres"
          outlined counter maxlength="40" clearable
          v-model="flpEmail"/>

      <q-input
          v-show="!scan && player.flpRelNr == null"
          class="q-mb-sm"
          :readonly="player.flpRelNr > 0"
          label="Telefoonnummer"
          outlined counter maxlength="15" clearable
          v-model="flpPhone"/>

      <q-input
          v-show="!scan && player.flpRelNr == null"
          class="q-mb-sm"
          :disable="flpIntro == 1"
          :readonly="player.flpRelNr > 0"
          label="Golfservicenummer"
          outlined counter maxlength="10" clearable
          v-model="flpGsn"/>

      <div v-show="showIntroMessage && player.flpRelNr == null">
        <i>{{ textIntroMessage }}</i><br>
      </div>

      <div v-show="showExceedIntroodMessage && player.flpRelNr == null">
        <i>{{ textExceedIntroodMessage }}</i><br>
      </div>

      <div v-show="showExceedIntrosMessage && player.flpRelNr == null">
        <i>{{ textExceedIntrosMessage }}</i><br>
      </div>

      <q-toggle
          v-show="player.flpRelNr === 0 || player.flpRelNr === null"
          v-model="flpIntro"
          :disable="disableIntoToggle"
          :true-value="1"
          :false-value="null"
          label="Introducee"
          left-label/>
      <br>

      <div v-show="showIntroodMessage && player.flpRelNr == null">
        <br><i>{{ textIntroodMessage }}</i>
      </div>

      <qrcode-stream
          v-if="scan"
          @decode="onDecode"
          @init="onInit"/>

    </q-card-section>

    <q-separator/>

    <q-card-section>

      <q-btn
          v-show="!scan"
          v-on:click="handleSave"
          class="q-mr-sm"
          color="primary"
          icon="save"/>

      <q-btn
          v-show="!scan"
          v-on:click="$emit('handleCloseEditPlayer')"
          class="q-mr-sm"
          color="primary"
          icon="arrow_back"/>

      <q-btn
          v-show="scan"
          v-on:click="scan = false"
          class="q-mr-sm"
          color="primary"
          icon="arrow_back"/>

      <q-btn
          v-show="!scan && player.flpRelNr == null"
          v-on:click="scan = true"
          class="q-mr-sm"
          color="primary"
          icon="qr_code_2"
      />

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
      title: 'Speler ' + this.player.flpSide,
      local_flight: this.flight,
      local_player: this.player,
      flpName: this.player.flpName,
      flpHandicap: this.player.flpHandicap,
      flpEmail: this.player.flpEmail,
      flpPhone: this.player.flpPhone,
      flpGsn: this.player.flpGsn,
      flpIntro: this.player.flpIntro,
      scan: false,
      IntroMax:1,
      Intros: 0,
      titleCancel: "Speler annuleren",
      messageCancel: "U annuleert de deelname van deze speler en kunt hierna een andere speler aan de flight toevoegen, wilt u doorgaan?",
      textIntroMessage: "Wenst u deze speler te introduceren voer dan het GSN nummer van de speler in.",
      textExceedIntroodMessage: "Deze speler is over de introductie limiet van " + this.IntroMax + " intoducties en kan nier meer worden geintroduceerd.",
      textExceedIntrosMessage: "U kunt niet meer introduceren u heeft het maximum aantal van " + this.flight.IntroMax + " introducties bereikt.",
      textIntroodMessage: "U introduceert deze speler, voordat u start moet het GSN nummer gevalideerd worden. U kunt dit doen door op onderstaande knop \"SCAN NGF\" te klikken of bij de caddiemaster.\""
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
    showIntroMessage: function() {
      return this.flpIntro == null && this.flight.IntroMax > this.flight.IntroCount && this.IntroMax > this.Intros;
    },
    showExceedIntroodMessage: function() {
      return this.flpGsn != null && this.flpGsn.length == 10 && this.IntroMax > 0 && this.IntroMax < this.Intros;
    },
    showExceedIntrosMessage: function() {
      return this.flpIntro == null && this.flight.IntroMax <= this.flight.IntroCount;
    },
    showIntroodMessage: function() {
      return this.flpIntro == 1;
    },
    showCancelBtn: function() {
      return this.canCancel && !this.scan;
    },
    disableIntoToggle: function() {
      return this.flpGsn == null || this.flpGsn.length < 10 || this.flight.IntroMax <= this.flight.IntroCount || this.IntroMax <= this.Intros;
    }
  },
  mounted() {
    console.log(this.player);
  },
  watch: {
    flpHandicap: function (newValue) {
      this.flpHandicap = newValue.replace(",", ".");
    },
    flpGsn: function (newValue) {
      if (newValue.length < 10) {
        return;
      }

      let data = {
        params: {
          fltDate: this.flight.fltDate,
          flpGsn: newValue
        }
      }

      this.$http.get('golfer/intros', data).then((res) => {
        this.IntroMax = res.IntroMax;
        this.Intros = res.Intros;
      });

    },
  },
  methods: {
    onCancel: function () {
      this.$q
          .dialog({
            title: this.titleCancel,
            message: this.messageCancel,
            cancel: true,
            persistent: true,
          })
          .onOk(() => {
            //cancel selected player
            let index = this.local_flight.flight_players.findIndex(player => player.flpNr == this.player.flpNr);
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
            this.local_flight.flight_players.splice(
                this.local_flight.flight_players[index].flpSide - 1,
                0,
                newPlayer
            );

            //save the flight without closing it
            this.$emit('handleSave', this.local_flight, true);
            //this.$emit('handleCloseEditPlayer');
          });
    },
    handleSave: function () {
      this.local_player.flpName = this.flpName;
      this.local_player.flpHandicap = this.flpHandicap;
      this.local_player.flpEmail = this.flpEmail;
      this.local_player.flpPhone = this.flpPhone;
      this.local_player.flpGsn = this.flpGsn;
      this.local_player.flpIntro = this.flpIntro;
      this.$emit('handleSave', this.local_flight);
    },
    onDecode: function (decodedString) {
      this.flpName = decodedString.substring(11, 59).trim();
      this.flpHandicap = decodedString.substring(77, 82).trim();
      this.flpGsn = decodedString.substring(83, 95).trim();
      this.flpGender = decodedString.substring(82, 83).trim();
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
