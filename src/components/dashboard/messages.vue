<template>
  <q-card
    v-for="(message, key) in unreadMessages"
    :key="key"
    class="dashboard-card q-mb-md"
  >
    <q-card-section class="bg-blue-grey-3 dashboard-card-title">
      <div class="row items-center no-wrap">
        <div class="col">
          {{ $t("message") }}
        </div>
        <div class="col-auto">
          <q-icon name="close" />
        </div>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section class="q-pa-sm" v-html="message.msgText" />
  </q-card>
</template>

<script>
export default {
  created() {
    this.$store.dispatch("messages/fetchMessages");
  },
  computed: {
    unreadMessages: function () {
      return this.$store.state.messages.items.filter(
        (message) => message.message_opened === null
      );
    },
  },
};
</script>
