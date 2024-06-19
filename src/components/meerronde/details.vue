<template>
  <q-page class="q-pa-sm">
    <div class="row">
      <div class="col-9">
        <h5 class="q-mt-sm q-mb-sm">{{ prop_match.meeName }}</h5>
      </div>
      <div class="col-3 text-right">
        <q-btn
          color="primary"
          flat
          icon="arrow_back"
          v-on:click="$emit('handleCloseMatch')"
        />
      </div>
    </div>
    <q-separator class="q-mt-sm q-mb-sm" />
    <q-table
      v-if="dataResult.length > 0"
      :columns="columnsResult"
      :rows="dataResult"
      :rows-per-page-options="[0]"
      bordered
      class="my-sticky-column-table"
      flat
      hide-pagination
      row-key="name"
    />
    <q-separator class="q-mb-sm" />
    <div v-if="prop_match.meeEclectic === 1">
      <h5 class="q-mt-sm q-mb-sm">Eclectic</h5>
      <div style="width: 100%; overflow: scroll">
        <q-table
          v-if="dataEclectic.rows.length > 0"
          :columns="columnsEclectic"
          :rows="dataEclectic.rows"
          :rows-per-page-options="[0]"
          bordered
          class="my-sticky-column-table"
          flat
          height="200"
          hide-pagination
          row-key="player"
        />
      </div>
    </div>
    <div v-if="prop_match.meeBirdy === 1">
      <q-separator class="q-mb-sm" />
      <h5 class="q-mt-sm q-mb-sm">Birdie klassement</h5>
      <birdy-result :prop_match="prop_match" />
    </div>
  </q-page>
</template>

<style lang="sass">
.my-sticky-column-table
  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  max-width: 600px

  thead tr:first-child th:first-child
    /* bg color is important for th; just specify one */
    background-color: #00b4ff

  th:nth-child(2),
  td:nth-child(2),
  td:first-child
    background-color: #00b4ff

  th:first-child,
  th:nth-child(2),
  td:nth-child(2),
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>

<script>
import BirdyResult from "components/meerronde/birdyResult.vue";

export default {
  components: { BirdyResult },
  props: {
    prop_match: Object,
  },
  data() {
    return {
      dataResult: [
        {
          matchResult: [],
        },
      ],
      dataEclectic: {
        rows: [],
        holes: 9,
      },
    };
  },
  mounted() {
    this.loadResult();
    this.loadEclectic();
  },
  computed: {
    columnsResult() {
      let result = [];
      result.push({
        name: "rank",
        required: true,
        align: "center",
        label: "Pos",
        field: (row) => row.Rank,
      });

      result.push({
        name: "name",
        required: true,
        label: "Deelnemer",
        align: "left",
        field: (row) => row.name,
      });

      result.push({
        name: "total",
        label: "Punten",
        align: "left",
        field: (row) => row.total,
      });

      for (let i = 0; i < this.dataResult[0].matchResult.length; i++) {
        result.push({
          name: "name" + i,
          align: "center",
          label: this.dataResult[0].matchResult[i]["name"],
          field: (row) => {
            return row.matchResult[i]["score"];
          },
        });
      }
      return result;
    },
    columnsEclectic() {
      let result = [];
      result.push({
        name: "rank",
        required: true,
        align: "center",
        label: "Pos",
        field: (row) => row.rank,
      });

      result.push({
        name: "player",
        required: true,
        label: "Deelnemer",
        align: "left",
        field: (row) => row.player,
      });

      result.push({
        name: "total",
        required: true,
        label: "Punten",
        align: "left",
        field: (row) => row.total,
      });

      for (let i = 1; i <= this.dataEclectic.holes; i++) {
        const i_str = i.toString();
        result.push({
          name: "hole" + i,
          align: "center",
          label: "H" + i,
          field: (row) => {
            if (row[i_str] !== undefined) {
              return row[i_str]["score"]["points"];
            }
            return "-";
          },
        });
      }
      return result;
    },
  },
  methods: {
    async loadResult() {
      this.dataResult = await this.$http.get(
        "golfer/meerronde/result?meeNr=" + this.prop_match.meeNr
      );
    },
    async loadEclectic() {
      this.dataEclectic = await this.$http.get(
        "golfer/meerronde/eclectic?meeNr=" + this.prop_match.meeNr
      );
    },
  },
};
</script>
