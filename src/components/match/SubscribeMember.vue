<template>
  <div>
    <h5 class="q-mb-sm q-mt-sm">Inschrijven {{ match.name }}</h5>

    <q-select
      v-if="player.details.id == 0"
      v-model="relation"
      :option-disable="(item) => (item === null ? true : item.disabled != '')"
      :options="relations"
      class="q-mb-md"
      fill-input
      hide-selected
      hint="Wanneer de speler die u zoekt niet kan inschrijven dan wordt de speler wel weergegeven maar staat de reden dat deze speler niet kan inschrijven achter de naam"
      input-debounce="0"
      label="Zoek relatie"
      option-label="label"
      option-value="relNr"
      use-input
      @filter="filterFn"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> No results</q-item-section>
        </q-item>
      </template>
    </q-select>

    <q-input
      v-if="player.details.relNr > 0 && player.details.relation"
      v-model="player.details.relation.full_name"
      :disable="true"
      label="Standard"
    />

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
      class="q-mb-md"
      hint="Selecteer de gewenste tee"
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

    <div
      v-for="(pOption, index) in player.details.options"
      :key="index"
      class="q-mb-md"
    >
      <q-select
        v-model="pOption.mpoValue"
        :label="pOption.label"
        :options="optionArray"
      />
    </div>

    <q-banner
      v-if="match.ideal && aSubscription == null"
      class="bg-orange text-white"
      inline-actions
      rounded
    >
      Voor deze wedstrijd is betaling via iDeal vereist. Na inschrijving word u
      doorgestuurd naar de betaling. Wanneer de betaling niet wordt afgerond
      wordt u uitgeschreven.
    </q-banner>

    <q-btn-group class="q-mt-md" spread>
      <q-btn
        v-if="!(match.ideal && match.fee > 0) || mySubscription != null"
        :disabled="player.details.id == 0 && relation == null"
        color="secondary"
        label="Opslaan"
        @click="handleSubscribe"
      />
      <q-btn
        v-if="match.ideal && match.fee > 0 && mySubscription == null"
        :disabled="player.details.id == 0 && relation == null"
        color="secondary"
        label="Betaal"
        @click="handleSubscribe"
      />
      <q-btn
        v-if="aSubscription != null"
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
  props: ["match", "aSubscription"],
  data() {
    return {
      player: {
        type: 2, //1: me, 2:member, 3:guest
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
          relNr: null,
          relName: "demo",
          relCallName: "test",
          relGender: 1,
          relHandicap: 54,
          relEmail: "demo@intogolf.nl",
          relPhone: "0612345678",
        },
        options: [],
      },
      optionArray: [
        { value: 0, label: "Nee" },
        { value: 1, label: "ja" },
      ],
      tee: null,
      timePref: null,
      timeArray: [
        { value: -1, label: "Vroeg" },
        { value: 0, label: "-" },
        { value: 1, label: "Laat" },
      ],
      relation: null,
      relations: [],
      currentUser: Object.assign(this.$ls.getItem("currentUser")),
      id: "",
      url: "",
      payment: false,
    };
  },
  created() {
    if (this.aSubscription != null) {
      this.player.details = this.aSubscription;
    } else {
      this.player.details.matchId = this.match.id;
      this.player.details.relNrDoor = this.currentUser.relNr;
      this.player.details.options = { ...this.match.options };
    }
    this.tee = this.teesArray.find(
      (tee) => tee.color === this.player.details.startingTeeId
    );
    this.timePref = this.timeArray.find(
      (time) => time.value === this.player.details.timePref
    );
  },
  watch: {
    timePref: function (newValue) {
      this.player.details.timePref = newValue.value;
    },
    relation: function (newValue) {
      this.player.details.startingTeeId = newValue.relGender === 1 ? 8 : 14;
      this.tee = this.teesArray.find(
        (tee) => tee.color === this.player.details.startingTeeId
      );
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
  },
  methods: {
    handleCloseSubscribe: function () {
      this.$emit("handleCloseSubscribe");
    },

    handleSubscribe: function () {
      let that = this;

      if (this.player.details.id == 0) {
        this.player.details.relNr = this.relation.relNr;
        this.player.relation.relNr = this.relation.relNr;
      }

      if (this.tee) {
        this.player.details.startingTeeId = this.tee.id;
      }
      this.player.details.Bron = 2;
      this.player.is_desktop = this.$q.platform.is.desktop === true ? 1 : 0;

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

    async filterFn(val, update, abort) {
      if (val == undefined || val.length < 2) {
        return;
      }

      let that = this;
      await this.$http
        .get(`golfer/relation/${this.match.id}/search/${val}`)
        .then((response) => {
          update(() => {
            that.relations = response;
          });
        });
    },
  },
};
</script>
