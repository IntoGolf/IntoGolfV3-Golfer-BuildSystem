<template>
  <q-chat-message
    :bg-color="bgColor"
    :name="name"
    :sent="isMe"
    :stamp="timeText"
    size="8"
  >
    <div v-if="message.crmFltNr > 0">
      <span v-html="message.flightText" /><br />
      <span v-if="!message.canceled" v-html="message.flightExtraText" />
      <hr />
      <span v-if="message.canceled"> <b>Status</b>: geannuleerd<br /></span>
      <span v-else-if="message.on_flight">
        <b>Status</b>: je bent deelnemer</span
      >
      <span v-else-if="showJoin">
        <b>Status</b>: open
        <a @click="handleBook(message.crmFltNr)"><b>aanmelden</b></a></span
      >
      <hr />
      <div v-if="message.players.length > 0 && !message.canceled">
        <b>Deelnemers:</b>
        <div v-for="(player, key) in message.players" :key="key">
          - {{ player }}
        </div>
      </div>
    </div>

    <div v-else-if="message.crmFltNr === null">
      <span v-html="message.crmMessage" />
    </div>
  </q-chat-message>
</template>

<script>
export default {
  props: {
    message: Object,
  },
  computed: {
    showJoin() {
      return (
        this.message.crmFltNr &&
        !this.message.canceled &&
        !this.message.on_flight &&
        !this.message.is_my_flight
      );
    },
    bgColor() {
      if (this.message.crmFltNr > 0 && this.message.canceled) {
        return "red-3";
      } else if (this.message.crmFltNr > 0 && this.message.on_flight) {
        return "blue-5";
      } else if (this.message.crmFltNr > 0) {
        return "blue-3";
      } else if (this.isMe) {
        return "green-3";
      } else {
        return "white";
      }
    },
    isMe() {
      return this.message.crmRelNr === this.$store.state.currentUser.item.relNr;
    },
    timeText() {
      const messageDate = this.$dayjs(this.message.crmTimestamp);
      const now = this.$dayjs();

      if (messageDate.isSame(now, "day")) {
        // Format for today's messages: "HH:MM"
        return messageDate.format("HH:mm");
      } else if (messageDate.isSame(now, "year")) {
        // Format for this year but older than today: "DD MMM HH:MM"
        return messageDate.format("DD MMM HH:mm");
      } else {
        // Format for messages older than this year: "DD MMM YY HH:MM"
        return messageDate.format("DD MMM YY HH:mm");
      }
    },
    name() {
      if (this.message.crmRelNr === this.$store.state.currentUser.item.relNr) {
        return "";
      }
      return this.message.sender_name;
    },
  },
  methods: {
    handleBook(fltNr) {
      let data = { fltNr: fltNr, chtNr: this.message.crmChtNr };
      this.$http.post("golfer/booking/join", data).then(() => {
        const chtNr = this.$store.state.chats.chat.chtNr;
        this.$store.dispatch("chats/getMessages", chtNr);
      });
    },
  },
};
</script>
