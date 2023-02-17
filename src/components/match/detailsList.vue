<template>
  <div>
    <div class="row">
      <div class="col text-h6">Details {{ match.name }}</div>
    </div>

    <q-separator/>

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
      <div class="col text-bold">Soort</div>

      <div class="col overflow-hidden text-right">
        {{ match.match_type.name }}
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col text-bold">Lus</div>

      <div class="col overflow-hidden text-right">
<!--        {{ // match.baan_lus.bnlName }}-->
      </div>
    </div>

    <div class="row q-pb-sm">
      <div class="col text-bold">Inschrijfgeld</div>

      <div class="col overflow-hidden text-right">
        {{ $filters.money(match.fee) }}
      </div>
    </div>

    <div v-if="match.LidAddGuest == 1" class="row q-pb-sm">
      <div class="col text-bold">Inschrijfgeld gast</div>

      <div class="col overflow-hidden text-right">
        {{ $filters.money(match.feeGuest) }}
      </div>
    </div>

    <div v-if="specialRules.length > 0" class="row q-pb-sm">
      <div class="col">
        <q-banner inline-actions rounded class="bg-orange text-white">
          {{ specialRules }}
        </q-banner>
      </div>
    </div>

    <q-btn-group spread v-if="match.UitslagenGereed != 1 && match.StartlijstGereed == 1">
      <q-btn
          v-if="
          openForSubscription &&
          mySubscription == null &&
          specialRules.length == 0
        "
          color="secondary"
          label="Inschrijven"
          @click="handleSubscribe"
      />

      <q-btn
          v-if="
          openForSubscription &&
          mySubscription != null &&
          specialRules.length == 0  &&
          match.StartlijstGereed != 1
        "
          color="secondary"
          label="Mijn inschrijving"
          @click="handleSubscribe"
      />

      <q-btn
          v-if="mySubscription != null"
          :disable="mySubscription.match_score == null || !$dayjs(match.playingDate).isToday()"
          color="secondary"
          label="Score invoeren"
          @click="handleEnterScore"
      />
    </q-btn-group>

    <q-btn-group spread>
      <q-btn
          v-if="inScorecardWindow && mySubscription != null"
          color="secondary"
          label="Score invoeren"
          @click="handleEnterScore"
      />
    </q-btn-group>

    <div
        v-if="
        match.LidAddGuest == 1 &&
        match.UitslagenGereed != 1 &&
        openForSubscription &&
        specialRules.length == 0 &&
        match.StartlijstGereed != 1
      "
        class="pt-2 pb-1"
    >
      <div class="row q-mt-sm">
        <div class="col text-h6">Gasten meenemen</div>
      </div>

      <q-separator/>

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
              color="secondary"
              class="full-width"
              label="Gast inschrijven"
              :disabled="mySubscription == null"
              @click="handleSubscribeGuest"
          />
        </div>
      </div>
    </div>

    <div v-if="match.UitslagenGereed != 1 && openForSubscription && match.StartlijstGereed != 1" class="pt-2">
      <div class="row q-mt-sm">
        <div class="col text-h6">Lid inschrijven</div>
      </div>

      <q-separator/>

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
              color="secondary"
              class="full-width"
              label="Lid inschrijven"
              @click="handleSubscribeMember"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    match: Object,
    mySubscription: Object,
    currentUser: Object
  },
  data() {
    return {};
  },
  computed: {
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
          this.match.UitslagenGereed != 1
      );
    },

    specialRules: function () {
      if (
          this.match.restrictionBySex != 0 &&
          this.match.restrictionBySex != this.currentUser.relGender
      ) {
        return (
            "Dit is een wedstrijd voor " +
            (this.match.restrictionBySex == 1 ? "heren" : "dames") +
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
      console.log(this.mySubscription);
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
