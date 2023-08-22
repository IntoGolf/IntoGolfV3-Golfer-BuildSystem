<template>
  <q-card
    v-for="(booking, key) in bookingsArray"
    :key="key"
    class="dashboard-card q-mb-md"
  >
    <q-card-section class="bg-blue-3 dashboard-card-title">
      Starttijd
    </q-card-section>
    <q-card-section class="q-pa-sm">
      <div class="row q-pa-sm" style="background-color: #f2f2f2">
        <div class="col-4 text-bold">Datum:</div>
        <div class="col-8">
          {{ $filters.unixToDate(booking.fltDate, "dddd DD MMMM") }}
        </div>
      </div>
      <div class="row q-pa-sm">
        <div class="col-4 text-bold">Tijd:</div>
        <div class="col-8">
          {{ $filters.minuteToTime(booking.fltTime1) }}
        </div>
      </div>
      <div class="row q-pa-sm" style="background-color: #f2f2f2">
        <div class="col-4 text-bold">Loop out:</div>
        <div class="col-8">{{ booking.loop1.crlName }}</div>
      </div>
      <div v-if="booking.loop2 !== null" class="row q-pa-sm">
        <div class="col-6 text-bold">Loop in:</div>
        <div class="col-6">{{ booking.loop2.crlName }}</div>
      </div>
      <div
        v-for="(player, key) in booking.flight_players"
        :key="key"
        :style="{ backgroundColor: key % 2 !== 0 ? '#f2f2f2' : '' }"
        class="row q-pa-sm"
      >
        <div class="col-4 text-bold">Speler {{ key + 1 }}:</div>
        <div class="col-8">{{ player.flpName ? player.flpName : "?" }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  data() {
    return {
      bookingsArray: [],
    };
  },
  mounted() {
    this.$http.get("golfer/bookings").then((res) => {
      this.bookingsArray = res;
    });
  },
};
</script>
