<template>
  <q-page>
    <div class="row">
      <div class="col q-pa-md">
        <details-list
          v-if="page == 1"
          :match="match"
          :currentUser="currentUser"
          :mySubscription="mySubscription"
          v-on:handleSubscribe="handleSubscribe"
          v-on:handleSubscribeMember="handleSubscribeMember"
          v-on:handleSubscribeGuest="handleSubscribeGuest"
          v-on:handleCloseSubscribe="handleCloseSubscribe"
          v-on:handleEnterScore="handleEnterScore"
        />

        <details-players
          v-if="page == 1 && match.UitslagenGereed != 1"
          :match="match"
          :currentUser="currentUser"
          v-on:handleSubscribe="handleSubscribe"
          v-on:handleSubscribeMember="handleSubscribeMember"
          v-on:handleSubscribeGuest="handleSubscribeGuest"
        />

        <details-result
          v-if="page == 1 && match.UitslagenGereed == 1"
          :match="match"
          :currentUser="currentUser"
        />

        <subscribe-member-self
          v-if="page == 2"
          :match="match"
          :mySubscription="mySubscription"
          :currentUser="currentUser"
          v-on:handleCloseSubscribe="handleCloseSubscribe"
        />

        <subscribe-member
          v-if="page == 4"
          :match="match"
          :aSubscription="aSubscription"
          :currentUser="currentUser"
          v-on:handleCloseSubscribe="handleCloseSubscribe"
        />

        <subscribe-guest
          v-if="page == 3"
          :match="match"
          :aSubscription="aSubscription"
          :currentUser="currentUser"
          v-on:handleCloseSubscribe="handleCloseSubscribe"
        />

        <score
          v-if="page == 5"
          v-bind:player="player"
          v-on:handleClose="handleClose"
        />
      </div>
    </div>
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

export default {
  components: {
    subscribeMemberSelf,
    subscribeMember,
    SubscribeGuest,
    detailsList,
    detailsPlayers,
    detailsResult,
    score,
  },
  props: ["prop_match", "prop_page", "currentUser"],
  data() {
    return {
      list: [],
      aSubscription: null,
      player: null,
      match: this.prop_match,
      page: 1,
    };
  },
  computed: {
    mySubscription: function () {
      let that = this;
      let result = null;
      this.match.players.forEach(function (item) {
        if (item.relNr == that.currentUser.relNr) {
          result = item;
        }
      });
      return result;
    },
  },
  created: function () {
    let that = this;
    if (this.prop_page == 5) {
      this.match.players.forEach(function (player) {
        if (player.relNr == that.$ls.getItem("currentUser").relNr) {
          return that.handleEnterScore(player);
        }
      });
    } else {
      this.handleRefreshMatch();
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
    handleEnterScore: function (player) {
      this.page = 5;
      this.player = player;
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
  },
};
</script>
