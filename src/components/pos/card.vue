<template>
  <q-card class="q-mb-md" style="width: 100%">
    <q-card-section class="bg-light-green-3">
      <div class="text-h6">
        {{ payMethod.pmtName }}
      </div>
      <div class="text-subtitle1">Klik hier voor details</div>
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
    payMethod: Object,
  },
  computed: {
    transactions() {
      return this.payMethod.transactions;
    },
    firstDate: function () {
      if (this.transactions.length === 0) {
        return "-";
      }
      if (this.transactions[0].trnTimestamp === null) {
        return "-";
      }
      return this.$dayjs(this.transactions[0].trnTimestamp).format(
        "dddd D MMMM YYYY H:mm"
      );
    },
    lastDate: function () {
      if (this.transactions.length === 0) {
        return "-";
      }
      if (
        this.transactions[this.transactions.length - 1].trnTimestamp === null
      ) {
        return "-";
      }
      return this.$dayjs(
        this.transactions[this.transactions.length - 1].trnTimestamp
      ).format("dddd D MMMM YYYY H:mm");
    },
    balance: function () {
      if (this.transactions.length === 0) {
        return 0;
      }
      return this.transactions[this.transactions.length - 1].balance;
    },
  },
};
</script>
