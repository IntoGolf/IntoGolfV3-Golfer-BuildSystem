<template>

  <q-page class="q-pa-md">

    <div class="row">
      <div class="col">
        <q-btn
          class="full-width q-mb-md"
          color="secondary"
          label="Nieuwe reservering"
          icon="add"
          v-on:click="handleOpenNew"
        />
      </div>
    </div>

    <div class="row">
      <div class="col">
        <q-list v-if="openData.length > 0" separator>
          <q-item
            clickable
            class="full-width bg-white shadow-1 q-mb-sm"
            v-ripple
            v-for="(item, index) in openData"
            v-on:click="handleOpenFlight(item)"
            v-bind:key="index"
          >
            <q-item-section>
              <q-item-label class="itg-text-overflow">
                <i class="far fa-calendar-alt mr-2" />
                {{ $filters.unixToDate(item.fltDate, "dddd DD-MM") }} {{}} -
                {{ $filters.minuteToTime(item.fltTime1) }}
              </q-item-label>

              <q-item-label caption>
                {{ item.flight_players.length }} golfers
                <i class="far fa-golf-club mr-2" />
                {{ item.loop1.crlName }}
              </q-item-label>
            </q-item-section>

            <q-item-section avatar> > </q-item-section>
          </q-item>
        </q-list>

        <q-banner v-else class="bg-orange-3 text-grey-8 text-bold text-center">
          U heeft geen reserveringen openstaan
        </q-banner>

      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      openData: [],
    };
  },
  methods: {
    loadReservationList() {
      this.loading = true;
      this.$http.get("golfer/bookings").then((res) => {
        this.loading = false;
        this.openData = res;
      });
    },

    handleOpenFlight: function (flight) {
      this.$emit("handleOpenFlight", flight);
    },

    handleOpenNew: function () {
      this.$emit("handleOpenBooking");
    },
  },

  created() {
    this.loadReservationList();
  },
};
</script>
