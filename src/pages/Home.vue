<template>
  <q-page-container className="page-bgr">
    <q-page class="q-pa-sm">
      <match />
      <bookings />
      <messages />
      <lessons v-if="1 == 2" />
    </q-page>
  </q-page-container>
</template>

<script>
import messages from "../components/dashboard/messages.vue";
import bookings from "../components/dashboard/bookings.vue";
import lessons from "../components/dashboard/lessons.vue";
import Match from "../components/dashboard/match.vue";

export default {
  components: { Match, messages, bookings, lessons },
  mounted() {},
};
</script>
