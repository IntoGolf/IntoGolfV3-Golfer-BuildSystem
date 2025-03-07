<template>
  <q-card bordered class="full-width q-pa-md q-mb-md  bg-brown-1" flat>
    <div class="row text-h6">
      <div class="col">Starttijden</div>
    </div>
    <q-separator class="q-mb-sm"/>

    <q-list v-if="bookingsArray.length > 0" separator>
      <q-item
        v-for="(item, index) in bookingsArray"
        v-show="index < 3"
        v-bind:key="index"
        v-ripple
        class="full-width q-pa-sm bg-brown-2 q-mb-sm"
        clickable
        style="border-radius: 4px"
        v-on:click="handleOpenFlight(item)"
      >
        <q-item-section>
          <q-item-label class="itg-text-overflow">
            <i class="far fa-calendar-alt mr-2"/>
            {{ $filters.unixToDate(item.fltDate, "ddd D MMM") }}
            {{}} -
            {{ $filters.minuteToTime(item.fltTime1) }}
          </q-item-label>

          <q-item-label caption class="text-bold">
            <i class="far fa-golf-club mr-2"/>
            {{ item.fltSize }} spelers. Start van:
            {{ item.loop1.crlName }}
          </q-item-label>
        </q-item-section>
        <q-item-section avatar> ></q-item-section>
      </q-item>
    </q-list>
    <q-card-section v-else>
      er zijn geen gereserveerde starttijden gevonden...
    </q-card-section>
    <q-separator class="q-mb-sm"/>
    <q-btn
      v-if="hasBooking"
      class=" full-width q-mb-sm"
      color="primary"
      outline
      v-on:click="
              $router.push(
                '/checkin?id=' + $store.state.settings.item.teetime.flpNr
              )
            "
    >
      Aanmelden starttijd
      {{
        $filters.minuteToTime($store.state.settings.item.teetime.fltTime1)
      }}
    </q-btn>
    <q-btn
      class="full-width"
      color="primary"
      label="boek een starttijd"
      outline
      size="small"
      v-on:click="$router.replace({path: '/reservations'})"
    />
  </q-card>
</template>

<script>
export default {
  props: {
    bookingsArray: Array,
  },
  computed: {
    hasBooking() {
      return this.$store.state.currentUser.item.tile_teetimes_y_n &&
        this.$store.state.settings.item.teetime !== null &&
        this.$store.state.settings.item.teetime !== undefined &&
        this.$store.state.settings.item.teetime.flpPrice === null &&
        this.$store.state.settings.item.teetime.flpScorecard === null
    }
  },
  methods: {
    handleOpenFlight(item) {
      this.$store.commit("settings/SET_FLIGHT", item.fltNr);
      this.$router.push("/reservations");
    },
  },
};
</script>
