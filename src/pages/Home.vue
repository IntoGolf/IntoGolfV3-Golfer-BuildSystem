<template>
  <q-page class="q-pa-sm">
    <dashboard-whs-status/>
    <dashboard-course-status v-if="setHasCourseStatus"/>
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
    ...mapGetters("settings", ["setHasMessages", "setHasCourseStatus"]),
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
