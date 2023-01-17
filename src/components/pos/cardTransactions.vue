<template>

  <div>

    <div class="row justify-between items-center text-h5 q-mb-md">

        <div>
          Betaalkaart {{ selectedCard.pmtName }}
        </div>

        <q-icon
            name="arrow_back"
            v-on:click="$emit('handleCloseCard')"/>

    </div>

    <Transaction
        v-for="(payment,key) in payments"
        :key="key"
        :payments="payments"
        :payment="payment"/>

  </div>

</template>

<script>

import Transaction from "components/pos/transaction.vue";

export default {
  components: {Transaction},
  props: {
    selectedCard: Object,
    paymentArray: Array
  },
  computed: {
    payments: function () {
      return this.paymentArray.filter(item => item.payPmtNr == this.selectedCard.pmtNr);
    }
  }
};

</script>
