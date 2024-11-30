<template>
  <div class="q-mt-md">
    <q-list separator>
      <invoice-list-item
        v-for="(item, index) in list"
        :key="index"
        :item="item"
        v-on:handleOpen="handleOpen"
      />
    </q-list>

    <main v-if="!list" class="text-h6 text-center">
      Uw facturen worden opgehaald.
    </main>

    <q-banner
      v-else-if="list.length === 0"
      class="bg-orange-3 text-grey-8 text-bold text-center"
    >
      U heeft nog geen facturen
    </q-banner>
  </div>
</template>

<script>
import InvoiceListItem from "components/invoice/listItem.vue";

export default {
  name: "invoiceList",
  components: { InvoiceListItem },
  props: {
    list: Array,
  },
  methods: {
    handleOpen: function (item) {
      this.$emit("handleOpen", item);
    },
  },
};
</script>
