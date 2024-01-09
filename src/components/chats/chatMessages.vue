<template>
  <q-page
    ref="messageParent"
    class="message-parent"
    style="background-color: lightgrey"
  >
    <div ref="messageHeaderSpace" class="row message-fixed-top-menu fixed-top">
      <div class="col-2" v-on:click="$store.dispatch('chats/close')">
        <q-btn color="primary" flat icon="arrow_back_ios" round />
      </div>
      <div
        class="col-9"
        style="font-size: 18px"
        v-on:click="$store.dispatch('chats/edit', true)"
      >
        <q-avatar color="blue" icon="group" size="md" text-color="white" />
        <b class="q-pl-sm">{{ $store.state.chats.chat.chtName }}</b>
      </div>
      <div class="col-1 justify-end text-right">&nbsp;</div>
    </div>

    <div ref="messagesSpace" class="message-space">
      <chat-message
        v-for="(message, key) in this.$store.state.chats.messages"
        :key="key"
        :message="message"
      />
    </div>

    <div
      ref="messageInputSpace"
      class="message-fixed-bottom-input fixed-bottom"
    >
      <div class="row">
        <div class="col-12">
          <textarea
            ref="messageTextarea"
            v-model="message.crmMessage"
            @keydown.enter.prevent="filterStrokes"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import ChatMessage from "components/chats/chatMessage.vue";

export default {
  components: { ChatMessage },
  data: function () {
    return {
      message: {
        crmChtNr: null,
        crmMessage: "",
      },
    };
  },
  created() {
    this.getMessages();
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  watch: {
    "message.crmMessage": function () {
      this.adjustInputHeight();
    },
  },
  methods: {
    handleResize() {
      const qHeader = document.querySelectorAll(".q-header");
      qHeader.forEach((el) => {
        this.$refs.messageHeaderSpace.style.marginTop = `${el.clientHeight}px`;
      });

      const rectA = this.$refs.messageHeaderSpace.getBoundingClientRect();
      const rectB = this.$refs.messageInputSpace.getBoundingClientRect();
      const height = rectB.top - rectA.bottom;
      this.$refs.messagesSpace.style.height = `${height}px`;
    },
    filterStrokes(event) {
      if (event.keyCode === 13) {
        this.sendMessage();
      } else if (!event.shiftKey) {
        event.preventDefault();
        if (this.message.trim()) {
          this.message = "";
        }
      }
    },
    async getMessages() {
      await this.$store.dispatch(
        "chats/getMessages",
        this.$store.state.chats.chat.chtNr
      );
    },
    async sendMessage() {
      this.message.crmChtNr = this.$store.state.chats.chat.chtNr;
      await this.$store.dispatch("chats/setMessage", this.message);
      this.resetMessage();
    },
    resetMessage() {
      this.message = {
        crmChtNr: null,
        crmMessage: "",
      };
      this.$refs.messagesSpace.scrollTop = 0;
    },
    adjustInputHeight() {
      this.$nextTick(() => {
        const inputElement =
          this.$refs.messageInputSpace?.querySelector("textarea");
        if (inputElement) {
          inputElement.style.height = "auto"; // Reset height to recalculate
          let newHeight = inputElement.scrollHeight; // Get the content height
          if (newHeight < 58) newHeight = 58; // Enforce a minimum height
          if (newHeight > 150) newHeight = 150; // Enforce a maximum height

          inputElement.style.height = `${newHeight}px`; // Set the new height

          // Update the bottom space of the messages area to match the new height
          document.documentElement.style.setProperty(
            "--input-height",
            `${newHeight}px`
          );

          const rectA = this.$refs.messageHeaderSpace.getBoundingClientRect();
          const rectB = this.$refs.messageInputSpace.getBoundingClientRect();
          const spaceHeight = rectB.top - rectA.bottom;

          this.$refs.messagesSpace.style.height = `${spaceHeight}px`;
          this.$refs.messagesSpace.style.bottom = `${rectB.height}px`;
        }
      });
    },
  },
};
</script>

<style>
/* Existing styles, with some modifications */

.message-parent {
  position: relative;
  top: 0;
  left: 0;
}

.message-fixed-top-menu {
  height: 50px;
  width: 100%;
  background-color: white;
  z-index: 1001;
  display: flex;
  align-items: center;
}

.message-space {
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  position: fixed;
  bottom: 76px;
  display: flex;
  flex-direction: column-reverse; /* Reverse the order of the chat messages */
  overflow-y: auto; /* Allows for scrolling */
  background-color: lightgrey;
}

.message-fixed-bottom-input {
  padding: 5px;
  width: 100%;
  background: white;
  z-index: 1000;
}

.message-fixed-bottom-input textarea {
  font-size: 18px;
  width: 100%;
  height: auto;
}
</style>
