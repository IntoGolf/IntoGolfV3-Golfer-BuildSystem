<template>
  <div>
    <div
      v-if="match.maximumNumberOfPlayers <= match.players.length"
      class="row q-pb-sm q-pt-sm text-center"
    >
      <div
        class="col text-bold text-center text-red-4"
        style="font-size: 18px; font-variant-caps: all-small-caps"
      >
        wedstrijd is vol
      </div>
    </div>

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
      <div class="col text-bold">Qualifying</div>

      <div class="col overflow-hidden text-right">
        {{ match.isQualifying === 1 ? "Ja" : "Nee" }}
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col text-bold">Max. deelnemers</div>

      <div class="col overflow-hidden text-right">
        {{ match.maximumNumberOfPlayers }}
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col text-bold">Aantal deelnemers</div>

      <div class="col overflow-hidden text-right">
        {{ match.players.length }}
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col text-bold">Wedstrijdleider 1</div>

      <div class="col overflow-hidden text-right">
        {{ commissionner1 ? commissionner1 : "-" }}
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col text-bold">Wedstrijdleider 2</div>

      <div class="col overflow-hidden text-right">
        {{ commissionner2 ? commissionner2 : "-" }}
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
      <div class="col text-bold">Geslacht</div>

      <div
        v-show="match.restrictionBySex === 0"
        class="col overflow-hidden text-right"
      >
        Dames & heren
      </div>
      <div
        v-show="match.restrictionBySex === 1"
        class="col overflow-hidden text-right"
      >
        Heren
      </div>
      <div
        v-show="match.restrictionBySex === 2"
        class="col overflow-hidden text-right"
      >
        Dames
      </div>
    </div>

    <div v-show="match.restrictionBySex !== 1" class="row q-pb-sm">
      <div class="col text-bold">Handicap dames</div>

      <div class="col overflow-hidden text-right">
        Max. {{ match.handicapFemaleMax }} / Min. {{ match.handicapFemaleMin }}
      </div>
    </div>

    <div v-show="match.restrictionBySex !== 2" class="row q-pb-sm">
      <div class="col text-bold">Handicap heren</div>

      <div class="col overflow-hidden text-right">
        Max. {{ match.handicapMaleMax }} / Min. {{ match.handicapMaleMin }}
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col text-bold">Lus</div>

      <div class="col overflow-hidden text-right">
        {{ match.baan_lus.name }}
      </div>
    </div>

    <div v-if="match.UitslagenGereed !== 1">
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

      <div class="row q-pb-sm">
        <div class="col text-bold">Start inschrijven</div>

        <div class="col overflow-hidden text-right">
          {{
            $dayjs(match.StartDatumTGInschrijven).format("ddd DD MMMM HH:mm")
          }}
        </div>
      </div>

      <div class="row q-pb-sm">
        <div class="col text-bold">Eind inschrijven</div>

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

    <div v-if="match.additionalSubscriptionInfo !== null" class="row q-pb-sm">
      <div class="col text-bold">Extra informatie:</div>
      {{ match.additionalSubscriptionInfo }}
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
        v-if="canSubscribe"
        color="primary"
        label="Inschrijven"
        @click="handleSubscribe"
      />

      <q-btn
        v-else-if="openPayment"
        color="primary"
        label="Open betaling"
        @click="finishPayment"
      />

      <q-btn
        v-else-if="editableSubscription"
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
              match.teamSize > 1 && match.teammatch === 1
                ? 'Team inschrijven'
                : 'Lid inschrijven'
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
    playersOnMatch() {
      return this.match.players.filter((player) => player.status === 0);
    },
    playersOnReserve() {
      return this.match.players.filter((player) => player.status === 2);
    },
    canSubscribe() {
      return (
        this.openForSubscription &&
        this.mySubscription === null &&
        this.specialRules.length === 0
      );
    },
    openPayment() {
      return (
        this.mySubscription !== null && this.mySubscription.opmStatus === "open"
      );
    },
    editableSubscription() {
      return (
        this.openForSubscription &&
        this.mySubscription !== null &&
        this.specialRules.length === 0 &&
        this.match.StartlijstGereed !== 1
      );
    },
    fullTeam: function () {
      if (this.match.teamSize === 1 || this.match.teammatch !== 1) {
        return false;
      }
      if (this.match.teammatch === 1 && this.mySubscription === null) {
        return true;
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
        (this.mySubscription.positionInParty === 1 ||
          [10, 11, 12].includes(this.match.matchTypeId)) &&
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
        this.currentUser.age > this.match.Max_Age
      ) {
        return (
          "Voor deze wedstrijd is een restrictie op leeftijd van kracht, de minimale leeftijd voor deelname is " +
          this.match.Min_Age +
          " en de maximale leeftijd is " +
          this.match.Max_Age
        );
      }

      if (
        this.currentUser.relGender == 1 &&
        (this.currentUser.relHandicap < this.match.handicapMaleMin ||
          this.currentUser.relHandicap > this.match.handicapMaleMax)
      ) {
        return (
          "Voor deze wedstrijd is een restrictie op handicap van kracht, de minimale handicap voor deelname is " +
          this.match.handicapMaleMin +
          " en de maximale handicap is " +
          this.match.handicapMaleMax
        );
      }

      if (
        this.currentUser.relGender == 2 &&
        (this.currentUser.relHandicap < this.match.handicapFemaleMin ||
          this.currentUser.relHandicap > this.match.handicapFemaleMax)
      ) {
        return (
          "Voor deze wedstrijd is een restrictie op handicap van kracht, de minimale handicap voor deelname is " +
          this.match.handicapFemaleMin +
          " en de maximale handicap is " +
          this.match.handicapFemaleMax
        );
      }

      if (
        this.match.MatchRelationGroups.length > 0 &&
        !this.match.MatchRelationGroups.find(
          (grp) => grp.mgrGrpNr === this.currentUser.relation_group.grpNr
        )
      ) {
        return "U kunt niet inschrijven op deze wedstrijd.";
      }

      return "";
    },
  },
  methods: {
    async finishPayment() {
      const res = await this.$http.get(`golfer/event/payment/` + this.match.id);
      this.$emit("handlePayment", res.data);
    },
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
