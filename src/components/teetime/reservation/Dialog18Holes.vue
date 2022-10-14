<template>

  <q-dialog
      ref="dialog_h18"
      @hide="onDialogHide">

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
    flight: Object,
    dialogVisible: Boolean
  },
  data: function () {
    return {
      teetimes: [],
      local_flight: {...this.flight}
    };
  },
  watch: {
    dialogVisible: function(newValue) {
      if (newValue) {
        this.$refs.dialog_h18.show()
      } else {
        this.$refs.dialog_h18.hide()
      }
    }
  },
  computed: {
    filteredArray: function () {
      let that = this;
      let result = [];

      this.teetimes.forEach(function (loop, lIndex) {
        Object.entries(loop.times).forEach(function (time) {
          if (time[1].sttTimeFrom > that.flight.fltTime1 + 130) {
            result.push({
              crlNr: loop.crlNr,
              crlName: loop.crlName,
              sttTimeFrom: time[1].sttTimeFrom,
              sttTimeFromText: that.$filters.minuteToTime(time[1].sttTimeFrom),
            });
          }
        })
      })
      return result;
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
    handleSave: function(object) {
      this.local_flight.fltCrlNr2 = object.crlNr;
      this.local_flight.fltTime2 = object.sttTimeFrom;
      this.$http.post(`golfer/booking`, this.local_flight).then((res) => {
        this.$emit('handleClose',res.flight);
      });
    },
    onDialogHide: function() {
      this.$emit('handleClose');
    }
  }
};
</script>
