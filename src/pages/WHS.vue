<template>
  <q-page-container>
    <q-page v-if="selectedTee === null" class="q-pa-sm">
      <div class="row justify-between">
        <div class="text-h5">WHS naar baan hcp</div>
        <p>
          Voer de WHS handicap in voor het berekenen van de baan handicap. In
          het tee overzicht wordt de door de NGF geadviseerde tee vet
          weergegeven.
        </p>
      </div>

      <div class="row q-mb-md">
        <q-input v-model="whs" label="Voer je handicap in" />
      </div>

      <div v-for="(item, key) in list" :key="key" class="row q-mb-md">
        <div class="col">
          <div class="text-h6 text-center text-bold">{{ item.name }}</div>
          <q-separator class="q-mb-sm q-mt-sm" />
          <div class="row text-bold">
            <div class="col-4">Tee</div>
            <div class="col-2">Lengte</div>
            <div class="col-1">Par</div>
            <div class="col-2">CR</div>
            <div class="col-1">SR</div>
            <div class="col-2 text-right">B.Hcp</div>
          </div>
          <q-separator class="q-mb-sm q-mt-sm" />
          <div
            v-for="(tee, key) in item.tees"
            :key="key"
            :style="getFontColor(tee)"
            class="row"
            v-on:click="setSelected(item, tee)"
          >
            <div class="col-4">
              {{ tee.name }}
            </div>
            <div class="col-2">
              {{ tee.totalDistance }}
            </div>
            <div class="col-1">
              {{ tee.totalPar }}
            </div>
            <div class="col-2">
              {{ tee.courseRating }}
            </div>
            <div class="col-1">
              {{ tee.slopeRating }}
            </div>
            <div class="col-2 text-right">
              {{ getBaanHcp(tee) }}
            </div>
          </div>
          <q-separator class="q-mb-sm q-mt-sm" />
        </div>
      </div>
    </q-page>
    <q-page v-else class="q-pa-sm">
      <div class="row text-h6 text-bold q-mb-md">
        <div class="col">{{ selectedItem.name }} : {{ selectedTee.name }}</div>
      </div>
      <div class="row">
        <div class="col-6 text-h6">P.Hcp: {{ getBaanHcp(selectedTee) }}</div>
        <div class="col-6 text-right">
          <q-btn
            color="secondary"
            label="sluiten"
            v-on:click="selectedTee = null"
          />
        </div>
      </div>
      <div class="row text-bold q-mt-md">
        <div class="col-2">Hole</div>
        <div class="col-2">Afstand</div>
        <div class="col-2">Par</div>
        <div class="col-2">SI</div>
        <div class="col-2">P.Hcp</div>
      </div>
      <q-separator class="q-mt-sm q-mb-sm" />
      <div
        v-for="(hole, key) in selectedItem.courseType"
        :key="key"
        class="row"
      >
        <div class="col-2">{{ hole }}</div>
        <div class="col-2">{{ selectedTee["distanceHole" + hole] }}</div>
        <div class="col-2">{{ selectedTee["parHole" + hole] }}</div>
        <div class="col-2">{{ selectedTee["strokeIndexHole" + hole] }}</div>
        <div class="col-2"></div>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import authMixin from "../mixins/auth";

export default {
  mixins: [authMixin],
  data: function () {
    return {
      list: [],
      selectedTee: null,
      selectedItem: null,
      whs: 36,
      gender: "M",
      teeAdvise: [
        { gender: "M", max: 90, min: 54, letter: "O" },
        { gender: "M", max: 54, min: 28, letter: "R" },
        { gender: "M", max: 28, min: 15, letter: "B" },
        { gender: "M", max: 15, min: 5, letter: "Y" },
        { gender: "M", max: 5, min: -9.9, letter: "W" },
        { gender: "F", max: 90, min: 28, letter: "O" },
        { gender: "F", max: 28, min: 5, letter: "R" },
        { gender: "F", max: 5, min: -9.9, letter: "B" },
      ],
    };
  },
  mounted() {
    this.$http.get("golfer/whs").then((res) => {
      this.list = res;
    });
  },
  watch: {
    selectedTee(newValue) {
      console.log(newValue);
    },
  },
  computed: {
    teeLetterMale() {
      return this.teeLetter("M");
    },
    teeLetterFeeMale() {
      return this.teeLetter("F");
    },
  },
  methods: {
    getFontColor(tee) {
      let teeLetter =
        tee.gender === "M" ? this.teeLetterMale : this.teeLetterFeeMale;
      let isTee = tee.color_letter.toUpperCase() === teeLetter.toUpperCase();

      return {
        fontWeight: isTee ? "bold" : "",
        fontSize: isTee ? "16px" : "14px",
        border: isTee ? "1px solid gray" : "",
        backgroundColor: isTee ? "gray" : "",
        color: isTee ? "white" : "black",
      };
    },
    teeLetter(gender) {
      let hcp = this.whs;
      let tee = this.teeAdvise.find(
        (item) => this.gender === gender && hcp <= item.max && hcp > item.min
      );
      if (tee === undefined) {
        return "B";
      }
      return tee.letter;
    },
    getValue(tee, type) {
      let result = 0;
      for (let i = 1; i <= 18; i++) {
        result += tee[type + i];
      }
      return result;
    },
    getBaanHcp(tee) {
      let result = 0;
      if (tee.courseType === 18) {
        result = Math.round(
          this.whs * (tee.slopeRating / 113) +
            (tee.courseRating - tee.totalPar),
          0
        );
      } else {
        result = Math.round(
          (this.whs / 2) * (tee.slopeRating / 113) +
            (tee.courseRating - tee.totalPar),
          0
        );
      }
      return result;
    },
    setSelected(item, tee) {
      this.selectedTee = tee;
      this.selectedItem = item;
    },
  },
};
</script>
