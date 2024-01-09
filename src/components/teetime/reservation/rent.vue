<template>
  <q-list bordered separator>
    <rent-item
      v-for="(item, key) in flight.UniReservations"
      :key="key"
      :flight="flight"
      :item="item"
      v-on:handleRefresh="$emit('handleRefresh')"
    />
  </q-list>
</template>

<script>
import RentItem from "components/teetime/reservation/rentItem.vue";

export default {
  components: { RentItem },
  props: {
    flight: Object,
  },
};
</script>
