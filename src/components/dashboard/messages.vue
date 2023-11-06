<template>
  <q-list v-if="this.$store.state.messages.items.length > 0" separator>
    <q-item
      v-for="(item, index) in this.$store.state.messages.items"
      v-bind:key="index"
      v-ripple
      class="full-width bg-white shadow-1 q-mb-sm"
      clickable
      style="border-radius: 4px"
    >
      <q-item-section>
        <q-item-label>
          <b>Bericht: {{ item.msgTitle }}</b>
        </q-item-label>
        <q-item-label v-html="item.msgText" />
      </q-item-section>
      <q-item-section avatar side top
        ><i class="icon text-danger far fa-times mr-2"></i
      ></q-item-section>
    </q-item>
  </q-list>
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
