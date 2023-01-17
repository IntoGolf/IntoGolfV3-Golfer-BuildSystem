<template>

  <div>

    <div v-show="!upgrade">

      <div style="width: 100%">
        <div style="float: left">
          <h5 style="margin-top: 0px; margin-bottom: 20px">Betaalkaart {{ selectedCard.pmtName }}</h5>
        </div>
        <div style="float: right">
          <q-icon
              name="arrow_back"
              style="font-size: 2em;
              margin-top: 5px"
              v-on:click="$emit('handleCloseCard')"/>
        </div>
      </div>

      <Transaction
          v-for="(payment,key) in payments"
          :key="key"
          :payments="payments"
          :payment="payment"/>

    </div>

    <div v-show="upgrade">

      <div
          style="width: 100%; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 10px; margin-bottom: 10px; font-size: 1.3em; color: #393939FF;"
          v-on:click="upgrade = false">
        Terug naar kaarten
      </div>

      <div
          v-for="(item,key) in upgradeAmounts"
          :key="key"
          class="row text-center"
          style="width: 100%; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); padding: 10px; margin-bottom: 10px">

        <div style="width: 100%">

          <div class="float-left" style="font-size: 1.3em; color: #393939FF">
            Opwaarderen saldo
          </div>

          <div class="float-right text-right">
            <div style="width: 100%;font-size: 2em; color: #1d1d1d">
              {{ $filters.money(item.amount) }}
            </div>
            <div style="width: 100%;font-size: 1em; color: #393939FF;">
              tegoed
            </div>
          </div>

        </div>

      </div>

    </div>

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
  data: function () {
    return {
      upgradeAmounts: [
        {id: 1, amount: 50},
        {id: 2, amount: 100},
        {id: 3, amount: 250},
        {id: 4, amount: 500}
      ],
      upgrade: false
    };
  },
  computed: {
    payments: function () {
      return this.paymentArray.filter(item => item.payPmtNr == this.selectedCard.pmtNr);
    }
  },
  mounted() {
    console.log(this.selectedCard);
  },
  methods: {},
};
</script>
