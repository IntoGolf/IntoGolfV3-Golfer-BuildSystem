<template>
  <q-list v-if="bills.length > 0" class="q-mb-sm" separator>
    <bill v-for="(item, key) in bills" :key="key" :item="item"/>
  </q-list>
</template>

<script>
import Bill from "components/dashboard/bill.vue";

export default {
  components: {Bill},
  created() {
    this.loadBills();
  },
  computed: {
    bills() {
      return this.$store.getters["bills/items"];
    },
  },
  methods: {
    async loadBills() {
      await this.$store.dispatch("bills/fetchItems");
    },
  },
};
</script>
