<template>
  <div>
    <div
      v-for="(time, key) of times"
      :key="key"
      class="row text-center q-pt-xs"
      v-on:click="this.$emit('setTimeObject', time)"
    >
      <div class="col q-pa-sm bg-green-3 cursor-pointer">
        {{ $filters.minuteToTime(time.sttTimeFrom) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    course: Object,
    holes: Number,
    size: Number,
    per: Object,
  },
  computed: {
    from: function () {
      let result = 240;
      if (this.per.value === 3) {
        result = 720;
      } else if (this.per.value === 4) {
        result = 1080;
      }
      return result;
    },
    to: function () {
      let result = 1439;
      if (this.per.value === 2) {
        result = 720;
      } else if (this.per.value === 3) {
        result = 1080;
      }
      return result;
    },
    times: function () {
      return Object.values(this.course.times).filter((t) => {
        return (
          (this.holes.value === 9 ||
            (this.holes.value === 18 && t.sttCrlNrNext > 0)) &&
          t.sttTimeFrom >= this.size &&
          t.sttTimeFrom >= this.from &&
          t.sttTimeFrom < this.to
        );
      });
    },
  },
};
</script>
