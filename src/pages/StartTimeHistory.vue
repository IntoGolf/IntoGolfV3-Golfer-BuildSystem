<template>
  <q-card style="height: 100vh; padding: 20px 10px 10px 10px; overflow: scroll">
    <graph
      v-if="typeId === 0"
      :chartData="chartData"
      :loaded="loaded"
      v-on:setTypeId="setTypeId"
    />
    <data-table
      v-else
      :list="list"
      :typeId="typeId"
      v-on:handleClose="typeId = 0"
    />
  </q-card>
</template>
<script>
import Graph from "components/History/graph.vue";
import dataTable from "components/History/table.vue";

export default {
  components: { Graph, dataTable },
  data() {
    return {
      list: [],
      typeId: 0,
      loaded: false,
      chartData: null,
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    async load() {
      this.loaded = false;
      this.chartData = await this.$http.get("startTimes/historyGraph");
      this.list = await this.$http.get("startTimes/historyList");
      this.loaded = true;
    },
    setTypeId(id) {
      this.typeId = id;
    },
  },
};
</script>
