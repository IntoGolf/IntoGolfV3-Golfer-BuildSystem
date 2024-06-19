<template>
  <q-card class="q-mb-md" style="width: 100%">
    <q-card-section
      :class="
        transaction.type === 'Opwaardering'
          ? 'bg-light-green-3'
          : 'bg-light-blue-3'
      "
    >
      <div class="text-h6">{{ transaction.type }}</div>
      <div class="text-subtitle2">{{ transaction.trnTimestamp }}</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div v-if="transaction.type !== 'Opwaardering'">
        <div class="row justify-between text-bold">
          <div class="col-6">Artikel</div>
          <div class="col-3 text-center">Aantal</div>
          <div class="col-3 text-right">Prijs</div>
        </div>
        <div
          v-for="(sale, key) in transaction.sales"
          :key="key"
          class="row justify-between"
        >
          <div class="col-6">
            {{ sale.itmName }}
          </div>

          <div class="col-3 text-center">
            {{ sale.salQuantity }}
          </div>

          <div class="col-3 text-right">
            {{ $filters.money(transaction.payAmount) }}
          </div>
        </div>
        <div class="row justify-between text-bold text-right">
          <div>Totaal</div>
          <div>{{ $filters.money(transaction.total) }}</div>
        </div>
      </div>

      <div v-else class="row justify-between">
        <div>Opgewaardeerd bedrag</div>

        <div class="text-right">
          {{ $filters.money(transaction.payAmount) }}
        </div>
      </div>

      <div class="row justify-between text-bold q-mt-md">
        <div>Betaalwijze</div>
        <div>Bedrag</div>
      </div>

      <div class="row justify-between">
        <div class="col-9">
          {{ transaction.pmtName }}
        </div>

        <div class="col-3 text-right">
          {{ $filters.money(transaction.payAmount) }}
        </div>
      </div>

      <!--      <div v-if="partialPayment" class="row text-italic">-->
      <!--        De betaling is een deelbetaling, het deel van de betaling dat hier-->
      <!--        vermeld staat is het deel dat op de betaalkaart is afgeschreven.-->
      <!--      </div>-->
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="row justify-between">
        <div>Oud saldo</div>

        <div>
          {{ $filters.money(transaction.oldBalance) }}
        </div>
      </div>

      <div class="row justify-between">
        <div>Betaling</div>

        <div>
          {{ $filters.money(transaction.payAmount) }}
        </div>
      </div>

      <div class="row justify-between text-bold">
        <div>Nieuw saldo</div>

        <div>
          {{ $filters.money(transaction.balance) }}
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: {
    transaction: Object,
  },
};
</script>
