<template>
  <div>
    <q-separator class="q-mb-md" />
    <div v-if="lesson.pro_lesson_fee_player !== null" class="row q-pa-sm">
      <div class="col-12">Kies je tarief:</div>
      <div v-if="feeOptions.length > 1" class="col-12">
        <q-option-group v-model="localFee" :options="feeOptions" type="radio" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "publicLessonPricing",
  props: {
    lesson: Object,
    fee: Object,
  },
  data() {
    return {
      localFee: this.fee,
    };
  },
  mounted() {
    if (this.localFee === null) {
      this.localFee = this.feeOptions[0].value;
    }
  },
  computed: {
    feeOptions() {
      return this.lesson.pro_lesson_fee_les.map((price) => {
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
  watch: {
    localFee() {
      this.$emit("setFee", this.localFee);
    },
  },
};
</script>
