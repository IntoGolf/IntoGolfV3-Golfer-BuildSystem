<template>
  <q-page-container class="page-bgr">
    <q-page>
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
  mounted() {
    this.$http.get(`golfer/greenfee_card`).then((res) => {
      localStorage.setItem("golfer__greenfee_cards", JSON.stringify(res));
    });
  },
};
</script>
