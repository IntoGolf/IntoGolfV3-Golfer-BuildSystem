<template>
  <div>
    <h5>Inschrijven {{ match.name }}</h5>

    <q-select
      v-if="player.details.id == 0"
      v-model="relation"
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      label="Zoek relatie"
      :options="relations"
      option-value="relNr"
      option-label="full_name"
      @filter="filterFn"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> No results </q-item-section>
        </q-item>
      </template>
    </q-select>

    <q-input
      v-if="player.details.relNr > 0"
      v-model="player.details.relation.full_name"
      :disable="true"
      label="Standard"
    />

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
      v-if="match.ideal && aSubscription == null"
      inline-actions
      rounded
      class="bg-orange text-white"
    >
      Voor deze wedstrijd is betaling via iDeal vereist. Na inschrijving word u
      doorgestuurd naar de betaling. Wanneer de betaling niet wordt afgerond
      wordt u uitgeschreven.
    </q-banner>

    <q-btn-group spread mt-4>
      <q-btn
        v-if="!match.ideal || aSubscription != null"
        :disabled="player.details.id == 0 && relation == null"
        color="secondary"
        label="Opslaan"
        @click="handleSubscribe"
      />
      <q-btn
        v-if="match.ideal && aSubscription == null"
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
        },
        relation: {
          relNr: "demo",
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
  },
  methods: {
    handleCloseSubscribe: function () {
      this.$emit("handleCloseSubscribe");
    },

    handleSubscribe: function () {
      let that = this;

      if (this.player.details.id == 0) {
        this.player.details.relNr = this.relation.relNr;
      }

      if (this.tee) {
        this.player.details.startingTeeId = this.tee.id;
      }
      this.player.details.Bron = 2;
      this.player.is_desktop = this.$q.platform.is.desktop === true ? 1 : 0;

      this.$http
        .post(`golfer/match/subscribe`, this.player)
        .then(function (res) {
          if (res.data.url.length > 0) {
            that.id = res.data.id;
            that.url = res.data.url;
          } else {
            console.log("ok");
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
