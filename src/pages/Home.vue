<template>
  <q-page-container>
    <q-page>
      <!--      <div class="row q-mb-md q-pa-sm">-->
      <!--        <q-badge class="q-pa-sm bg-green-4"-->
      <!--          >{{ currentUser.relHandicap }}-->
      <!--        </q-badge>-->
      <!--        <q-btn class="full-width" color="secondary" label="Boek starttijd" />-->
      <!--      </div>-->
      <match />
      <bills v-if="usrHasTeeTimes" />
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
  mounted() {},
  methods: {},
};
</script>
