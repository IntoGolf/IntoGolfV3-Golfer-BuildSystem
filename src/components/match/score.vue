<template>
  <div class="p-0 m-0">
    <q-list bordered separator>
      <q-item class="itg-q-item">
        <q-item-section class="col-1 text-left text-bold"> H</q-item-section>
        <q-item-section class="col-2 text-left text-bold"> Par</q-item-section>
        <q-item-section
          :class="match.scoringTypeId === 3 ? 'col-5' : 'col-6'"
          class="text-center text-bold"
        >
          Sl
        </q-item-section>
        <q-item-section
          :class="match.scoringTypeId === 3 ? 'col-1' : 'col-2'"
          class="text-center text-bold"
        >
          Pnt
        </q-item-section>
        <q-item-section
          v-if="match.scoringTypeId === 3"
          class="col-2 text-right text-bold"
        />
      </q-item>

      <q-item
        v-for="(hole, index) in holesArray"
        v-show="hole.par > 0"
        :key="index"
        class="itg-q-item"
      >
        <q-item-section class="col-1 text-left text-bold">
          {{ hole.nr }}
        </q-item-section>
        <q-item-section class="col-2 text-left">
          {{ hole.par }}+{{ hole.hsl }}
        </q-item-section>
        <q-item-section
          :class="match.scoringTypeId === 3 ? 'col-5' : 'col-6'"
          class="text-center"
        >
          <div class="row">
            <div class="col-4" style="padding: 0px; text-align: left">
              <q-btn
                color="primary"
                icon="expand_more"
                outline
                round
                @click="onScoreChangeHandler(hole, -1)"
              />
            </div>

            <div
              class="text-center col-4"
              style="padding-top: 10px; font-weight: bold"
            >
              <q-item-label>{{ hole.sl === 21 ? "-" : hole.sl }}</q-item-label>
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
                color="primary"
                icon="expand_less"
                outline
                round
                @click="onScoreChangeHandler(hole, 1)"
              />
            </div>
          </div>
        </q-item-section>
        <q-item-section
          :class="match.scoringTypeId === 3 ? 'col-1' : 'col-2'"
          class="text-center"
        >
          {{ hole.pnt }}
        </q-item-section>
        <q-item-section
          v-if="match.scoringTypeId === 3"
          class="col-2 text-right"
        >
          <div class="row">
            <div class="col-12 text-right">
              <q-btn
                color="primary"
                label="-"
                outline
                round
                style="width: 20px; float: right"
                @click="onScoreChangeHandler(hole, 21)"
              />
            </div>
          </div>
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
            >{{ total }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="itg-q-item">
        <q-item-section>
          <q-btn-group spread>
            <q-btn color="primary" label="Opslaan" @click="handleSave" />
          </q-btn-group>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<style lang="scss" scoped></style>

<script>
export default {
  props: {
    player: Object,
    match: Object,
  },
  data() {
    return {
      holesArray: [],
      local_player: this.player,
    };
  },
  computed: {
    total: function () {
      let total = 0;
      this.holesArray.forEach(function (hole) {
        total += hole.pnt;
      });
      return total;
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
          sl === null
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
          pnt: this.calcPoints(
            this.local_player.match_score["hcsH" + i + "_par"],
            this.local_player.match_score["hcsH" + i + "_HcpSl"],
            sl
          ),
        });
      }
    },

    calcPoints: function (par, hsl, sl) {
      if (this.match.scoringTypeId === 1) {
        let stab = par + hsl + 2 - sl;
        return stab < 0 ? 0 : stab;
      } else if (this.match.scoringTypeId === 2) {
        return sl - hsl;
      } else if (this.match.scoringTypeId === 3) {
        let hlp = par + hsl;
        if (hlp > sl) {
          return 1;
        } else if (hlp === sl) {
          return 0;
        } else {
          return -1;
        }
      }
    },

    onScoreChangeHandler: function (hole, value) {
      if (value === 21) {
        hole.sl = value;
      } else if (hole.sl === 21) {
        if (value === -1) {
          hole.sl = hole.par + hole.hsl;
        }
      } else {
        hole.sl += value;
        hole.sl = hole.sl === 0 ? 1 : hole.sl;
      }
      hole.pnt = this.calcPoints(hole.par, hole.hsl, hole.sl);
    },
  },
};
</script>
