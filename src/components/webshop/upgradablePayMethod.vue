<template>

  <q-card
      v-for="(amount,key) in amountArray"
      :key="key"
      class="q-mt-md">
    <q-card-section class="bg-green-4 text-white">
      <div class="row justify-between">
        <div class="text-h6">Opwaarderen {{ payMethod.pmtName }} kaart</div>
        <div class="text-h6">{{ $filters.money(amount) }}</div>
      </div>
    </q-card-section>

    <q-card-section class="q-mt-md q-mb-md">
      Waardeer u tegoed op en reken eenvoud af in horeca, shop en voor uw inflight bestellingen.
    </q-card-section>

    <q-separator/>
    <q-card-actions vertical align="right">
      <q-btn
          flat
          v-on:click="$emit('handleAddUpgradeToCart', payMethod, amount)">
        In winkelwagen
      </q-btn>
    </q-card-actions>
  </q-card>

</template>

<script>

export default {
  props: {
    payMethod: Object
  },
  data: function () {
    return {
      amountArray: [50,100,250,500]
    };
  }
};

</script>
