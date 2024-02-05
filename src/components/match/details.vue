<template>
  <q-page class="q-pa-sm">
    <q-card class="q-pa-sm">
      <div class="row">
        <div class="col-6 text-h6">{{ title }}</div>
        <div class="col-6 text-right">
          <q-btn
            v-show="page === 1"
            color="primary"
            flat
            icon="arrow_back"
            v-on:click="handleCloseMatch"
            >Wedstrijden
          </q-btn>
        </div>
      </div>
      <q-separator class="q-mt-sm q-mb-sm" />
      <div class="row">
        <div class="col q-pb-md">
          <details-list
            v-if="page == 1"
            :match="match"
            :mySubscription="mySubscription"
            v-on:handleCloseSubscribe="handleCloseSubscribe"
            v-on:handleEnterScore="handleEnterScore"
            v-on:handlePayment="handlePayment"
            v-on:handleSubscribe="handleSubscribe"
            v-on:handleSubscribeGuest="handleSubscribeGuest"
            v-on:handleSubscribeMember="handleSubscribeMember"
          />

          <details-players
            v-if="page === 1 && match.UitslagenGereed !== 1"
            :match="match"
            v-on:handleSubscribe="handleSubscribe"
            v-on:handleSubscribeGuest="handleSubscribeGuest"
            v-on:handleSubscribeMember="handleSubscribeMember"
          />

          <details-result
            v-if="page === 1 && match.UitslagenGereed === 1"
            :match="match"
          />

          <subscribe-member-self
            v-if="page === 2"
            :match="match"
            :mySubscription="mySubscription"
            v-on:handleCloseSubscribe="handleCloseSubscribe"
          />

          <subscribe-member
            v-if="page === 4"
            :aSubscription="aSubscription"
            :match="match"
            v-on:handleCloseSubscribe="handleCloseSubscribe"
          />

          <subscribe-guest
            v-if="page === 3"
            :aSubscription="aSubscription"
            :match="match"
            v-on:handleCloseSubscribe="handleCloseSubscribe"
          />

          <score
            v-if="page === 5"
            v-bind:match="prop_match"
            v-bind:player="player"
            v-on:handleClose="handleClose"
          />

          <payment
            v-if="page === 6"
            :id="mollie.opmKey"
            :url="mollie.opmRedirectUrl"
            v-on:handleCloseSubscribe="handleCloseSubscribe"
          />
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import subscribeMemberSelf from "components/match/SubscribeMemberSelf";
import subscribeMember from "components/match/SubscribeMember";
import SubscribeGuest from "components/match/SubscribeGuest";
import detailsList from "components/match/detailsList";
import detailsPlayers from "components/match/detailsPlayers";
import detailsResult from "components/match/detailsResult";
import score from "components/match/score";
import authMixin from "../../mixins/auth";
import payment from "components/match/payment.vue";

export default {
  mixins: [authMixin],
  components: {
    payment,
    subscribeMemberSelf,
    subscribeMember,
    SubscribeGuest,
    detailsList,
    detailsPlayers,
    detailsResult,
    score,
  },
  props: {
    prop_match: Object,
    prop_page: Number,
  },
  data() {
    return {
      list: [],
      aSubscription: null,
      player: null,
      match: this.prop_match,
      page: 1,
      mollie: null,
    };
  },
  computed: {
    title() {
      if (this.page === 1) {
        return this.match.name;
      } else if ([2, 3, 4].includes(this.page)) {
        return "Inschrijven " + this.match.name;
      }
      return "";
    },
    mySubscription: function () {
      let that = this;
      let result = null;
      this.match.players.forEach(function (item) {
        if (item.relNr === that.currentUser.relNr) {
          result = item;
        }
      });
      return result;
    },
  },
  created: function () {
    if (this.prop_page === 5) {
      this.handleEnterScore();
    }
  },
  methods: {
    handleSubscribe: function () {
      this.page = 2;
    },
    handleSubscribeGuest: function (aSubscription) {
      this.aSubscription = aSubscription;
      this.page = 3;
    },
    handleSubscribeMember: function (aSubscription) {
      this.aSubscription = aSubscription;
      this.page = 4;
    },
    handleCloseSubscribe: function () {
      this.page = 1;
      this.handleRefreshMatch();
    },
    handlePayment: function (mollie) {
      this.page = 6;
      this.mollie = mollie;
    },
    handleEnterScore: function () {
      let that = this;
      this.match.players.forEach(function (player) {
        if (player.relNr === that.currentUser.relNr) {
          that.page = 5;
          that.player = player;
        }
      });
    },
    handleRefreshMatch: function () {
      let that = this;
      this.loading = true;
      this.$http.get(`golfer/event/` + this.match.id).then((res) => {
        that.match = res;
      });
    },
    handleClose: function () {
      this.page = 1;
    },
    handleCloseMatch: function () {
      this.$emit("handleCloseMatch");
    },
  },
};
</script>
