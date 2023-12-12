<template>
  <q-page>
    <div class="row q-mb-sm" style="font-size: 14px; font-weight: bold">
      <div class="col-9">Uw clubjes</div>
      <div class="col-3 justify-end text-right">
        <q-btn
          color="primary"
          flat
          icon="add"
          round
          size="small"
          v-on:click="$emit('handleNew')"
        />
      </div>
    </div>
    <q-list bordered separator>
      <q-item
        v-for="(item, key) in $store.state.circles.circles"
        :key="key"
        v-ripple
        clickable
        v-on:click="$store.dispatch('circles/set', item.circle)"
      >
        <q-item-section>{{ item.circle.cirName }}</q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
export default {
  created: function () {
    this.$store.dispatch("circles/fetchCircles");
  },
};
</script>
