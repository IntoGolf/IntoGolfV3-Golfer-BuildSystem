<template>
  <div>
    <h5>Inschrijven {{ match.name }}</h5>

    <q-input
      v-model="player.details.Description"
      type="text"
      label="Opmerking"
    />

    <q-select
      v-if="match.allow_select_tee == 1"
      v-model="tee"
      :options="teesArray"
      hint="Selecteer uw tee"
      label="Tee"
    />

    <div v-for="(pOption, index) in player.details.options" :key="index">
      <q-select
        v-model="pOption.mpoValue"
        :options="optionArray"
        :label="pOption.label"
      />
    </div>

    <q-banner
      v-if="doIHaveGuests"
      inline-actions
      rounded
      class="bg-orange text-white"
    >
      U kunt niet uitschrijven voor deze wedstrijd zolang u gasten heeft
      ingeschreven.
    </q-banner>

    <q-banner
      v-if="match.ideal && mySubscription == null"
      inline-actions
      rounded
      class="bg-orange text-white"
    >
      Voor deze wedstrijd is betaling via iDeal vereist. Na inschrijving word u
      doorgestuurd naar de betaling. Wanneer de betaling niet wordt afgerond
      wordt u uitgeschreven.
    </q-banner>

    <q-btn-group spread class="mt-4">
      <q-btn
        v-if="!match.ideal || mySubscription != null"
        color="secondary"
        label="Opslaan"
        @click="handleSubscribe"
      />
      <q-btn
        v-if="match.ideal && mySubscription == null"
        color="secondary"
        label="Betaal"
        @click="handleSubscribe"
      />
      <q-btn
        v-if="mySubscription != null"
        :disabled="doIHaveGuests"
        color="secondary"
        label="Uitschrijven"
        @click="handleUnSubscribe"
      />
      <q-btn color="secondary" label="Sluiten" @click="handleCloseSubscribe" />
    </q-btn-group>

    <payment
      v-if="id.length > 0"
      :id="id"
      :url="url"
      v-on:handleCloseSubscribe="handleCloseSubscribe"
    ></payment>
  </div>
</template>

<script>
import payment from "./payment";

export default {
  components: {
    payment,
  },
  props: ["match", "mySubscription"],
  data() {
    return {
      player: {
        type: 1, //1: me, 2:member, 3:guest
        details: {
          id: 0,
          matchId: 0,
          relNr: 0,
          relNrDoor: 0,
          exactHandicapAtSubscription: 54,
          exactHandicapForMatch: 54,
          Description: "",
          startingTeeId: 0,
          Bron: 2,
        },
        relation: {
          relName: "demo",
          relCallName: "test",
          relGender: 1,
          relHandicap: 54,
          relEmail: "demo@intogolf.nl",
          relPhone: "0612345678",
        },
        options: [],
      },
      tee: null,
      optionArray: [
        { value: 0, label: "Nee" },
        { value: 1, label: "ja" },
      ],
      currentUser: Object.assign(this.$ls.getItem("currentUser")),
      id: "",
      url: "",
      payment: false,
    };
  },
  created() {
    if (this.mySubscription != null) {
      this.player.details = this.mySubscription;
    } else {
      this.player.details.matchId = this.match.id;
      this.player.details.relNr = this.currentUser.relNr;
      this.player.details.relNrDoor = this.currentUser.relNr;
      this.player.details.options = { ...this.match.options };
    }
    this.tee = this.defaultTee;
  },
  computed: {
    teesArray: function () {
      let that = this;
      let array = [];
      this.match.baan_lus.baan_lus_tees.forEach(function (tee) {
        if (
          (that.player.relation.relGender == 1 &&
            tee.baan_lus_tee_soort.Geslacht == "M") ||
          (that.player.relation.relGender == 2 &&
            tee.baan_lus_tee_soort.Geslacht == "V")
        ) {
          array.push({
            id: tee.bltId,
            label: tee.baan_lus_tee_soort.Achtergrond,
          });
        }
      });
      return array;
    },
    defaultTee: function () {
      let that = this;
      let result = null;

      if (this.player.details.startingTeeId > 0) {
        that.teesArray.forEach(function (tee) {
          if (tee.id == that.player.details.startingTeeId) {
            result = tee;
          }
        });
      }

      if (result == null) {
        result = this.teesArray[0];
      }

      return result;
    },
    doIHaveGuests: function () {
      let that = this;
      let count = 0;
      this.match.players.forEach(function (player) {
        if (
          player.relNrDoor == that.currentUser.relNr &&
          player.relNr != that.currentUser.relNr &&
          player.relation.relGrpNr1 == null
        ) {
          count++;
        }
      });
      return count > 0;
    },
  },
  methods: {
    handleCloseSubscribe: function () {
      this.$emit("handleCloseSubscribe");
    },

    handleSubscribe: function () {
      let that = this;

      if (this.tee) {
        this.player.details.startingTeeId = this.tee.id;
      }
      this.player.is_desktop = this.$q.platform.is.desktop === true ? 1 : 0;
      this.player.details.Bron = 2;

      this.$http
        .post(`golfer/match/subscribe`, this.player)
        .then(function (res) {
          if (res.data.url.length > 0) {
            that.id = res.data.id;
            that.url = res.data.url;
          } else {
            that.$message.success("Inschrijving is verwerkt");
            that.handleCloseSubscribe();
          }
        });
    },

    handleUnSubscribe: function () {
      let that = this;

      this.$q
        .dialog({
          title: "Wedstrijd deelname annuleren",
          message: "Wilt u doorgaan??",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.$http
            .post(`golfer/match/unsubscribe`, this.player)
            .then(function () {
              that.$message.success("Uitschrijving is verwerkt");
              that.handleCloseSubscribe();
            });
        });
    },
  },
};
</script>
