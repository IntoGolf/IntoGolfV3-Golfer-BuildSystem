<template>
  <div>
    <h5 class="q-mb-sm q-mt-sm">Inschrijven {{ match.name }}</h5>

    <q-input
      v-model="player.relation.relCallName"
      type="text"
      :rules="[(val) => !!val || 'Voornaam is vereist']"
      label="Voornaam"
    />

    <q-input
      v-model="player.relation.relName"
      type="text"
      :rules="[(val) => !!val || 'Achternaam is vereist']"
      label="Achternaam"
    />

    <q-select
      v-model="player.relation.relGender"
      :options="genderArray"
      emit-value
      map-options
      label="Geslacht"
    />

    <q-input
      v-model="player.relation.relHandicap"
      type="text"
      :rules="hcpRules"
      label="Handicap"
    />

    <q-input
      v-model="player.relation.relEmail"
      type="text"
      :rules="[
        (val) =>
          reg.test(this.player.relation.relEmail) || 'E-mail adres is vereist',
      ]"
      label="E-mailadres"
    />

    <q-input
      v-model="player.relation.relPhone"
      type="text"
      label="Telefoonnummer"
    />

    <hr />

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
      class="bg-orange text-white mt-2"
    >
      Voor deze wedstrijd is betaling via iDeal vereist. Na inschrijving word u
      doorgestuurd naar de betaling. Wanneer de betaling niet wordt afgerond
      wordt u uitgeschreven.
    </q-banner>

    <q-btn-group spread class="mt-4">
      <q-btn
        v-if="!match.ideal"
        :disabled="inValid"
        color="secondary"
        label="Opslaan"
        @click="handleSubscribe"
      />
      <q-btn
        v-if="match.ideal && aSubscription == null"
        :disabled="inValid"
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

<style lang="scss" scoped>
.row {
  margin-left: 0px;
  margin-right: 0px;
}

.itg-text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.itg-q-item {
  background-color: white;
  margin-bottom: 10px;
  border: 1px solid lightgrey;
}
</style>

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
        type: 3, //1: me, 2:member, 3:guest
        details: {
          id: 0,
          matchId: 0,
          relNr: null,
          relNrDoor: 0,
          exactHandicapAtSubscription: 54,
          exactHandicapForMatch: 54,
          Description: "",
          startingTeeId: 0,
          Bron: 2,
        },
        relation: {
          relNr: 0,
          relName: "demo",
          relCallName: "test",
          relGender:
            this.match.restrictionBySex == 0 || this.match.restrictionBySex == 1
              ? 1
              : 2,
          relHandicap: 54,
          relEmail: "demo3414234234@intogolf.nl",
          relPhone: "0612345678",
        },
        options: [],
      },
      optionArray: [
        { value: 0, label: "Nee" },
        { value: 1, label: "ja" },
      ],
      tee: null,
      currentUser: Object.assign(this.$ls.getItem("currentUser")),
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      id: "",
      url: "",
      payment: false,
    };
  },
  created() {
    if (this.aSubscription != null) {
      this.player.details = this.aSubscription;
      this.player.relation = this.aSubscription.relation;
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
            id: tee.bltCategory,
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
    inValid: function () {
      return (
        this.player.relation.relName.length == 0 ||
        this.player.relation.relCallName.length == 0 ||
        this.player.relation.relHandicap.length == 0 ||
        !this.reg.test(this.player.relation.relEmail)
      );
    },
    hcpRules: function () {
      let hcpMin =
        this.player.relation.relGender == 1
          ? this.match.handicapMaleMin
          : this.match.handicapFemaleMin;
      let hcpMax =
        this.player.relation.relGender == 1
          ? this.match.handicapMaleMax
          : this.match.handicapFemaleMax;
      return [
        (val) => (val !== null && val !== "") || "Handicap is vereist",
        (val) =>
          (val >= hcpMin && val <= hcpMax) ||
          "Voer een geldige handicap in voor deze wedstrijd max:" +
            hcpMin +
            " min:" +
            hcpMax,
      ];
    },
    genderArray: function () {
      let result = [];

      if (
        this.match.restrictionBySex == 0 ||
        this.match.restrictionBySex == 1
      ) {
        result.push({ value: 1, label: "Man" });
      }

      if (
        this.match.restrictionBySex == 0 ||
        this.match.restrictionBySex == 2
      ) {
        result.push({ value: 2, label: "Vrouw" });
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
            that.$q.notify ({
              type: 'positive',
              message: 'Inschrijving is verwerkt'
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
            .post(`golfer/match/unsubscribe`, this.player)
            .then(function () {

              that.$q.notify ({
                type: 'positive',
                message: 'Uitschrijving is verwerkt'
              });

              that.handleCloseSubscribe();
            });
        });
    },
  },
};
</script>
