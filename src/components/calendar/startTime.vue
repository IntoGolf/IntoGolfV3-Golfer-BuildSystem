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
    starts: {
      type: Array,
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
    aKey: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    console.log(this.sameFlight);
  },
  computed: {
    top() {
      return (this.start.sttTimeFrom - this.minTime) * this.fact + "px";
    },
    prevCount() {
      let players = 0;
      if (
        this.starts[this.aKey - 3] !== undefined &&
        this.starts[this.aKey - 3].sttTimeFrom === this.start.sttTimeFrom
      ) {
        players += this.starts[this.aKey - 3].sttMaxPlayers;
      }

      if (
        this.starts[this.aKey - 2] !== undefined &&
        this.starts[this.aKey - 2].sttTimeFrom === this.start.sttTimeFrom
      ) {
        players += this.starts[this.aKey - 2].sttMaxPlayers;
      }

      if (
        this.starts[this.aKey - 1] !== undefined &&
        this.starts[this.aKey - 1].sttTimeFrom === this.start.sttTimeFrom
      ) {
        players += this.starts[this.aKey - 1].sttMaxPlayers;
      }
      return players;
    },
    cellMargin() {
      return this.prevCount * 25 + "%";
    },
    cellWidth() {
      return (100 / 4) * this.start.sttMaxPlayers + "%";
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
        width: this.cellWidth,
        marginLeft: this.cellMargin,
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
  position: absolute;
}
</style>
