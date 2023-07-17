<template>
  <q-card class="q-mb-md" style="width: 100%">
    <q-card-section class="bg-light-green-3">
      <div class="text-h6">
        {{ card.pmtName }}
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="row justify-between">
        <div>Eerste transactie</div>
        <div class="text-bold">{{ firstDate }}</div>
      </div>

      <div class="row justify-between">
        <div>Laatste transactie</div>
        <div class="text-bold">{{ lastDate }}</div>
      </div>

      <div class="row justify-between">
        <div>Saldo</div>
        <div class="text-bold">{{ $filters.money(balance) }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: {
    card: Object,
    paymentArray: Array,
  },
  data: function () {
    return {};
  },
  computed: {
    payments: function () {
      return this.paymentArray.filter(
        (item) => item.payPmtNr == this.card.pmtNr
      );
    },
    balance: function () {
      return this.payments
        .map((item) => item.payAmount * -1)
        .reduce(function (a, b) {
          return a + b;
        });
    },
    firstDate: function () {
      if (this.payments.length === 0) {
        return "-";
      }
      if (this.payments[0].sales_transaction.trnTimestamp === null) {
        return "-";
      }
      return this.$dayjs(
        this.payments[0].sales_transaction.trnTimestamp
      ).format("dddd D MMMM YYYY H:mm");
    },
    lastDate: function () {
      if (this.payments.length === 0) {
        return "-";
      }
      if (
        this.payments[this.payments.length - 1].sales_transaction
          .trnTimestamp === null
      ) {
        return "-";
      }
      return this.$dayjs(
        this.payments[this.payments.length - 1].sales_transaction.trnTimestamp
      ).format("dddd D MMMM YYYY H:mm");
    },
  },
  created() {},
  methods: {},
};
</script>
