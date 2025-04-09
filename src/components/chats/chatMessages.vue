<template>
  <q-page class="flex column bg-grey-4">
    <q-banner>
      <q-btn
        flat
        icon="arrow_back_ios"
        round
        @click="$store.dispatch('chats/close')"
      />
      <q-avatar
        color="blue"
        icon="group"
        size="md"
        text-color="white"
        @click="$store.dispatch('chats/edit', true)"
      />
      <b class="q-pl-sm">{{ chatName }}</b>
    </q-banner>

    <div ref="scrollContainer" style="height: Calc(100vh - 160px); overflow-y: scroll">
      <div class="column col justify-end q-pa-sm">
        <chat-message
          v-for="(message, key) in reversedMessages"
          :key="key"
          :message="message"
        />
      </div>
    </div>

    <q-footer>
      <q-toolbar class="q-pa-sm">
        <q-input
          v-model="message.crmMessage"
          bg-color="white"
          class="full-width"
          dense
          label="Bericht"
          outlined
          rounded
          @keydown.enter="filterStrokes"
        >
          <template v-slot:after>
            <q-btn
              color="white"
              dense
              flat
              icon="send"
              round
              @click="sendMessage"
            />
          </template>
        </q-input>
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script>
import ChatMessage from "components/chats/chatMessage.vue";

export default {
  components: {ChatMessage},
  data: function () {
    return {
      message: {
        crmChtNr: null,
        crmMessage: "",
      },
    };
  },
  async mounted() {
    await this.getMessages();
    await this.scrollToBottom();
  },
  computed: {
    reversedMessages() {
      return [...this.$store.state.chats.messages].reverse();
    },
    chatName() {
      return this.$store.state.chats.chat.chtName;
    },
  },
  watch: {
    async reversedMessages() {
      await this.scrollToBottom();
    }
  },
  methods: {
    async scrollToBottom() {
      await this.$nextTick(() => {
        const el = this.$refs.scrollContainer;
        if (el) el.scrollTop = el.scrollHeight;
      });
    },
    filterStrokes(event) {
      if (event.key === "Enter") {
        this.sendMessage();
      }
    },
    async getMessages() {
      try {
        await this.$store.dispatch(
          "chats/getMessages",
          this.$store.state.chats.chat.chtNr
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    },
    async sendMessage() {
      this.message.crmChtNr = this.$store.state.chats.chat.chtNr;
      try {
        await this.$store.dispatch("chats/setMessage", this.message);
        this.resetMessage();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    resetMessage() {
      Object.assign(this.message, {
        crmChtNr: null,
        crmMessage: "",
      });
    },
  },
};
</script>

<style scoped>
.chat-container {
  flex: 1;
  overflow-y: auto;
}
</style>
