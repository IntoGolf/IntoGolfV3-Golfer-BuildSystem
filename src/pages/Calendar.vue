<template>
  <div
    style="width: 100%; margin-left: auto; margin-right: auto; margin-top: 80px"
  >
    <div class="row">
      <div class="col">
        <q-input v-model="date" :rules="['date']" filled mask="date">
          <template v-slot:append>
            <q-icon class="cursor-pointer" name="event">
              <q-popup-proxy
                ref="myPopup"
                cover
                transition-hide="scale"
                transition-show="scale"
              >
                <q-date v-model="date" @update:model-value="closePopup">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup color="primary" flat label="Close" />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
    </div>
    <div class="row calendar-row">
      <div class="hour-col">
        <div
          v-for="(hour, key) in hours"
          :key="key"
          :class="hourRowClass(hour)"
          :style="loopStyle"
        >
          <div v-if="hour < hours" class="hour-label">
            {{ timeText(hour) }}
          </div>
        </div>
      </div>
      <div
        v-for="(loop, key) in courseLoops"
        :key="key"
        :style="{ width: columnWidth }"
        class="calendar-col"
      >
        <div
          :class="{
            'border-left': key !== 0,
          }"
          class="calendar-header"
        >
          {{ loop.crlName }}
        </div>
        <q-separator />
        <calendar-loop
          :data="data"
          :fact="fact"
          :hours="hours"
          :loop="loop"
          :loopKey="key"
          :minTime="minTime"
        />
      </div>
    </div>
  </div>
</template>

<script>
import calendarLoop from "../components/calendar/loop.vue";

export default {
  components: {
    calendarLoop,
  },
  data() {
    return {
      fact: 3,
      data: [],
      date: null,
    };
  },
  created() {
    this.date = this.$dayjs().format("YYYY-MM-DD");
  },
  watch: {
    date() {
      this.loadCalendar();
    },
  },
  computed: {
    courseLoops() {
      if (this.data.length === 0) {
        return [];
      }
      const uniqueSet = new Set();
      return this.data
        .filter((obj) => {
          const key = `${obj.sttCrlNr}-${obj.crlName}`;
          if (!uniqueSet.has(key)) {
            uniqueSet.add(key);
            return true;
          }
          return false;
        })
        .map((obj) => ({
          sttCrlNr: obj.sttCrlNr,
          crlName: obj.crlName,
        }));
    },
    columnWidth() {
      let cols = this.courseLoops.length;
      return "calc((100% - 40px) / " + cols + ")";
    },
    minTime() {
      return this.data.reduce((min, obj) => {
        return min === null || obj.sttTimeFrom < min ? obj.sttTimeFrom : min;
      }, null);
    },
    maxTime() {
      return this.data.reduce((max, obj) => {
        return max === null || obj.sttTimeFrom > max ? obj.sttTimeFrom : max;
      }, null);
    },
    hours() {
      return Math.ceil((this.maxTime - this.minTime) / 60) + 1;
    },
    loopStyle() {
      return {
        paddingTop: 60 * this.fact - 8 + "px",
        height: 60 * this.fact + "px",
      };
    },
    startHour() {
      return Math.floor(this.minTime / 60);
    },
  },
  methods: {
    async loadCalendar() {
      this.data = await this.$http.get("calendar?date=" + this.date);
    },
    hourRowClass(hour) {
      if (hour < this.hours) {
        return "hour-row";
      }
      return "";
    },
    timeText(hour) {
      return this.$filters.minuteToTime((this.startHour + hour) * 60);
    },
    closePopup() {
      console.log("test");
      console.log(this.$refs.myPopup);
      this.$refs.myPopup.hide(); // Assuming 'myPopup' is the ref for q-popup-proxy
    },
  },
};
</script>

<style>
body {
  background-color: white;
}

.calendar-header {
  font-size: 11px;
  color: gray;
  font-weight: bolder;
  text-align: center;
}

.calendar-row {
  border: 1px solid lightgrey;
}

.calendar-col {
  width: 100%;
}

.border-left {
  border-left: 1px solid lightgrey;
}

.hour-col {
  padding-top: 18px;
  background-color: #f8f8f8;
  width: 40px;
  border-right: 1px solid lightgrey;
}

.hour-label {
  background-color: #f8f8f8;
  color: #2f4f4f;
  width: 30px;
  margin-left: auto;
  margin-right: auto;
}

.hour-row {
  border-bottom: 1px solid #708090;
  font-size: 11px;
  text-align: center;
}
</style>
