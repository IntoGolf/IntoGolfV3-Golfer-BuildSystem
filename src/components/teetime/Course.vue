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
  },
  computed: {
    times: function () {
      return Object.values(this.course.times).filter((t) => {
        return (
          (this.holes.value === 9 ||
            (this.holes.value === 18 && t.sttCrlNrNext > 0)) &&
          t.sttMaxPlayers >= this.size
        );
      });
    },
  },
};
</script>
