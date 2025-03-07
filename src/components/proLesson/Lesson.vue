<template>
  <div :class="bg" class="row full-width q-mt-md q-pa-sm pointer">
    <div class="col">
      <div class="row">
        <div class="col">
          <b class="float-left">{{
              $filters.minuteToTime(lesson.pagTimeFrom)
            }}</b>
          <i v-show="hasPrices" class="float-right">v.a. {{ price }}</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lesson: Object,
  },
  watch: {
    lesson: function (newValue) {
    },
  },
  computed: {
    max: function () {
      return this.lesson.pro_lesson_type.pltMaxPers;
    },
    players: function () {
      return this.lesson.pagGolfers;
    },
    slots: function () {
      return this.max - this.lesson.pagGolfers;
    },
    price: function () {
      if (!this.lesson.pro_lesson_fee_les) {
        return 0;
      }
      return this.$filters.money(this.lesson.pro_lesson_fee_les[0].lfpPrice);
    },
    hasPrices: function () {
      return this.lesson.pro_lesson_fee_les !== undefined;
    },
    bg: function () {
      if (this.players / this.max > 0.5) {
        return "bg-orange-3";
      }
      return "bg-green-3";
    },
  },
};
</script>
