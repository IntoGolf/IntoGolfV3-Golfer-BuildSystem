<template>
  <div class="row">
    <div :style="loopStyle" class="col loop-col">
      <start-time
        v-for="(start, key) in starts"
        :key="key"
        :fact="fact"
        :minTime="minTime"
        :start="start"
      />
    </div>
  </div>
</template>

<script>
import StartTime from "./startTime.vue";

export default {
  components: { StartTime },
  props: {
    data: Array,
    loop: Object,
    minTime: Number,
    fact: Number,
    loopKey: Number,
    hours: Number,
  },
  computed: {
    starts() {
      return this.data.filter((res) => res.sttCrlNr === this.loop.sttCrlNr);
    },
    lMinTime() {
      return this.starts.reduce((min, obj) => {
        return min === null || obj.sttTimeFrom < min ? obj.sttTimeFrom : min;
      }, null);
    },
    loopStyle() {
      let startHour = Math.floor(this.minTime / 60);
      return {
        width: "100%",
        paddingTop: (this.lMinTime - startHour * 60) * this.fact + "px",
        borderLeft: this.loopKey > 0 ? "1px solid lightgrey" : "",
        height: 60 * this.hours * this.fact + "px",
      };
    },
  },
};
</script>

<style scoped>
.loop-col {
  position: relative;
}
</style>
