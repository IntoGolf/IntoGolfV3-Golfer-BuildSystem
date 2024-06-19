<template>
  <q-page-container>
    <q-page class="q-pa-sm">
      <div v-if="!payMethod">
        <div class="text-h5 q-mb-md">Betaalkaarten</div>

        <Card
          v-for="(item, key) in payMethodArray"
          :key="key"
          :payMethod="item"
          v-on:click="payMethod = item"
        />
      </div>

      <div v-else>
        <CardTransactions
          v-if="payMethod"
          :payMethod="payMethod"
          :payMethodArray="payMethodArray"
          v-on:handleCloseCard="payMethod = null"
        />
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import Card from "components/pos/card.vue";
import CardTransactions from "components/pos/cardTransactions.vue";
import authMixin from "../mixins/auth";

export default {
  mixins: [authMixin],
  components: { CardTransactions, Card },
  data: function () {
    return {
      payMethodArray: [],
      payMethod: null,
    };
  },
  created() {
    this.getBalance();
  },
  methods: {
    async getBalance() {
      let res = await this.$http.get("golfer/balance");
      this.payMethodArray = res.data;
    },
  },
};
</script>
