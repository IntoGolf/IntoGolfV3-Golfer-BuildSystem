<template>
  <div class="mt-2">
    <hr />

    <div v-for="(result, index) in results" :key="index">
      <h5>{{ result.mrcOmschrijving }}</h5>

      <div class="row border pt-2 pb-2 font-weight-bold">
        <div class="col-2 text-center">
          <i class="far fa-trophy" />
        </div>
        <div class="col-xs-8 col-sm-6 text-center">
          <i class="far fa-user-friends" />
        </div>
        <div class="col-2 text-center">
          <i class="far fa-ellipsis-h-alt" />
        </div>
        <div class="col-2 d-none d-sm-block">U</div>
      </div>

      <div
        class="row border pt-2 pb-2"
        v-for="(party, index) in result.MatchResult"
        v-bind:key="index"
      >
        <div class="col-2 text-center">{{ party.marPos }}</div>
        <div class="col-xs-8 col-sm-6 text-left">
          {{ getPartyPlayers(party) }}
        </div>
        <div class="col-2 text-center">{{ party.marPoints }}</div>
        <div class="col-2 d-none d-sm-block">{{ party.marExtraInfo }}</div>
      </div>
    </div>
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

.itg-text-qualifying {
  color: #00d97e;
  text-align: center;
}

.itg-text-non-qualifying {
  color: orange;
  text-align: center;
}
</style>
<script>
export default {
  props: ["match", "currentUser"],
  data() {
    return {
      resultArray: [],
    };
  },
  created() {},
  computed: {
    results: function () {
      //      if (this.resultArray.length > 0) {
      return this.resultArray;
      //      }
      //
      // let that = this;
      // this.$http.get(`golfer/match/getResults/` + this.match.id)
      //     .then(res => {
      //       that.resultArray = res.data;
      //     });
    },
  },
  methods: {
    getPartyPlayers(party) {
      let result = "";
      party.match_party.players.forEach(function (player, index) {
        result +=
          (index > 0 ? " | " : "") +
          player.relation.relName +
          ", " +
          player.relation.relCallName;
      });
      return result;
    },
  },
};
</script>
