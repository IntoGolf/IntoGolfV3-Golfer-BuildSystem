<template>
  <div class="mt-2">
    <hr />

    <div class="row">
      <div class="col">
        <div class="text-h6">Uitslagen</div>
      </div>
      <div class="col-auto">
        <q-btn size="sm" v-on:click="loadResults">refresh</q-btn>
      </div>
    </div>

    <div v-for="(result, index) in resultArray" :key="index">
      <div
        class="text-bold q-mb-sm q-mt-sm"
        style="font-size: 1.1em; text-transform: capitalize"
      >
        {{ result.mrcOmschrijving }}
      </div>

      <div class="row border q-mb-sm pb-2 font-weight-bold">
        <div class="col-2 text-left text-bold">Rank</div>
        <div class="col-xs-8 col-sm-6 text-bold">Speler(s)</div>
        <div class="col-2 text-center text-bold">Score</div>
        <div class="col-2 text-center text-bold xs-hide">Extra info</div>
      </div>

      <div
        v-for="(party, index) in result.MatchResult"
        v-bind:key="index"
        class="row border pt-2 pb-2"
      >
        <div class="col-2 text-left text-bold">
          {{
            party.marPoints !== null && party.marPoints > -65
              ? party.marPos
              : "-"
          }}
        </div>
        <div class="col-xs-8 col-sm-6 text-left">
          {{ party.players }}
        </div>
        <div class="col-2 text-center">{{ getPoints(party.marPoints) }}</div>
        <div class="col-2 d-none text-center d-sm-block xs-hide">
          {{
            party.marPoints !== null && party.marPoints > -65
              ? party.marExtraInfo
              : ""
          }}
        </div>
      </div>
    </div>
    <template v-if="birdieArray">
      <hr />
      <div class="text-h6">Birdie uitslag</div>
      <div class="row border q-mb-sm pb-2 font-weight-bold">
        <div class="col-2 text-left text-bold">Rank</div>
        <div class="col-5 text-bold">Speler</div>
        <div class="col-2 text-center text-bold">Pnt</div>
        <div class="col-1 text-center text-bold">BI</div>
        <div class="col-1 text-center text-bold">EA</div>
        <div class="col-1 text-center text-bold">AL</div>
      </div>
      <div
        v-for="(player, index) in birdieArray"
        v-bind:key="index"
        class="row border pt-2 pb-2"
      >
        <div class="col-2 text-left text-bold">
          {{ player.rank }}
        </div>
        <div class="col-5 text-left">
          {{ player.playerName }}
        </div>
        <div class="col-2 text-center">{{ player.points }}</div>
        <div class="col-1 d-none text-center d-sm-block">
          {{ player.BI }}
        </div>
        <div class="col-1 d-none text-center d-sm-block">
          {{ player.EA }}
        </div>
        <div class="col-1 d-none text-center d-sm-block">
          {{ player.AL }}
        </div>
      </div>
      <div class="q-mt-sm">
        <i
          >In kolommen BI,EA en AL staan het aantal birdies, eagles en
          albatrossen. In punten staat het aantal punten naar volgende
          waardering: BI=1,EA=3,AL=5</i
        >
      </div>
    </template>
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
import authMixin from "../../mixins/auth";

export default {
  mixins: [authMixin],
  props: ["match"],
  data() {
    return {
      resultArray: [],
      birdieArray: false,
    };
  },
  created() {
    this.loadResults();
    this.getBirdy();
  },
  methods: {
    loadResults: function () {
      let that = this;
      this.$http.get(`golfer/event/result/` + this.match.id).then((res) => {
        that.resultArray = res;
      });
    },
    getPoints: function (value) {
      if (value === null) {
        return "-";
      } else if (value === -87) {
        return "NR";
      } else if (value === -88) {
        return "DQ";
      } else if (value === -89) {
        return "NS";
      } else {
        return value;
      }
    },
    async getBirdy() {
      const res = await this.$http.get(`golfer/testbirdy?id=` + this.match.id);
      this.birdieArray = res.data;
    },
  },
};
</script>
