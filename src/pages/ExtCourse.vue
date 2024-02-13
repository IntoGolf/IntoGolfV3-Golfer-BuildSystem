<template>
  <q-page-container>
    <q-page class="q-pa-sm">
      <div class="text-h6">Baanstatus</div>
      <div v-html="subsectionContent" />
    </q-page>
  </q-page-container>
</template>

<script>
// Import Axios
// Import Cheerio

export default {
  data() {
    return {
      subsectionContent: "",
    };
  },
  mounted() {
    this.loadHtml();
  },
  methods: {
    async loadHtml() {
      this.subsectionContent = await this.$http.get("public/cps");
    },
  },
};
</script>

<style>
table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  padding: 8px;
  text-align: left;
}

td:first-child {
  font-weight: bold;
}
</style>
