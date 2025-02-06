<template>
  <div>
    <div class="q-mt-xl text-h5 text-center" v-bind:class="emotion">
      {{ text }}
    </div>
    <div v-show="subText" class="q-mt-xl text-subtitle1 text-center">
      {{ subText }}
    </div>
    <div v-show="status !== 'open'" class="q-mt-xl text-center">
      <q-btn label="Sluiten" v-on:click="onClose" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: [String],
      default: null,
    },
    url: {
      type: [String],
      default: null,
    },
    textPaid: {
      type: [String],
      default: "Het betaalverzoek is verwerkt",
    },
    textFailed: {
      type: [String],
      default: "Het betaalverzoek is mislukt",
    },
    textExpired: {
      type: [String],
      default: "Het betaalverzoek is verlopen",
    },
    textHalted: {
      type: [String],
      default: "Het betaalverzoek is afgebroken",
    },
    subTextPaid: {
      type: [String],
      default: "",
    },
    subTextFailed: {
      type: [String],
      default: "",
    },
    subTextExpired: {
      type: [String],
      default: "",
    },
    subTextHalted: {
      type: [String],
      default: "",
    },
  },
  data() {
    return {
      status: "open",
      counter: 0,
      maxCount: 30,
      text: "Betaling wordt verwerkt",
      subText: "",
      emotion: "text-positive",
    };
  },
  created: function () {
    this.openWindow(this.url);
    this.handleStatusLoop();
  },
  methods: {
    openWindow: function (url) {
      let newWindow = window.open(url, "_blank");
      if (!newWindow) {
        window.location = url;
      }
    },
    handleStatusLoop: function () {
      let that = this;
      if (this.counter < this.maxCount && this.status === "open") {
        this.counter++;
        that.handleStatusCheck();
        window.setTimeout(function () {
          that.handleStatusLoop();
        }, 2000);
      } else {
        this.handlePaymentDone();
      }
    },

    handlePaymentDone: function () {
      if (this.status === "expired") {
        this.emotion = "text-warning";
        this.text = this.textExpired;
        this.subText = this.subTextExpired;
      } else if (this.status === "failed") {
        this.emotion = "text-warning";
        this.text = this.textFailed;
        this.subText = this.subTextFailed;
      } else if (this.status === "paid") {
        this.text = this.textPaid;
        this.subText = this.subTextPaid;
      } else {
        this.emotion = "text-warning";
        this.text = this.textHalted;
        this.subText = this.subTextHalted;
      }
    },
    onClose() {
      this.$emit("handleCloseSubscribe", this.status);
    },
    handleStatusCheck: function () {
      let that = this;
      this.$http.get(`golfer/payment/status/${this.id}`).then((res) => {
        that.status = res.opmStatus;
        that.isDesktop = res.opmIsDesktop;
      });
    },
  },
};
</script>
