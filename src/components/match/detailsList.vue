<template>
  <div>
    <div class="row">
      <div class="col text-h6">Details {{ match.name }}</div>
    </div>

    <q-separator />

    <div class="row q-pb-sm q-pt-sm">
      <div class="col text-bold">Datum</div>

      <div class="col overflow-hidden text-right">
        {{ $dayjs(match.playingDate).format("dddd D MMM") }}
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col text-bold">Tijd</div>

      <div class="col overflow-hidden text-right">
        {{ $dayjs(match.startingTime, "HH:mm:ss").format("HH:mm") }}
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col text-bold">Wedstrijdleider 1</div>

      <div class="col overflow-hidden text-right">
        {{ commissionner1 }}
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col text-bold">Wedstrijdleider 2</div>

      <div class="col overflow-hidden text-right">
        {{ commissionner2 }}
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col text-bold">Soort score</div>

      <div class="col overflow-hidden text-right">
        {{ match.match_scoring_type.name }}
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col text-bold">Soort wedstrijd</div>

      <div class="col overflow-hidden text-right">
        {{ match.match_type.name }}
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col text-bold">Lus</div>

      <div class="col overflow-hidden text-right">
        {{ match.baan_lus.name }}
      </div>
    </div>

    <div v-if="match.UitslagenGereed !== 1 && match.StartlijstGereed !== 1">
      <div class="row q-pb-sm">
        <div class="col text-bold">Inschrijfgeld</div>

        <div class="col overflow-hidden text-right">
          {{ $filters.money(match.fee) }}
        </div>
      </div>

      <div v-if="match.LidAddGuest === 1" class="row q-pb-sm">
        <div class="col text-bold">Inschrijfgeld gast</div>

        <div class="col overflow-hidden text-right">
          {{ $filters.money(match.feeGuest) }}
        </div>
      </div>

      <div v-if="match.additionalSubscriptionInfo !== null" class="row q-pb-sm">
        <div class="col text-bold">Extra informatie</div>

        <div class="col overflow-hidden text-right">
          {{ match.additionalSubscriptionInfo }}
        </div>
      </div>

      <div class="row q-pb-sm">
        <div class="col text-bold">Start inschrijf</div>

        <div class="col overflow-hidden text-right">
          {{
            $dayjs(match.StartDatumTGInschrijven).format("ddd DD MMMM HH:mm")
          }}
        </div>
      </div>

      <div class="row q-pb-sm">
        <div class="col text-bold">Eind inschrijf</div>

        <div class="col overflow-hidden text-right">
          {{ $dayjs(match.subscriptionDeadline).format("ddd DD MMMM HH:mm") }}
        </div>
      </div>

      <div v-if="specialRules.length > 0" class="row q-pb-sm">
        <div class="col">
          <q-banner class="bg-orange text-white" inline-actions rounded>
            {{ specialRules }}
          </q-banner>
        </div>
      </div>
    </div>

    <q-btn-group
      v-if="
        match.UitslagenGereed !== 1 &&
        match.StartlijstGereed !== 1 &&
        match.InschrijvenInternet === 1
      "
      spread
    >
      <q-btn
        v-if="
          openForSubscription &&
          mySubscription === null &&
          specialRules.length === 0
        "
        color="primary"
        label="Inschrijven"
        @click="handleSubscribe"
      />

      <q-btn
        v-if="
          openForSubscription &&
          mySubscription !== null &&
          specialRules.length === 0 &&
          match.StartlijstGereed !== 1
        "
        color="primary"
        label="Mijn inschrijving"
        @click="handleSubscribe"
      />
    </q-btn-group>

    <q-btn-group class="q-mt-md" spread>
      <q-btn
        v-if="inScorecardWindow && mySubscription !== null"
        color="primary"
        label="Score invoeren"
        @click="handleEnterScore"
      />
    </q-btn-group>

    <div
      v-if="
        match.InschrijvenInternet === 1 &&
        match.LidAddGuest === 1 &&
        match.UitslagenGereed !== 1 &&
        openForSubscription &&
        specialRules.length === 0 &&
        match.StartlijstGereed !== 1
      "
      class="pt-2 pb-1"
    >
      <div class="row q-mt-sm">
        <div class="col text-h6">Gasten meenemen</div>
      </div>

      <q-separator />

      <div class="row q-mt-sm q-mb-sm">
        <div class="col">
          Voor deze wedstrijd is het toegestaan dat leden gasten meenemen. U
          kunt uw gast hier inschrijven. U bent verantwoordelijk voor de
          deelname van uw gast. U kunt uw gast inschrijven nadat u zelf bent
          ingeschreven.
        </div>
      </div>

      <div class="row mt-2">
        <div class="col">
          <q-btn
            :disabled="mySubscription === null"
            class="full-width"
            color="primary"
            label="Gast inschrijven"
            @click="handleSubscribeGuest"
          />
        </div>
      </div>
    </div>

    <div
      v-if="
        match.InschrijvenInternet === 1 &&
        match.UitslagenGereed !== 1 &&
        openForSubscription &&
        match.StartlijstGereed !== 1
      "
      class="pt-2"
    >
      <div class="row q-mt-sm">
        <div class="col text-h6">Lid inschrijven</div>
      </div>

      <q-separator />

      <div class="row q-mt-sm q-mb-sm">
        <div class="col">
          Voor deze wedstrijd is het toegestaan dat u andere leden inschrijft. U
          bent verantwoordelijk voor de deelname van de door u ingeschreven
          leden.
        </div>
      </div>

      <div class="row q-mb-md">
        <div class="col">
          <q-btn
            :disable="fullTeam"
            :label="
              (match.teamSize > 1 ? 'Team inschrijven' : 'Lid inschrijven') +
              (fullTeam ? ' (uw team is compleet)' : '')
            "
            class="full-width"
            color="primary"
            @click="handleSubscribeMember"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import authMixin from "../../mixins/auth";

export default {
  mixins: [authMixin],
  props: {
    match: Object,
    mySubscription: Object,
  },
  data() {
    return {};
  },
  computed: {
    fullTeam: function () {
      if (this.match.teamSize === 1) {
        return false;
      }
      return this.myPlayers.length === this.match.teamSize;
    },
    hasTeamMembers: function () {
      if (this.match.teamSize === 1) {
        return false;
      }
      return this.myPlayers.length > 1;
    },
    myPlayers: function () {
      return this.match.players.filter(
        (player) => player.relNrDoor === this.currentUser.relNr
      );
    },
    commissionner1: function () {
      let result = "";
      if (
        this.match.commissioner1Name !== null &&
        this.match.commissioner1Name.length > 0
      ) {
        result = this.match.commissioner1Name;
        if (
          this.match.commissioner1Phone !== null &&
          this.match.commissioner1Phone.length > 0
        ) {
          result += " (" + this.match.commissioner1Phone + ")";
        }
      }
      return result;
    },
    commissionner2: function () {
      let result = "";
      if (
        this.match.commissioner2Name !== null &&
        this.match.commissioner2Name.length > 0
      ) {
        result = this.match.commissioner2Name;
        if (
          this.match.commissioner2Phone !== null &&
          this.match.commissioner2Phone.length > 0
        ) {
          result += " (" + this.match.commissioner2Phone + ")";
        }
      }
      return result;
    },
    openForSubscription: function () {
      let startDate = this.$dayjs(this.match.StartDatumTGInschrijven);
      let endDate = this.$dayjs(this.match.subscriptionDeadline);
      return this.$dayjs().isBetween(startDate, endDate);
    },

    inScorecardWindow: function () {
      let startDate = this.$dayjs(
        this.match.playingDate + " " + this.match.startingTime
      );
      return (
        this.mySubscription !== null &&
        this.$dayjs() > startDate &&
        this.$dayjs() < startDate.add(6, "hours") &&
        this.match.UitslagenGereed !== 1
      );
    },

    specialRules: function () {
      if (
        this.match.restrictionBySex !== 0 &&
        this.match.restrictionBySex !== parseInt(this.currentUser.relGender)
      ) {
        return (
          "Dit is een wedstrijd voor " +
          (this.match.restrictionBySex === 1 ? "heren" : "dames") +
          " u kunt niet inschrijven,"
        );
      }

      if (
        this.currentUser.age < this.match.Min_Age ||
        this.currentUser.relHandicap > this.match.Max_Age
      ) {
        return (
          "Voor deze wedstrijd is een restrictie op leeftijd van kracht, de minimale leeftijd voor deelname is " +
          this.match.Min_Age +
          " en de maximale leeftijd is " +
          this.match.Max_Age
        );
      }

      if (
        this.currentUser.relHandicap < this.match.handicapFemaleMin ||
        this.currentUser.relHandicap > this.match.handicapFemaleMax
      ) {
        return (
          "Voor deze wedstrijd is een restrictie op handicap van kracht, de minimale handicap voor deelname is " +
          this.match.handicapFemaleMin +
          " en de maximale handicap is " +
          this.match.handicapFemaleMax
        );
      }

      return "";
    },
  },
  methods: {
    handleSubscribe: function () {
      this.$emit("handleSubscribe");
    },

    handleCloseSubscribe: function () {
      this.$emit("handleCloseSubscribe");
    },

    handleEnterScore: function () {
      this.$emit("handleEnterScore", this.mySubscription);
    },

    handleSubscribeGuest: function () {
      this.$emit("handleSubscribeGuest", null);
    },

    handleSubscribeMember: function () {
      this.$emit("handleSubscribeMember", null);
    },
  },
};
</script>
