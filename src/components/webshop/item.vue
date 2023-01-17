<template>

  <q-card class="q-mt-md">
    <q-card-section class="bg-teal text-white">
      <div class="row justify-between">
        <div class="text-h6">{{ item.itmShortName }}</div>
        <div class="text-h6">{{ $filters.money(item.itmPrice) }}</div>
      </div>
    </q-card-section>

    <q-card-section class="q-mt-md q-mb-md">
      {{ item.itmWebText }}
    </q-card-section>


    <q-separator/>
    <q-card-actions vertical align="right">
      <q-btn
          flat
          v-on:click="$emit('handleAddToCart')">
        In winkelwagen
      </q-btn>
    </q-card-actions>
  </q-card>

</template>

<script>

export default {
  props: {
    item: Object
  },
  computed: {}
};

</script>
