<template>
  <div class="p-0 m-0">
    <q-list bordered separator>
      <q-item class="itg-q-item">
        <q-item-section class="col-2"> Hole </q-item-section>
        <q-item-section class="col-2"> Par </q-item-section>
        <q-item-section class="col-6 text-center"> Slagen </q-item-section>
        <q-item-section class="col-2"> Stb </q-item-section>
      </q-item>

      <q-item
        class="itg-q-item"
        v-for="(hole, index) in holesArray"
        :key="index"
        v-show="hole.par > 0"
      >
        <h2 class="d-none">{{ hole.sl }}</h2>
        <q-item-section class="col-2">
          {{ hole.nr }}
        </q-item-section>
        <q-item-section class="col-2">
          {{ hole.par }}
        </q-item-section>
        <q-item-section class="col-6">
          <div class="row">
            <div class="col-4" style="padding: 0px; text-align: left">
              <q-btn
                round
                outline
                color="secondary"
                label="-"
                @click="onScoreChangeHandler(hole, -1)"
              />
            </div>

            <div
              class="text-center col-4"
              style="padding-top: 10px; font-weight: bold"
            >
              <q-item-label>{{ hole.sl }}</q-item-label>
            </div>

            <div
              class="col-4"
              style="
                padding: 0px;
                text-align: right;
                font-size: 18px;
                font-weight: bold;
              "
            >
              <q-btn
                round
                outline
                color="secondary"
                label="+"
                @click="onScoreChangeHandler(hole, 1)"
              />
            </div>
          </div>
        </q-item-section>
        <q-item-section class="col-2">
          {{ hole.stab }}
        </q-item-section>
      </q-item>

      <q-item class="itg-q-item">
        <q-item-section class="col-10">
          <q-item-label class="itg-text-overflow">Totaal punten</q-item-label>
        </q-item-section>
        <q-item-section class="col-2">
          <q-item-label class="itg-text-overflow text-right"
            >{{ total_stableford }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="itg-q-item">
        <q-item-section>
          <q-btn-group spread>
            <q-btn color="secondary" label="Opslaan" @click="handleSave" />
          </q-btn-group>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<style lang="scss" scoped></style>

<script>
export default {
  props: ["player"],
  data() {
    return {
      total_stableford: 0,
      holesArray: [],
      local_player: this.player,
    };
  },
  computed: {},
  created: function () {
    this.handleInitiateScore();
  },
  methods: {
    handleClose: function () {
      this.page = 2;
    },

    handleSave: function () {
      let that = this;
      this.loading = true;

      this.holesArray.forEach(function (hole) {
        that.local_player.match_score["hcsH" + hole.nr + "_sl"] = hole.sl;
      });

      this.$http
        .post(`golfer/match/setMatchScore`, this.local_player.match_score)
        .then((res) => {
          that.local_player.match_score = res.data;
          that.$emit("handleClose");
        });
    },

    handleInitiateScore: function () {
      let that = this;
      for (let i = 1; i <= 18; i++) {
        let sl = this.local_player.match_score["hcsH" + i + "_sl"];
        sl =
          sl == null
            ? this.local_player.match_score["hcsH" + i + "_par"] +
              this.player.match_score["hcsH" + i + "_HcpSl"]
            : sl;

        that.holesArray.push({
          nr: i,
          par: this.local_player.match_score["hcsH" + i + "_par"],
          si: this.local_player.match_score["hcsH" + i + "_si"],
          hsl: this.local_player.match_score["hcsH" + i + "_HcpSl"],
          sl: sl,
          pPar:
            this.local_player.match_score["hcsH" + i + "_par"] +
            this.local_player.match_score["hcsH" + i + "_HcpSl"],
          stab: this.calcStab(
            this.local_player.match_score["hcsH" + i + "_par"],
            this.local_player.match_score["hcsH" + i + "_HcpSl"],
            sl
          ),
        });
      }
    },

    calcStab: function (par, hsl, sl) {
      let stab = par + hsl + 2 - sl;
      return stab < 0 ? 0 : stab;
    },

    onScoreChangeHandler: function (hole, value) {
      hole.sl += value;
      hole.sl = hole.sl == 0 ? 1 : hole.sl;

      hole.stab = this.calcStab(hole.par, hole.hsl, hole.sl);

      let that = this;
      this.total_stableford = 0;
      this.holesArray.forEach(function (hole) {
        that.total_stableford += hole.stab;
      });
    },
  },
};
</script>
