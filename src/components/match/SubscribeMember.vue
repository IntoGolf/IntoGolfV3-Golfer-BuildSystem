<template>
  <div>
    <template v-if="id.length === 0">
      <q-select
        v-if="player.details.id === null"
        v-model="relation"
        :option-disable="
          (item) => (item === null ? true : item.disabled !== '')
        "
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
        @filter="handleFilter"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">Geen uitslag</q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-input
        v-if="player.details.relNr > 0 && player.details.relation"
        v-model="player.details.relation.full_name2"
        :disable="true"
        class="q-mb-md"
        label="Naam"
      />

      <q-input
        v-model="player.details.Description"
        class="q-mb-md"
        label="Opmerking"
        maxlength="40"
        type="text"
      />

      <subscribe-flight
        v-if="
          match.subscribeToFlight === 1 &&
          match.flights.length > 0 &&
          player.details.id === null
        "
        :aSubscription="aSubscription"
        :match="match"
        :player="player"
        v-on:handleSetParty="handleSetParty"
      />

      <q-select
        v-if="match.allow_select_tee === 1"
        v-model="tee"
        :options="teesArray"
        class="q-mb-md"
        hint="Selecteer de gewenste tee"
        label="Tee"
        option-label="name"
        option-value="color"
      />

      <q-select
        v-if="match.timePref === 1"
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
        v-if="match.ideal && aSubscription === null"
        class="bg-orange text-white"
        inline-actions
        rounded
      >
        Voor deze wedstrijd is betaling via iDeal vereist. Na inschrijving word
        u doorgestuurd naar de betaling. Wanneer de betaling niet wordt afgerond
        wordt u uitgeschreven.
      </q-banner>

      <!--    <q-select-->
      <!--      v-if="match.ideal == 1 && match.fee > 0 && aSubscription === null"-->
      <!--      v-model="player.bank"-->
      <!--      :options="match.iDealIssuers"-->
      <!--      class="q-mb-md"-->
      <!--      hint="Selecteer uw bank"-->
      <!--      label="Uw bank"-->
      <!--      option-label="name"-->
      <!--      option-value="id"-->
      <!--    />-->

      <q-btn-group class="q-mt-md" spread>
        <q-btn
          v-if="!match.ideal || player.details.opmStatus === 'paid'"
          :disabled="player.details.id === null && relation === null"
          color="primary"
          label="Opslaan"
          @click="handleSubscribe"
        />
        <q-btn
          v-else-if="match.ideal && match.fee > 0"
          :disabled="player.details.id === null && relation === null"
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
    ></payment>
  </div>
</template>

<script>
import payment from "./payment";
import authMixin from "../../mixins/auth";
import SubscribeFlight from "components/match/SubscribeFlight.vue";

export default {
  mixins: [authMixin],
  components: {
    SubscribeFlight,
    payment,
  },
  props: {
    match: Object,
    aSubscription: Object,
  },
  data() {
    return {
      flight: null,
      player: {
        type: 2, //1: me, 2:member, 3:guest
        details: {
          id: null,
          matchId: null,
          partyId: null,
          relNr: null,
          relNrDoor: null,
          exactHandicapAtSubscription: 54,
          exactHandicapForMatch: 54,
          Description: "",
          startingTeeId: null,
          Bron: 2,
          timePref: 0,
          Status: 1,
          relation: {
            relNr: null,
            relName: "",
            relCallName: "",
            relGender: 1,
            relHandicap: 54,
            relEmail: "",
            relPhone: "",
          },
          options: [],
        },
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
      id: "",
      url: "",
      payment: false,
    };
  },
  created() {
    if (this.aSubscription !== null) {
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
    this.debouncedFetchData = this.debounce(this.fetchData, 300);
  },
  watch: {
    tee: function (newValue) {
      this.player.details.startingTeeId = newValue.color;
    },
    timePref: function (newValue) {
      this.player.details.timePref = newValue.value;
    },
    relation: function (newValue) {
      this.player.details.relNr = newValue.relNr;
      this.player.details.relation = newValue;
      this.player.details.startingTeeId =
        newValue.relGender === 1
          ? this.match.startingTeeId
          : this.match.startingTeeForWomenId;

      this.tee = this.teesArray.find(
        (tee) => tee.color === this.player.details.startingTeeId
      );
    },
  },
  computed: {
    teesArray: function () {
      return this.match.baan_lus.tees.filter(
        (tee) =>
          (this.player.details.relation.relGender === 1 &&
            tee.gender === "M") ||
          (this.player.details.relation.relGender === 2 && tee.gender === "F")
      );
    },
  },
  methods: {
    handleSetParty(player) {
      this.player = player;
    },
    handleCloseSubscribe: function () {
      this.$emit("handleCloseSubscribe");
    },

    handleSubscribe: function () {
      let that = this;

      this.player.is_desktop = this.$q.platform.is.cordova === true ? 0 : 1;

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
    beforeDestroy() {
      clearTimeout(this.debounceTimeout);
    },
    debounce(func, wait) {
      let timeout;

      return (...args) => {
        const later = () => {
          clearTimeout(timeout);
          func.apply(this, args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    async fetchData(searchQuery) {
      if (searchQuery === undefined || searchQuery.length < 2) {
        return;
      }

      // Your AJAX call logic here
      try {
        this.relations = await this.$http.get(
          `golfer/relation?search=${searchQuery}&id=${this.match.id}`
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle errors appropriately
      }
    },
    handleFilter(val, update) {
      update(() => {
        if (val) {
          this.debouncedFetchData(val);
        } else {
          this.options = [];
        }
      });
    },
  },
};
</script>
