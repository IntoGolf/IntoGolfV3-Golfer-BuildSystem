<template>
  <div>
    <h5 class="q-mb-sm q-mt-sm">Inschrijven {{ match.name }}</h5>

    <q-input
      v-model="player.details.Description"
      class="q-mb-md"
      label="Opmerking"
      maxlength="40"
      type="text"
    />

    <q-select
      v-if="match.allow_select_tee == 1"
      v-model="tee"
      :options="teesArray"
      label="Tee"
      option-label="name"
      option-value="color"
    />

    <q-select
      v-if="match.timePref == 1"
      v-model="timePref"
      :options="timeArray"
      label="Start moment"
    />

    <div v-for="(pOption, index) in player.details.options" :key="index">
      <q-select
        v-model="pOption.mpoValue"
        :label="pOption.label"
        :options="optionArray"
      />
    </div>

    <q-banner
      v-if="doIHaveGuests"
      class="bg-orange text-white q-mb-md"
      inline-actions
      rounded
    >
      U kunt niet uitschrijven voor deze wedstrijd zolang u gasten heeft
      ingeschreven.
    </q-banner>

    <q-banner
      v-if="match.ideal && match.fee > 0 && mySubscription == null"
      class="bg-orange text-white q-mb-md"
      inline-actions
      rounded
    >
      Voor deze wedstrijd is betaling via iDeal vereist. Na inschrijving word u
      doorgestuurd naar de betaling. Wanneer de betaling niet wordt afgerond
      wordt u uitgeschreven.
    </q-banner>

    <q-btn-group class="mt-4" spread>
      <q-btn
        v-if="!(match.ideal && match.fee > 0) || mySubscription != null"
        color="secondary"
        label="Opslaan"
        @click="handleSubscribe"
      />
      <q-btn
        v-if="match.ideal && match.fee > 0 && mySubscription == null"
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
          timePref: 0,
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
      timePref: null,
      optionArray: [
        { value: "0", label: "Nee" },
        { value: "1", label: "ja" },
      ],
      timeArray: [
        { value: -1, label: "Vroeg" },
        { value: 0, label: "-" },
        { value: 1, label: "Laat" },
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
      this.player.details.exactHandicapAtSubscription =
        this.currentUser.relHandicap;
      this.player.details.exactHandicapForMatch = this.currentUser.relHandicap;
    }
    this.tee = this.teesArray.find(
      (tee) => tee.color == this.player.details.startingTeeId
    );
    this.timePref = this.timeArray.find(
      (time) => time.value == this.player.details.timePref
    );
  },
  watch: {
    tee: function (newValue) {
      this.player.details.startingTeeId = newValue.color;
    },
    timePref: function (newValue) {
      this.player.details.timePref = newValue.value;
    },
  },
  computed: {
    teesArray: function () {
      return this.match.baan_lus.tees.filter(
        (tee) =>
          (this.player.relation.relGender == 1 && tee.gender == "M") ||
          (this.player.relation.relGender == 2 && tee.gender == "F")
      );
    },
    doIHaveGuests: function () {
      return (
        this.match.players.filter(
          (player) =>
            player.relNrDoor == this.currentUser.relNr &&
            player.relNr != this.currentUser.relNr &&
            player.guest
        ).length > 0
      );
    },
  },
  methods: {
    handleCloseSubscribe: function () {
      this.$emit("handleCloseSubscribe");
    },

    handleSubscribe: function () {
      let that = this;

      this.player.details.relNr = this.currentUser.relNr;
      this.player.is_desktop = this.$q.platform.is.desktop === true ? 1 : 0;
      this.player.details.Bron = 2;

      this.$http.post(`golfer/event/player`, this.player).then(function (res) {
        if (res.data.url.length > 0) {
          that.id = res.data.id;
          that.url = res.data.url;
        } else {
          that.$q.notify({
            type: "positive",
            message: "Inschrijving is verwerkt",
          });

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
            .delete(`golfer/event/player`, { data: this.player })
            .then(function () {
              that.$q.notify({
                type: "positive",
                message: "Uitschrijving is verwerkt",
              });

              that.handleCloseSubscribe();
            });
        });
    },
  },
};
</script>
