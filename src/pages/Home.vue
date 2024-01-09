<template>
  <q-page-container>
    <q-page class="q-pa-sm">
      <match />
      <bookings v-if="usrHasTeeTimes" />
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
import authMixin from "src/mixins/auth";
import { mapGetters } from "vuex";

export default {
  mixins: [authMixin],
  components: { Match, messages, bookings, lessons },
  mounted() {},
  computed: {
    ...mapGetters("settings", ["setHasMessages"]),
    ...mapGetters("currentUser", ["usrHasLessons", "usrHasTeeTimes"]),
  },
};
</script>
