<template>
  <div class="q-mt-xl text-h5 text-center" v-bind:class="emotion">
    {{ text }}
  </div>
</template>

<script>
export default {
  props: ["id", "url"],
  data() {
    return {
      status: "open",
      counter: 0,
      maxCount: 30,
      text: "Betaling wordt verwerkt",
      emotion: "text-positive",
    };
  },
  created: function () {
    window.open(this.url, "_blank");
    this.handleStatusLoop();
  },
  methods: {
    handleStatusLoop: function () {
      let that = this;
      if (this.counter < this.maxCount && this.status == "open") {
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
      let that = this;

      if (this.status == "expired") {
        this.emotion = "text-warning";
        this.text =
          "Het betaalverzoek is verlopen, inschrijving is geannuleerd!";
      } else if (this.status == "failed") {
        this.emotion = "text-warning";
        this.text =
          "Het betaalverzoek is mislukt, inschrijving is geannuleerd!";
      } else if (this.status == "paid") {
        this.text = "Het betaalverzoek is gelukt, inschrijving is voltooid";
      } else {
        this.emotion = "text-warning";
        this.text =
          "Het betaalverzoek is gestoped, inschrijving is geannuleerd!";
      }

      window.setTimeout(function () {
        that.$emit("handleCloseSubscribe")();
      }, 5000);
    },

    handleStatusCheck: function () {
      let that = this;
      this.$http.get(`golfer/payment/status/${this.id}`)
        .then((res) => {
          that.status = res.opmStatus;
          that.isDesktop = res.opmIsDesktop;
        });
    },
  },
};
</script>
