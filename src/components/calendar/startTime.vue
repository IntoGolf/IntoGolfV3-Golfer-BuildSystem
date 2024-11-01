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
  computed: {
    top() {
      let startHour = Math.floor(this.minTime / 60);
      let startMinute = startHour * 60;
      let comp = this.minTime - startMinute;
      return (this.start.sttTimeFrom - this.minTime + comp) * this.fact + "px";
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
      if (![0, 1].includes(this.start.sttRefType)) {
        return "100%";
      }
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
        let playersCount =
          this.start.sttPlayers === null ? 0 : this.start.sttPlayers;
        return time + " spelers: " + playersCount;
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
  white-space: nowrap; /* Prevent text from breaking to the next line */
  text-overflow: ellipsis; /* Hide overflow text with an ellipsis */
  width: 100%; /* Ensure the slot takes up the full width of its container */
}
</style>
