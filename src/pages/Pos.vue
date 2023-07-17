<template>
  <q-page-container class="q-mt-md">
    <div class="q-ma-md">
      <div v-if="!selectedCard">
        <div class="text-h5 q-mb-md">Betaalkaarten</div>

        <Card
          v-for="(card, key) in cardArray"
          :key="key"
          :card="card"
          :paymentArray="paymentArray"
          v-on:click="selectedCard = card"
        />
      </div>

      <div v-else>
        <CardTransactions
          v-if="selectedCard"
          :paymentArray="paymentArray"
          :selectedCard="selectedCard"
          v-on:handleCloseCard="selectedCard = null"
        />
      </div>
    </div>
  </q-page-container>
</template>

<script>
// import Transaction from "components/pos/transaction.vue";
import Card from "components/pos/card.vue";
import CardTransactions from "components/pos/cardTransactions.vue";
import authMixin from "../mixins/auth";

export default {
  mixins: [authMixin],
  components: { CardTransactions, Card },
  data: function () {
    return {
      paymentArray: [],
      selectedCard: null,
    };
  },
  computed: {
    cardArray: function () {
      let array = [];
      this.paymentArray.forEach(function (payment) {
        if (payment.pay_method.pmtPtpNr !== 4) {
          return;
        }

        let payMethod = array.find(
          (item) => item.pmtNr === payment.payPmtNr && item.pmtPtpNr == 4
        );

        if (payMethod === undefined) {
          array.push(payment.pay_method);
        }
      });
      return array;
    },
  },
  mounted() {
    this.$http.get("golfer/balance").then((res) => {
      this.paymentArray = res;
    });
  },
};
</script>
