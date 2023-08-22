<template>
  <q-page>
    <div class="row">
      <div class="col">
        <q-btn
          class="full-width q-mb-md"
          color="secondary"
          icon="add"
          label="Nieuwe reservering"
          v-on:click="handleOpenNew"
        />
      </div>
    </div>

    <div class="row">
      <div class="col">
        <q-list v-if="array.length > 0" separator>
          <q-item
            v-for="(item, index) in array"
            v-bind:key="index"
            v-ripple
            class="full-width bg-white shadow-1 q-mb-sm"
            clickable
            v-on:click="handleOpenFlight(item)"
          >
            <q-item-section>
              <q-item-label class="itg-text-overflow">
                <i class="far fa-calendar-alt mr-2" />
                {{ $filters.unixToDate(item.fltDate, "dddd DD-MM") }}
                {{}} -
                                {{ $filters.minuteToTime(item.fltTime1) }}
              </q-item-label>

              <q-item-label caption>
                <!--                {{ item.flight_players.length }} golfers-->
                <i class="far fa-golf-club mr-2" />
                {{ item.loop1.crlName }}
              </q-item-label>
            </q-item-section>

            <q-item-section avatar> ></q-item-section>
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
  props: {
    array: Array,
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    handleOpenFlight: function (flight) {
      this.$emit("handleOpenFlight", flight);
    },
    handleOpenNew: function () {
      this.$emit("handleOpenBooking");
    },
  },
};
</script>
