<template>
  <div>
    <h5 class="q-mb-sm q-mt-sm">Inschrijven {{ match.name }}</h5>
    <template v-if="id.length === 0">
      <q-input
        v-model="player.relation.relCallName"
        :rules="[(val) => !!val || 'Voornaam is vereist']"
        label="Voornaam"
        type="text"
      />

      <q-input
        v-model="player.relation.relName"
        :rules="[(val) => !!val || 'Achternaam is vereist']"
        label="Achternaam"
        type="text"
      />

      <q-select
        v-model="player.relation.relGender"
        :options="genderArray"
        emit-value
        label="Geslacht"
        map-options
        style="height: 76px"
      />

      <q-input
        v-model="player.relation.relHandicap"
        :rules="hcpRules"
        label="Handicap"
        type="text"
      />

      <q-input
        v-model="player.relation.relGsn"
        :rules="gsnIsInvalid"
        label="GSN"
        mask="AA########"
        type="text"
      />

      <q-input
        v-model="player.relation.relEmail"
        :rules="[
          (val) =>
            reg.test(this.player.relation.relEmail) ||
            'E-mail adres is vereist',
        ]"
        label="E-mailadres"
        type="text"
      />

      <q-input
        v-model="player.relation.relPhone"
        label="Telefoonnummer"
        mask="###############"
        maxlength="15"
        style="height: 76px"
        type="text"
      />

      <q-input
        v-model="player.details.Description"
        label="Opmerking"
        maxlength="40"
        style="height: 76px"
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
        style="height: 76px"
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
          style="height: 76px"
        />
      </div>

      <q-banner
        v-if="match.ideal && aSubscription === null"
        class="bg-orange text-white q-mt-sm"
        inline-actions
        rounded
      >
        Voor deze wedstrijd is betaling via iDeal vereist. Na inschrijving word
        u doorgestuurd naar de betaling. Wanneer de betaling niet wordt afgerond
        wordt u uitgeschreven.
      </q-banner>

      <q-btn-group class="q-mt-md" spread>
        <q-btn
          v-if="!match.ideal || aSubscription !== null"
          :disabled="inValid"
          color="primary"
          label="Opslaan"
          @click="handleSubscribe"
        />
        <q-btn
          v-if="match.ideal && aSubscription === null"
          :disabled="inValid"
          color="primary"
          label="Betaal"
          @click="handleSubscribe"
        />
        <q-btn
          v-if="aSubscription !== null"
          color="primary"
          label="Uitschrijven"
          @click="handleUnSubscribe"
        />
        <q-btn color="primary" label="Sluiten" @click="handleCloseSubscribe" />
      </q-btn-group>
    </template>

    <payment
      v-else
      :id="id"
      :url="url"
      v-on:handleCloseSubscribe="handleCloseSubscribe"
    />
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
import authMixin from "../../mixins/auth";

export default {
  mixins: [authMixin],
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
          timePref: 0,
        },
        relation: {
          relNr: 0,
          relName: "",
          relCallName: "",
          relGender:
            this.match.restrictionBySex === 0 ||
            this.match.restrictionBySex === 1
              ? 1
              : 2,
          relHandicap: 54,
          relGsn: "",
          relEmail: "",
          relPhone: "",
        },
        options: [],
      },
      optionArray: [
        { value: 0, label: "Nee" },
        { value: 1, label: "ja" },
      ],
      timePref: null,
      timeArray: [
        { value: -1, label: "Vroeg" },
        { value: 0, label: "-" },
        { value: 1, label: "Laat" },
      ],
      tee: null,
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      id: "",
      url: "",
      payment: false,
    };
  },
  created() {
    if (this.aSubscription !== null) {
      this.player.details = this.aSubscription;
      this.player.relation = this.aSubscription.relation;
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
  },
  computed: {
    teesArray: function () {
      return this.match.baan_lus.tees.filter(
        (tee) =>
          (this.player.relation.relGender === 1 && tee.gender === "M") ||
          (this.player.relation.relGender === 2 && tee.gender === "F")
      );
    },
    inValid: function () {
      return (
        this.player.relation.relName.length === 0 ||
        this.player.relation.relCallName.length === 0 ||
        this.player.relation.relHandicap.length === 0 ||
        !this.reg.test(this.player.relation.relEmail)
      );
    },
    hcpRules: function () {
      let hcpMin =
        this.player.relation.relGender === 1
          ? this.match.handicapMaleMin
          : this.match.handicapFemaleMin;
      let hcpMax =
        this.player.relation.relGender === 1
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
    gsnIsInvalid: function () {
      if (
        this.player.relation.relGsn !== null &&
        this.player.relation.relGsn.length > 0
      ) {
        if (this.player.relation.relGsn.length < 10) {
          return true;
        } else if (this.player.relation.relGsn.length > 10) {
          return true;
        } else if (isNaN(parseInt(this.player.relation.relGsn.substr(2, 8)))) {
          return true;
        } else if (!/[A-Z]/.test(this.player.relation.relGsn.substr(0, 1))) {
          return true;
        } else if (!/[A-Z]/.test(this.player.relation.relGsn.substr(1, 2))) {
          return true;
        } else if (this.player.relation.relGsn === "NL00000000") {
          return true;
        }
      }
      return false;
    },
    genderArray: function () {
      let result = [];

      if (
        this.match.restrictionBySex === 0 ||
        this.match.restrictionBySex === 1
      ) {
        result.push({ value: 1, label: "Man" });
      }

      if (
        this.match.restrictionBySex === 0 ||
        this.match.restrictionBySex === 2
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

      this.player.is_desktop = this.$q.platform.is.cordova === true ? 0 : 1;
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
