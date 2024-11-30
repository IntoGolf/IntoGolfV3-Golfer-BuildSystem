<template>
  <q-item
    v-ripple
    class="w-100 bg-white border rounded shadow-1 q-mb-sm"
    clickable
    @click="handleDownload"
  >
    <q-item-section avatar>
      {{ item.invDate }}
      <q-item-label caption> Datum</q-item-label>
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-truncate">
        {{ item.invInvoiceId }}
      </q-item-label>

      <q-item-label caption>
        Bedrag: {{ $filters.money(item.total) }}
      </q-item-label>
    </q-item-section>

    <q-item-section avatar>
      <q-item-label class="text-truncate">
        <q-icon name="download" />
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<style lang="scss" scoped>
.itg-q-item {
  background-color: white;
}

.page-handicap-list {
  .border-top-none {
    border-top: none !important;
  }

  .table-summary {
    tr:first-child {
      th,
      td {
        border-top: none !important;
      }
    }
  }
}

.itg-text-qualifying {
  color: #00d97e;
  text-align: center;
}

.itg-text-non-qualifying {
  color: orange;
  text-align: center;
}
</style>

<script>
export default {
  name: "invoiceListItem",
  props: {
    item: Object,
  },
  methods: {
    async handleDownload() {
      let response = await this.$http.post(`invoice/download`, this.item, {
        responseType: "arraybuffer",
      });

      let headerLine = response.headers["content-disposition"];
      let startFileNameIndex = headerLine.indexOf("=") + 1;
      let endFileNameIndex = headerLine.lastIndexOf(".pdf") + 4;
      let filename = headerLine.substring(startFileNameIndex, endFileNameIndex);

      let blob = new Blob([response.data], {
        type: "application/pdf",
      });

      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    },
  },
};
</script>
