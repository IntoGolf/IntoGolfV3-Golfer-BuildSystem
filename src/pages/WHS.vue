<template>
  <q-page v-if="selectedTee === null" class="q-pa-sm">
    <div class="row justify-between">
      <div class="text-h5">WHS naar baan hcp</div>
      <p>
        Voer de WHS handicap in voor het berekenen van de baan handicap. In het
        tee overzicht wordt de door de NGF geadviseerde tee vet weergegeven.
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
            {{ getBaanHcp(tee, item) }}
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
      <div class="col-6 text-h6">
        P.Hcp: {{ getBaanHcp(selectedTee, selectedItem) }}
      </div>
      <div class="col-6 text-right">
        <q-btn
          color="secondary"
          label="sluiten"
          v-on:click="selectedTee = null"
        />
      </div>
    </div>

    <div v-if="selectedItem.courseType === 9">
      <div class="row text-bold q-mt-md">
        <div class="col-2">Hole</div>
        <div class="col-4">Afstand</div>
        <div class="col-2 text-center">Par</div>
        <div class="col-2 text-center">SI</div>
        <div class="col-2 text-center">P.Hcp</div>
      </div>
      <q-separator class="q-mt-sm q-mb-sm" />
      <div
        v-for="(hole, key) in selectedItem.courseType"
        :key="key"
        class="row"
      >
        <div class="col-2">{{ hole }}</div>
        <div class="col-4">{{ selectedTee["distanceHole" + hole] }}</div>
        <div class="col-2 text-center">
          {{ selectedTee["parHole" + hole] }}
        </div>
        <div class="col-2 text-center">
          {{ selectedTee["strokeIndexHole" + hole] }}
        </div>
        <div class="col-2 text-center">
          {{
            calculateHoleStrokes(
              getBaanHcp(selectedTee, selectedItem),
              selectedTee["strokeIndexHole" + hole],
              selectedItem
            )
          }}
        </div>
      </div>
      <q-separator class="q-mt-sm q-mb-sm" />
      <div class="row text-bold">
        <div class="col-2">&nbsp;</div>
        <div class="col-4">{{ selectedTee.totalDistance }}</div>
        <div class="col-2 text-center">{{ selectedTee.totalPar }}</div>
        <div class="col-2 text-center">&nbsp;</div>
        <div class="col-2 text-center">
          {{ getBaanHcp(selectedTee, selectedItem) }}
        </div>
      </div>
    </div>

    <div v-if="selectedItem.courseType === 18">
      <div class="row text-bold q-mt-md" style="border-bottom: 1px solid gray">
        <div class="col-6">
          <div class="row">
            <div class="col-2 text-bold">Hl</div>
            <div class="col-3">Afst.</div>
            <div class="col-2 text-center">Par</div>
            <div class="col-2 text-center">Si</div>
            <div class="col-3 text-center">Sl</div>
          </div>
        </div>
        <div class="col-6">
          <div class="row">
            <div class="col-2 text-bold">Hl</div>
            <div class="col-3">Afst.</div>
            <div class="col-2 text-center">Par</div>
            <div class="col-2 text-center">Si</div>
            <div class="col-3 text-center">Sl</div>
          </div>
        </div>
      </div>
      <div v-for="(hole, key) in 9" :key="key" class="row">
        <div class="col-6">
          <div class="row">
            <div class="col-2 text-bold">{{ hole }}</div>
            <div class="col-3">{{ selectedTee["distanceHole" + hole] }}</div>
            <div class="col-2 text-center">
              {{ selectedTee["parHole" + hole] }}
            </div>
            <div class="col-2 text-center">
              {{ selectedTee["strokeIndexHole" + hole] }}
            </div>
            <div class="col-3 text-center">
              {{
                calculateHoleStrokes(
                  getBaanHcp(selectedTee, selectedItem),
                  selectedTee["strokeIndexHole" + hole],
                  selectedItem
                )
              }}
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="row">
            <div class="col-2 text-bold">{{ hole + 9 }}</div>
            <div class="col-3">
              {{ selectedTee["distanceHole" + (hole + 9)] }}
            </div>
            <div class="col-2 text-center">
              {{ selectedTee["parHole" + (hole + 9)] }}
            </div>
            <div class="col-2 text-center">
              {{ selectedTee["strokeIndexHole" + (hole + 9)] }}
            </div>
            <div class="col-3 text-center">
              {{
                calculateHoleStrokes(
                  getBaanHcp(selectedTee, selectedItem),
                  selectedTee["strokeIndexHole" + (hole + 9)],
                  selectedItem
                )
              }}
            </div>
          </div>
        </div>
      </div>
      <div class="row text-bold">
        <div class="col-6" style="border-top: 1px solid gray">
          <div class="row">
            <div class="col-2">Uit</div>
            <div class="col-3">{{ getDistance(1, 9) }}</div>
            <div class="col-2 text-center">{{ getPar(1, 9) }}</div>
            <div class="col-2 text-center">&nbsp;</div>
            <div class="col-3 text-center">
              {{ getHcp(1, 9) }}
            </div>
          </div>
        </div>
        <div class="col-6" style="border-top: 1px solid gray">
          <div class="row">
            <div class="col-2">In</div>
            <div class="col-3">{{ getDistance(10, 18) }}</div>
            <div class="col-2 text-center">{{ getPar(10, 18) }}</div>
            <div class="col-2 text-center">&nbsp;</div>
            <div class="col-3 text-center">
              {{ getHcp(10, 18) }}
            </div>
          </div>
        </div>
      </div>

      <div class="row text-bold">
        <div class="col-6">
          <div class="row">
            <div class="col-2">&nbsp;</div>
            <div class="col-3">&nbsp;</div>
            <div class="col-2 text-center">&nbsp;</div>
            <div class="col-2 text-center">&nbsp;</div>
            <div class="col-3 text-center">&nbsp;</div>
          </div>
        </div>
        <div class="col-6">
          <div class="row">
            <div class="col-2">Uit</div>
            <div class="col-3">{{ getDistance(1, 9) }}</div>
            <div class="col-2 text-center">{{ getPar(1, 9) }}</div>
            <div class="col-2 text-center">&nbsp;</div>
            <div class="col-3 text-center">
              {{ getHcp(1, 9) }}
            </div>
          </div>
        </div>
      </div>

      <div class="row text-bold">
        <div class="col-6">
          <div class="row">
            <div class="col-2">&nbsp;</div>
            <div class="col-3">&nbsp;</div>
            <div class="col-2 text-center">&nbsp;</div>
            <div class="col-2 text-center">&nbsp;</div>
            <div class="col-3 text-center">&nbsp;</div>
          </div>
        </div>
        <div class="col-6">
          <div class="row">
            <div class="col-2">&nbsp;</div>
            <div class="col-3">{{ selectedTee.totalDistance }}</div>
            <div class="col-2 text-center">{{ selectedTee.totalPar }}</div>
            <div class="col-2 text-center">&nbsp;</div>
            <div class="col-3 text-center">
              {{ getBaanHcp(selectedTee, selectedItem) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
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
    selectedTee(newValue) {},
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
        (item) => item.gender === gender && hcp <= item.max && hcp > item.min
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
    getBaanHcp(tee, item) {
      let result = 0;
      if (item.courseType === 18) {
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
    getPar(start, end) {
      let result = 0;
      for (let hole = 1; hole <= 18; hole++) {
        if (hole >= start && hole <= end) {
          result += this.selectedTee["parHole" + hole];
        }
      }
      return result;
    },
    getHcp(start, end) {
      let result = 0;
      for (let hole = 1; hole <= 18; hole++) {
        if (hole >= start && hole <= end) {
          result += this.calculateHoleStrokes(
            this.getBaanHcp(this.selectedTee, this.selectedItem),
            this.selectedTee["strokeIndexHole" + hole],
            this.selectedItem
          );
        }
      }
      return result;
    },
    getDistance(start, end) {
      let result = 0;
      for (let hole = 1; hole <= 18; hole++) {
        if (hole >= start && hole <= end) {
          result += this.selectedTee["distanceHole" + hole];
        }
      }
      return result;
    },
    calculateHoleStrokes(playingHandicap, strokeIndex, selectedItem) {
      const totalHoles = parseInt(selectedItem.courseType);
      if (![9, 18].includes(totalHoles)) {
        throw new Error(
          "Invalid total holes. Only 9 or 18 holes are supported."
        );
      }

      const baseStrokes = Math.floor(playingHandicap / totalHoles);
      const extraStrokes = playingHandicap % totalHoles;

      const siArray = selectedItem.tees
        .map(
          (_, index) => selectedItem.tees[index][`strokeIndexHole${index + 1}`]
        )
        .sort((a, b) => a - b);

      const siIndex = siArray.indexOf(strokeIndex);

      return baseStrokes + (siIndex < extraStrokes ? 1 : 0);
    },
  },
};
</script>
