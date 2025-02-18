<template>
  <div>
    <q-separator class="q-mb-md"/>
    <div class="row q-pa-sm">
      <div class="col-12">Kies je tarief:</div>
      <div v-if="feeOptions.length > 1" class="col-12">
        <q-option-group v-model="lForm.fee" :options="feeOptions" type="radio"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "publicLessonClientPricing",
  props: {
    form: Object,
  },
  data() {
    return {
      lForm: this.form,
    };
  },
  mounted() {
    this.lForm.fee = this.lForm.pro_lesson_fee_les[0];
  },
  computed: {
    feeOptions() {
      return this.lForm.pro_lesson_fee_les.map((price) => {
        let personText = price.lfpSizeTo === 1 ? " persoon " : " personen ";
        let numberText = price.lfpSizeFrom;
        if (price.lfpSizeFrom !== price.lfpSizeTo) {
          numberText += " tot " + price.lfpSizeTo;
        }
        return {
          label: numberText + personText + this.$filters.money(price.lfpPrice),
          value: price,
        };
      });
    },
  },
};
</script>
