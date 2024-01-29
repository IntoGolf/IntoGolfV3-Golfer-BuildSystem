<template>
  <q-item
    v-ripple
    class="full-width bg-white shadow-1 q-mb-sm"
    clickable
    style="border-radius: 4px"
  >
    <q-item-section>
      <q-item-label>
        <div class="row">
          <div class="col-8">
            <b>{{ item.date }}</b>
          </div>
          <div class="col-4 text-right">
            <b>{{ $filters.money(item.total) }}</b>
          </div>
        </div>
      </q-item-label>
      <q-separator class="q-mt-sm q-mb-sm" />
      <q-item-label v-for="(row, id) in item.rows" :key="id">
        <div class="row">
          <div class="col-8">
            {{ row.itmName }}
          </div>
          <div class="col-2 text-center">{{ row.pbrQuantity }}X</div>
          <div class="col-2 text-right">
            {{ $filters.money(row.pbrSysPrice) }}
          </div>
        </div>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  computed: {
    total() {
      return 0;
    },
  },
  methods: {},
};
</script>
