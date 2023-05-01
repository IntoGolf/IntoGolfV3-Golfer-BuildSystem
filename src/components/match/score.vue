<template>
  <div class="p-0 m-0">
    <q-list bordered separator>
      <q-item class="itg-q-item">
        <q-item-section class="col-2 text-left text-bold"> Hole</q-item-section>
        <q-item-section class="col-2 text-left text-bold"> Par</q-item-section>
        <q-item-section class="col-6 text-center text-bold">
          Slagen
        </q-item-section>
        <q-item-section class="col-2 text-center text-bold">
          Pnt
        </q-item-section>
      </q-item>

      <q-item
        v-for="(hole, index) in holesArray"
        v-show="hole.par > 0"
        :key="index"
        class="itg-q-item"
      >
        <q-item-section class="col-2 text-left text-bold">
          {{ hole.nr }}
        </q-item-section>
        <q-item-section class="col-2 text-left">
          {{ hole.par }}
        </q-item-section>
        <q-item-section class="col-6 text-center">
          <div class="row">
            <div class="col-4" style="padding: 0px; text-align: left">
              <q-btn
                color="secondary"
                label="-"
                outline
                round
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
                color="secondary"
                label="+"
                outline
                round
                @click="onScoreChangeHandler(hole, 1)"
              />
            </div>
          </div>
        </q-item-section>
        <q-item-section class="col-2 text-center">
          {{ hole.stab }}
        </q-item-section>
      </q-item>

      <q-item class="itg-q-item">
        <q-item-section class="col-10">
          <q-item-label class="itg-text-overflow">Totaal punten</q-item-label>
        </q-item-section>
        <q-item-section class="col-2">
          <q-item-label
            class="itg-text-overflow text-center"
            style="font-size: 1.2em"
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
      holesArray: [],
      local_player: this.player,
    };
  },
  computed: {
    total_stableford: function () {
      let total_stableford = 0;
      this.holesArray.forEach(function (hole) {
        total_stableford += hole.stab;
      });
      return total_stableford;
    },
  },
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
        .post(`golfer/event/result`, this.local_player.match_score)
        .then(() => {
          that.$emit("handleClose");
        });
    },

    handleInitiateScore: function () {
      let that = this;
      let holes =
        parseInt(this.local_player.match_score["hcsH10_par"]) > 0 ? 18 : 9;
      for (let i = 1; i <= holes; i++) {
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
        console.log(that.holesArray);
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
    },
  },
};
</script>
