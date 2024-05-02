<template>
  <q-list v-if="bookingsArray.length > 0" separator>
    <q-item
      v-for="(item, index) in bookingsArray"
      v-bind:key="index"
      v-ripple
      class="full-width bg-white shadow-1 q-mb-sm"
      clickable
      style="border-radius: 4px"
      v-on:click="handleOpenFlight(item)"
    >
      <q-item-section>
        <q-item-label class="itg-text-overflow">
          <i class="far fa-calendar-alt mr-2" />
          <b>Starttijd:</b>
          {{ $filters.unixToDate(item.fltDate, "ddd D MMM") }}
          {{}} -
          {{ $filters.minuteToTime(item.fltTime1) }}
        </q-item-label>

        <q-item-label caption>
          <i class="far fa-golf-club mr-2" />
          {{ item.fltSize }} spelers. Start van:
          {{ item.loop1.crlName }}
        </q-item-label>
      </q-item-section>
      <q-item-section avatar> ></q-item-section>
    </q-item>
  </q-list>
  <!--  <div v-else class="row q-pa-sm">-->
  <!--    <div class="col-12 q-pa-xs" style="border: 1px solid lightgrey">-->
  <!--      <p class="text-center q-mt-md" style="font-size: larger">-->
  <!--        Er zijn geen openstaande starttijdreservering gevonden-->
  <!--      </p>-->
  <!--    </div>-->
  <!--  </div>-->
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
  methods: {
    handleOpenFlight(item) {
      this.$store.commit("settings/SET_FLIGHT", item.fltNr);
      this.$router.push("/reservations");
    },
  },
};
</script>
