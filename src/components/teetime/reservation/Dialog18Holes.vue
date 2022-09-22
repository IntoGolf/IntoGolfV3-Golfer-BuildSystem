<template>

  <q-dialog>

    <q-card style="max-width: 320px; width: 95%">

      <q-card-section class="text-h6">
        Uw tweede 9

        <q-btn
            class="float-right"
            flat
            v-on:click="$emit('handleClose')"
            label="Sluiten"/>

      </q-card-section>

      <q-separator/>

      <q-card-section>

        <div
            class="q-ma-xs button-second-nine"
            v-for="(time, key) in filteredArray"
            :key="key"
            v-on:click="handleSave(time)">
          {{ time.crlName + ' ' + time.sttTimeFromText }}
        </div>

      </q-card-section>

    </q-card>

  </q-dialog>

</template>

<script>

export default {
  props: {
    flight: Object
  },
  data: function () {
    return {
      teetimes: [],
      local_flight: {...this.flight}
    };
  },
  computed: {

    timesFor18: function () {

      this.teetimes.forEach(function (loop, lIndex) {
        let array = [];
        Object.entries(loop.times).forEach(function (time) {
          if (time[1].sttTimeFrom > that.flight.fltTime1 + 130) {
            array.push(time[1])
          }
        })
        this.teetimes[lIndex].times = array;
      })

      return this.teetimes;
    },

    filteredArray: function () {
      let array = [];

      this.teetimes.entries(loop.times).forEach(function (time) {
        if (time[1].sttTimeFrom > that.flight.fltTime1 + 130) {
          array.push(time[1])
        }
      })

      return array;
    }
  },
  created() {
    this.handleLoadTeetimes();
  },
  methods: {
    handleLoadTeetimes: function () {
      let date = this.$filters.unixToDate(this.flight.fltDate, "YYYY-MM-DD");
      this.$http.get("golfer/teetimes?date=" + date).then((res) => {
        this.teetimes = res.payload;
      });
    },
    handleSave: function() {
      this.local_flight.fltCrlNr2 = object.crlNr;
      this.local_flight.fltTime2 = object.sttTimeFrom;

    }
  }
};
</script>
