<template>
  <q-page class="q-pa-sm">
    <div class="text-h6">Overzicht</div>
    <div>Klik op de factuur on deze de downloaden</div>
    <invoice-list :list="list" />
  </q-page>
</template>

<script>
import InvoiceList from "components/invoice/list.vue";

export default {
  name: "app_invoice",
  components: { InvoiceList },
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.handleLoadList();
  },
  methods: {
    async handleLoadList() {
      this.list = await this.$http.get("invoice/get");
    },
    handleOpen: function (item) {
      this.$emit("handleOpen", item);
    },
  },
};
</script>
