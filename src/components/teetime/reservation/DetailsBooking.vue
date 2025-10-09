<template>
  <q-card-section>
    <div class="row q-mb-sm">
      <div class="col text-bold">Slot</div>
      <div class="col-8 text-right">
        {{ slot }}
      </div>
    </div>

    <div class="row q-mb-sm">
      <div class="col text-bold">Starthole</div>
      <div class="col-8 text-right">
        {{ flight.loop1.crlName }}
      </div>
    </div>

    <div v-if="flight.fltCrlNr2 > 0" class="row q-mb-sm">
      <div class="col text-bold">Lus in</div>
      <div class="col-8 text-right">
        {{ courseLoop }}
      </div>
    </div>

    <div class="row q-mb-sm">
      <div class="col text-bold">Boeker</div>
      <div class="col-8 text-right">
        {{ bookerName }}
      </div>
    </div>

    <div class="row q-mb-sm">
      <div class="col text-bold">Spelers</div>
      <div class="col-8 text-right">
        {{
          flight.flight_players.filter(
            (item) => item.flpCarNr === null && item.flpName !== ""
          ).length
        }}
      </div>
    </div>

    <div v-show="flight.IntroMax > 0 && flight.IntroMax < 99" class="row q-mb-sm">
      <div class="col text-bold">Intro ruimte</div>
      <div class="col-8 text-right">
        {{ flight.IntroMax - flight.IntroCount }}X
      </div>
    </div>

    <div v-show="showPay" class="row q-mb-sm">
      <div class="col text-bold">Greenfee</div>
      <div class="col-8 text-right">
        {{
          flight.flight_players[0].greenfee === null
            ? "-"
            : flight.flight_players[0].greenfee.grfName
        }}
      </div>
    </div>

    <div v-show="showPay" class="row q-mb-sm">
      <div class="col text-bold">Greenfee tarief</div>
      <div class="col-8 text-right">
        {{
          flight.flight_players[0].flpPrice === null
            ? $filters.money(0)
            : $filters.money(flight.flight_players[0].flpPrice)
        }}
      </div>
    </div>

    <div v-show="showPay" class="row q-mb-sm">
      <div class="col text-bold">Greenfee totaal</div>
      <div class="col-8 text-right">
        {{ $filters.money(total) }}
      </div>
    </div>

    <div v-show="showPay && !paid" class="row">
      <div class="col text-bold">Vervalt op</div>
      <div class="col-8 text-right">
        {{
          $dayjs(flight.fltTimestamp)
            .add(30, "minutes")
            .format("dddd D MMM HH:mm")
        }}
      </div>
    </div>

    <div v-show="showPay && paid" class="row">
      <div class="col text-bold">Status</div>
      <div class="col-8 text-right">Betaald</div>
    </div>

    <!-- Friends visibility toggle -->
    <div v-if="canManageFriendsVisibility" class="row q-mt-md">
      <div class="col text-bold">Zichtbaar voor vrienden</div>
      <div class="col-8 text-right">
        <q-toggle
          v-model="friendsVisible"
          :loading="updatingFriends"
          color="primary"
          @update:model-value="updateFriendsVisibility"
        />
      </div>
    </div>

    <!-- Open booking toggle -->
    <div v-if="canManageFriendsVisibility" class="row q-mt-sm">
      <div class="col text-bold">
        <div>Open boeking</div>
        <div class="text-caption text-grey-6">Flight kan aangevuld worden met andere spelers</div>
      </div>
      <div class="col-8 text-right">
        <q-toggle
          v-model="openBookingVisible"
          :loading="updatingOpenBooking"
          color="primary"
          @update:model-value="updateOpenBookingVisibility"
        />
      </div>
    </div>
  </q-card-section>
</template>

<script>
import authMixin from "../../../mixins/auth";

export default {
  mixins: [authMixin],
  props: {
    flight: Object,
  },
  emits: ['update-flight'],
  data() {
    return {
      friendsVisible: false,
      updatingFriends: false,
      openBookingVisible: false,
      updatingOpenBooking: false
    }
  },
  computed: {
    showPay() {
      return this.settings.app_display_greenfee_pay === "1";
    },
    slot: function () {
      return this.$dayjs(
        this.$filters.unixToDate(this.flight.fltDate) +
        " " +
        this.$filters.minuteToTime(this.flight.fltTime1),
        "DD-MM-YYYY H:mm"
      ).format("dddd D MMM HH:mm");
    },
    courseLoop: function () {
      return (
        this.$filters.minuteToTime(this.flight.fltTime2) +
        " - " +
        this.flight.loop2.crlName
      );
    },
    bookerName: function () {
      return this.flight.flight_players[0].flpName;
    },
    total: function () {
      return this.flight.flight_players.reduce(function (result, item) {
        return result + item.flpPrice;
      }, 0);
    },
    paid: function () {
      return (
        this.flight.flight_players.filter(
          (player) => player.flpBilNr > 0 || player.flpScorecard > 0
        ).length > 0
      );
    },
    canManageFriendsVisibility() {
      // Check if current user is the main booker
      const mainPlayer = this.flight.flight_players[0];
      return mainPlayer && mainPlayer.flpRelNr === this.currentUser.relNr;
    }
  },
  mounted() {
    // Initialize friends visibility from flight data
    this.friendsVisible = Boolean(this.flight.fltFriendsYN);
    this.openBookingVisible = Boolean(this.flight.fltOpenBookingYN);
  },
  watch: {
    flight: {
      handler(newFlight) {
        if (newFlight) {
          this.friendsVisible = Boolean(newFlight.fltFriendsYN);
          this.openBookingVisible = Boolean(newFlight.fltOpenBookingYN);
        }
      },
      immediate: true
    }
  },
  methods: {
    async updateFriendsVisibility(newValue) {
      this.updatingFriends = true;

      try {
        const response = await this.$axios.post('golfer/flight/friends-visibility', {
          fltNr: this.flight.fltNr,
          fltFriendsYN: newValue
        });

        // Emit event to parent to update flight data
        this.$emit('update-flight', {fltFriendsYN: response.fltFriendsYN});

        this.$q.notify({
          type: 'positive',
          message: newValue
            ? 'Starttijd is nu zichtbaar voor vrienden'
            : 'Starttijd is niet meer zichtbaar voor vrienden',
          timeout: 2000
        });

      } catch (error) {
        console.error('Error updating friends visibility:', error);

        // Revert toggle if API call failed
        this.friendsVisible = !newValue;

        this.$q.notify({
          type: 'negative',
          message: 'Kon vrienden zichtbaarheid niet bijwerken',
          timeout: 2000
        });
      } finally {
        this.updatingFriends = false;
      }
    },

    async updateOpenBookingVisibility(newValue) {
      this.updatingOpenBooking = true;

      try {
        const response = await this.$axios.post('golfer/flight/open-booking-visibility', {
          fltNr: this.flight.fltNr,
          fltOpenBookingYN: newValue
        });

        // Emit event to parent to update flight data
        this.$emit('update-flight', {fltOpenBookingYN: response.fltOpenBookingYN});

        this.$q.notify({
          type: 'positive',
          message: newValue
            ? 'Flight is nu open voor andere spelers'
            : 'Flight is niet meer open voor andere spelers',
          timeout: 2000
        });

      } catch (error) {
        console.error('Error updating open booking visibility:', error);

        // Revert toggle if API call failed
        this.openBookingVisible = !newValue;

        this.$q.notify({
          type: 'negative',
          message: 'Kon open boeking instelling niet bijwerken',
          timeout: 2000
        });
      } finally {
        this.updatingOpenBooking = false;
      }
    }
  }
};
</script>
