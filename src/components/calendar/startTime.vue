<template>
  <div :style="timeSlotStyle" class="row slot" @click="showBooking">
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
    minTime: {
      type: Number,
      required: true,
    },
  },
  computed: {
    top() {
      return (this.start.sttTimeFrom - this.minTime) * this.fact + "px";
    },
    showDialog() {
      return this.$store.getters["currentUser/usrHasCalendar"] === 3;
    },
    text() {
      let time = this.$filters.minuteToTime(this.start.sttTimeFrom) + " ";
      if (this.start.sttDescr === null || this.start.isEvent) {
        return "";
      } else if (this.start.sttDescr.length > 0) {
        return time + this.start.sttDescr;
      } else if (this.start.sttPlayerName1 !== undefined) {
        return time + this.start.sttPlayerName1;
      } else {
        return time + " aantal spelers: " + this.start.sttPlayers;
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
        top: this.top,
      };
    },
  },
  methods: {
    showBooking() {
      if (this.start.sttRefType !== 1 || !this.showDialog) {
        return;
      }

      let trimmedArray = this.start.sttDescr.split("|").map((s) => s.trim());
      let textWithArray = "- " + trimmedArray.join("<br> - ");

      this.$q
        .dialog({
          title: "Speler(s) op flight:",
          message: textWithArray,
          html: true,
          persistent: true,
        })
        .onOk(() => {});
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
  width: 100%;
  position: absolute;
}
</style>
