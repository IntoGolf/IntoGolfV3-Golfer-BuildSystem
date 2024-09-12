<template>
  <q-page-container>
    <q-page class="q-pa-sm">
      <div class="row q-mb-md">
        <q-card
          v-if="usrHasTeeTimes && bookingsArray.length === 0"
          class="my-card full-width q-mt-md"
        >
          <q-card-section class="text-center">
            <div class="text-h5">Geen starttijden</div>
            <div class="text-subtitle1">
              er zijn geen gereserveerde starttijden gevonden.
            </div>
            <q-btn
              class="q-mt-md"
              label="boek een starttijd"
              v-on:click="$router.push('/reservations')"
            />
          </q-card-section>
        </q-card>
      </div>
      <match />
      <bills v-if="usrHasTeeTimes" />
      <bookings v-if="usrHasTeeTimes" :bookingsArray="bookingsArray" />
      <messages v-if="setHasMessages" />
      <lessons v-if="usrHasLessons" />
    </q-page>
  </q-page-container>
</template>

<script>
import messages from "../components/dashboard/messages.vue";
import bookings from "../components/dashboard/bookings.vue";
import lessons from "../components/dashboard/lessons.vue";
import Match from "../components/dashboard/match.vue";
import Bills from "../components/dashboard/bills.vue";
import authMixin from "src/mixins/auth";
import { mapGetters } from "vuex";

export default {
  mixins: [authMixin],
  components: { Match, messages, bookings, lessons, Bills },
  computed: {
    ...mapGetters("settings", ["setHasMessages"]),
    ...mapGetters("currentUser", ["usrHasLessons", "usrHasTeeTimes"]),
  },
  data() {
    return {
      bookingsArray: [],
    };
  },
  mounted() {
    this.getBookings();
  },
  methods: {
    async getBookings() {
      if (this.usrHasTeeTimes) {
        this.bookingsArray = await this.$http.get("golfer/bookings");
      }
    },
  },
};
</script>
