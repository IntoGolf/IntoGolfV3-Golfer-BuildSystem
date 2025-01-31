<template>
  <chat-messages
    v-if="$store.state.chats.chat !== null && !$store.state.chats.edit"
  />
  <chat-form
    v-else-if="$store.state.chats.chat !== null && $store.state.chats.edit"
  />
  <chat-list v-else v-on:handleNew="handleNew" />
</template>

<script>
import ChatList from "components/chats/chatList.vue";
import ChatMessages from "components/chats/chatMessages.vue";
import ChatForm from "components/chats/chatForm.vue";

export default {
  components: { ChatForm, ChatMessages, ChatList },
  data: function () {
    return {
      form: {
        chtNr: null,
        chtName: "",
        chat_relations: [],
        chat_messages: [],
      },
    };
  },
  methods: {
    async handleSave() {
      const result = await this.$store.dispatch("chats/setChat", this.chat);
    },
    handleNew() {
      this.$store.dispatch("chats/set", {
        chat: { ...this.form },
        edit: true,
      });
    },
  },
};
</script>
