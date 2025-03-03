<template>
  <div>
    <div v-if="item !== null">
      <div class="row">
        <div class="col text-h5">
          {{ $filters.capitalizeFirstLetter(item.type.name) }}
        </div>
      </div>
      <q-separator class="q-mt-md q-mb-md"/>
      <div class="row">
        <div class="col-4">Datum</div>
        <div class="col-8">
          :
          {{ item.date }}
        </div>
      </div>
      <div class="row">
        <div class="col-4">Tijd</div>
        <div class="col-8">
          :
          {{ item.timeStart }}
        </div>
      </div>
      <div class="row">
        <div class="col-4">Plaatsen</div>
        <div class="col-8">
          :
          {{ item.type.maxPerson - item.size }}
        </div>
      </div>
      <div class="row">
        <div class="col-4">Kosten</div>
        <div class="col-8">: {{ $filters.money(item.fee.lfpPrice) }}</div>
      </div>
      <div class="row">
        <div class="col-4">Pro</div>
        <div class="col-8">: {{ item.pro.name }}</div>
      </div>
    </div>
    <q-separator class="q-mt-md q-mb-md"/>
    <div class="row">
      <div class="col text-right">
        <q-btn
          color="primary"
          label="Inschrijven"
          v-on:click="onOpen(item)"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "proThemLessonListDetails",
  props: {
    item: Object,
  },
  methods: {
    onOpen(item) {
      this.$emit('onOpen', item);
    }
  },
};
</script>
