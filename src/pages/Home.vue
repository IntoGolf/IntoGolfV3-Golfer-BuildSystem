<template>
  <q-page-container className="page-bgr">
    <q-page class="q-pa-sm">
      <messages />
      <bookings />
      <lessons v-if="1 == 2" />
    </q-page>
  </q-page-container>
</template>

<script>
import messages from "../components/dashboard/messages.vue";
import bookings from "../components/dashboard/bookings.vue";
import lessons from "../components/dashboard/lessons.vue";

export default {
  components: { messages, bookings, lessons },
  mounted() {},
};
</script>
