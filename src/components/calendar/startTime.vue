<template>
  <div :style="timeSlotStyle" class="row slot">
    {{ text }}
  </div>
</template>

<script>
export default {
  props: {
    start: {
      type: Object,
      required: true,
    },
    fact: {
      type: Number,
      required: true,
    },
  },
  computed: {
    text() {
      let time = this.$filters.minuteToTime(this.start.sttTimeFrom) + " ";
      if (this.start.sttDescr === null) {
        return "";
      } else if (this.start.sttDescr.length > 0) {
        return time + this.start.sttDescr;
      } else if (this.start.sttPlayerName1 !== undefined) {
        return time + this.start.sttPlayerName1;
      } else {
        return "&nbsp";
      }
    },
    timeSlotStyle() {
      let height = `${
        (this.start.sttTimeTo - this.start.sttTimeFrom) * this.fact
      }px`;
      let color = "#FFFFFF";
      let fontColor = "white";
      if (this.start.sttRefType === 1) {
        color = this.start.sttGrpColor1;
        fontColor = this.start.sttGrpFontColor1;
      } else if (this.start.sttRefType > 1) {
        color = "blue";
      } else if (this.start.sttRefType < 0) {
        fontColor = "black";
        color = "lightblue";
      }
      return {
        backgroundColor: color,
        height: height,
        color: fontColor,
        borderBottom: this.start.sttGrpColor1 ? "1px solid white" : "",
      };
    },
  },
};
</script>

<style scoped>
.slot {
  color: #2f4f4f;
  font-size: 0.7em;
  overflow: hidden;
  padding: 5px 2px 5px 0;
}
</style>
