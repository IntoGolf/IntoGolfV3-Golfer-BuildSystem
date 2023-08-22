<template>
  <div :class="bg" class="row full-width q-mt-md q-pa-sm">
    <div class="col">
      <div class="row">
        <div class="col">
          <b>{{ $filters.minuteToTime(lesson.pagTimeFrom) }}</b>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <i>{{ slots }} plaatsen</i>
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
    lesson: function (newValue) {},
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
    bg: function () {
      console.log(this.players / this.max);
      if (this.players / this.max > 0.5) {
        return "bg-orange-3";
      }
      return "bg-green-3";
    },
  },
};
</script>
