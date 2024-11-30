<template>
  <q-table
    v-if="data.length > 0"
    :columns="columnsResult"
    :rows="data"
    :rows-per-page-options="[0]"
    bordered
    class="my-sticky-column-table"
    flat
    height="200"
    hide-pagination
    row-key="name"
  />
</template>

<style lang="sass">
.my-sticky-column-table
  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  max-width: 600px

  th:first-child,
  th:nth-child(2),
  td:nth-child(2),
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>

<script>
export default {
  props: {
    prop_match: Object,
  },
  data() {
    return {
      data: [],
    };
  },
  mounted() {
    this.loadBirdy();
  },
  computed: {
    columnsResult() {
      let result = [];
      result.push({
        name: "rank",
        required: true,
        align: "center",
        label: "Pos",
        field: (row) => row.rank,
      });

      result.push({
        name: "name",
        required: true,
        label: "Deelnemer",
        align: "left",
        field: (row) => row.scores.playerName,
      });

      result.push({
        name: "total",
        label: "Punten",
        align: "left",
        field: (row) => row.points,
      });

      result.push({
        name: "AL",
        align: "center",
        label: "AL",
        field: (row) => {
          return row.scores.AL;
        },
      });

      result.push({
        name: "EA",
        align: "center",
        label: "EA",
        field: (row) => {
          return row.scores.EA;
        },
        headerClasses: "bg-green text-white",
        classes: "bg-green text-white",
      });

      result.push({
        name: "BI",
        align: "center",
        label: "BI",
        field: (row) => {
          return row.scores.BI;
        },
        headerClasses: "bg-orange text-white",
        classes: "bg-orange text-white",
      });

      result.push({
        name: "PA",
        align: "center",
        label: "PA",
        field: (row) => {
          return row.scores.PA;
        },
        headerClasses: "bg-yellow",
        classes: "bg-yellow",
      });

      result.push({
        name: "BO",
        align: "center",
        label: "BO",
        field: (row) => {
          return row.scores.BO;
        },
        headerClasses: "bg-red text-white",
        classes: "bg-red text-white",
      });

      result.push({
        name: "DB",
        align: "center",
        label: "DB",
        field: (row) => {
          return row.scores.DB;
        },
      });

      return result;
    },
  },
  methods: {
    async loadBirdy() {
      this.data = await this.$http.get(
        "golfer/birdy?meeNr=" + this.prop_match.meeNr
      );
    },
  },
};
</script>
