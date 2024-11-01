<template>
  <q-list v-if="unreadMessages.length > 0" separator>
    <q-item
      v-for="(item, index) in unreadMessages"
      v-bind:key="index"
      v-ripple
      class="full-width bg-white shadow-1 q-mb-sm"
      clickable
      style="border-radius: 4px"
    >
      <q-item-section>
        <q-item-label>
          <div class="float-left">
            <b>Bericht: {{ item.msgTitle }}</b>
          </div>
          <div
            v-if="item.msgType !== 1"
            class="float-right"
            v-on:click="handleSetMessage(item)"
          >
            X
          </div>
        </q-item-label>
        <q-separator class="q-mt-sm q-mb-sm" />
        <q-item-label v-html="item.msgText" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { mapActions } from "vuex";

export default {
  created() {
    this.$store.dispatch("messages/fetchMessages");
  },
  computed: {
    unreadMessages: function () {
      return this.$store.state.messages.items.filter(
        (message) => message.message_opened === null || message.msgType === 1
      );
    },
  },
  methods: {
    ...mapActions("messages", ["setMessage"]),
    handleSetMessage: function (item) {
      this.setMessage(item);
    },
  },
};
</script>
