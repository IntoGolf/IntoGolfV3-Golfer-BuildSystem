<template>
  <div>
    <div class="row justify-between items-center text-h5 q-mb-md">
      <div>Betaalkaart {{ payMethod.pmtName }}</div>
      <q-icon name="arrow_back" v-on:click="$emit('handleCloseCard')" />
    </div>

    <Transaction
      v-for="(transaction, key) in payMethod.transactions.slice(-50).reverse()"
      :key="key"
      :transaction="transaction"
    />
  </div>
</template>

<script>
import Transaction from "components/pos/transaction.vue";

export default {
  components: { Transaction },
  props: {
    payMethod: Object,
  },
};
</script>
