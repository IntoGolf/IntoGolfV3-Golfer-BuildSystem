<template>


  <q-card
      class="q-mb-md "
      style="width: 100%">

    <q-card-section
        :class="type == 'Opwaardering'?'bg-light-green-3':'bg-light-blue-3'">
      <div class="text-h6">{{ type }}</div>
      <div class="text-subtitle2">{{ dateTime }}</div>
    </q-card-section>

    <q-separator/>

    <q-card-section>

      <div v-if="type != 'Opwaardering'">
        <div
            class="row justify-between text-bold">
          <div>Artikel</div>
          <div>Prijs</div>
        </div>
        <div
            class="row justify-between"
            v-for="(sale,key) in payment.sales_transaction.sales"
            :key="key">

          <div>
            {{ sale.item.itmName }}
          </div>

          <div>
            {{ $filters.money(sale.salAmount) }}
          </div>

        </div>
        <div
            class="row justify-between text-bold">
          <div>Totaal</div>
          <div>{{ $filters.money(total) }}</div>
        </div>
      </div>

      <div
          v-else
          class="row justify-between">

        <div>
          Opgewaardeerd bedrag
        </div>

        <div>
          {{ $filters.money(amount) }}
        </div>

      </div>

      <div
          class="row justify-between text-bold q-mt-md">
        <div>Betaalwijze</div>
        <div>Bedrag</div>
      </div>

      <div
          class="row justify-between"
          v-for="(item,key) in payment.sales_transaction.payments"
          v-show="item.payAmount > 0"
          :key="key">

        <div>
          {{ item.pay_method.pmtName }}
        </div>

        <div>
          {{ $filters.money(item.payAmount) }}
        </div>

      </div>

      <div
          v-if="partialPayment"
          class="row text-italic">
        De betaling is een deelbetaling, het deel van de betaling dat hier vermeld staat is het deel dat op de
        betaalkaart
        is afgeschreven.
      </div>

    </q-card-section>

    <q-separator/>

    <q-card-section>

      <div
          class="row justify-between">

        <div>
          Oud saldo
        </div>

        <div>
          {{ $filters.money(balance + payment.payAmount) }}
        </div>

      </div>

      <div
          class="row justify-between">

        <div>
          Betaling
        </div>

        <div>
          {{ $filters.money(amount) }}
        </div>

      </div>

      <div
          class="row justify-between text-bold">

        <div>
          Nieuw saldo
        </div>

        <div>
          {{ $filters.money(balance) }}
        </div>

      </div>

    </q-card-section>

  </q-card>

</template>

<script>

export default {
  props: {
    payments: Array,
    payment: Object
  },
  data: function () {
    return {};
  },
  computed: {
    type: function () {
      if (this.payment.payAmount < 0 && this.payment.sales_transaction.sales.length === 0) {
        return 'Opwaardering'
      } else {
        return 'Kassa verkoop'
      }
    },
    amount: function () {
      return this.payment.payAmount < 0 ? this.payment.payAmount * -1 : this.payment.payAmount;
    },
    total: function () {
      return this.payment.sales_transaction.sales.map(item => item.salAmount).reduce(function (a, b) {
        return a + b;
      });
    },
    balance: function () {
      let result = 0;
      let done = false;
      this.payments.forEach(item => {
        if (done) {
          return;
        }
        result += (item.payAmount * -1);
        done = item.payNr == this.payment.payNr;
      })
      return result;
    },
    partialPayment: function () {
      return this.payment.payAmount > 0 &&
          this.payment.sales_transaction.sales.length > 0 &&
          this.payment.sales_transaction.payments.length > 1;
    },
    dateTime: function() {
      if (this.payment.sales_transaction.trnTimestamp == null) {
        return '-';
      }
      return this.$dayjs(this.payment.sales_transaction.trnTimestamp).format("dddd D MMMM YYYY H:mm");
    }
  },
  methods: {},
};
</script>
