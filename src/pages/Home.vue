<template>
  <q-page class="q-pa-sm">
    <dashboard-whs-status/>
    <dashboard-course-status/>
    <q-card
      v-if="usrHasTeeTimes && bookingsArray.length === 0"
      bordered
      class="full-width q-mt-md q-mb-md"
      flat
    >
      <q-card-section>
        <div class="text-h6">Geen starttijden</div>
        <q-separator/>
        <div class="text-subtitle1">
          er zijn geen gereserveerde starttijden gevonden...
        </div>
        <q-btn
          class="q-mt-md full-width"
          color="primary"
          flat
          label="boek een starttijd"
          size="small"
          v-on:click="$router.replace({path: '/reservations'})"
        />
      </q-card-section>
    </q-card>
    <match/>
    <bills v-if="usrHasTeeTimes"/>
    <bookings v-if="usrHasTeeTimes" :bookingsArray="bookingsArray"/>
    <messages v-if="setHasMessages"/>
    <lessons v-if="usrHasLessons"/>
  </q-page>
</template>

<script>
import messages from "../components/dashboard/messages.vue";
import bookings from "../components/dashboard/bookings.vue";
import lessons from "../components/dashboard/lessons.vue";
import Match from "../components/dashboard/match.vue";
import Bills from "../components/dashboard/bills.vue";
import authMixin from "src/mixins/auth";
import {mapGetters} from "vuex";
import DashboardCourseStatus from "components/dashboard/status.vue";
import DashboardWhsStatus from "components/dashboard/whs.vue";

export default {
  mixins: [authMixin],
  components: {
    DashboardWhsStatus,
    DashboardCourseStatus,
    Match,
    messages,
    bookings,
    lessons,
    Bills,
  },
  computed: {
    nav() {
      return navigator.userAgent.toString();
    },
    ...mapGetters("settings", ["setHasMessages"]),
    ...mapGetters("currentUser", ["usrHasLessons", "usrHasTeeTimes", "item"]),
  },
  data() {
    return {
      bookingsArray: [],
    };
  },
  async mounted() {
    await this.$store.dispatch("settings/fetchSettings");
    await this.getBookings();
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
