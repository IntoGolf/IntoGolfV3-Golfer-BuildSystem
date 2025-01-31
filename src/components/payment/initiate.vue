<template>
  <div class="row">
    <div class="col-md-4 offset-md-4 col-xs-12">
      <q-card class="q-pa-md q-mt-sm q-mb-lg">
        <div class="row">
          <div class="col text-center text-h4">Status betaling</div>
        </div>

        <q-separator class="q-mb-md" />

        <div :class="emotion" class="row">
          <div class="col text-h5 text-center">
            {{ text }}
          </div>
        </div>

        <div class="row">
          <div class="col text-center">
            Dit scherm wordt automatisch gesloten
          </div>
        </div>
      </q-card>
    </div>
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
  mounted: function () {
    window.open(this.url, "_blank");
    this.handleStatusLoop();
  },
  methods: {
    handleStatusLoop() {
      let that = this;
      if (this.counter < this.maxCount && this.status === "open") {
        this.counter++;
        this.handleStatusCheck();
        window.setTimeout(function () {
          that.handleStatusLoop();
        }, 2000);
      } else {
        this.handlePaymentDone();
      }
    },

    handlePaymentDone: function () {
      let that = this;
      if (this.status === "expired") {
        this.emotion = "text-warning";
        this.text = "Het betaalverzoek is verlopen!";
      } else if (this.status === "failed") {
        this.emotion = "text-warning";
        this.text = "Het betaalverzoek is mislukt!";
      } else if (this.status === "paid") {
        this.text = "Het betaalverzoek is gelukt";
      } else {
        this.emotion = "text-warning";
        this.text = "Het betaalverzoek is gestoped!";
      }

      window.setTimeout(function () {
        that.$emit("handleClosePayment", that.status);
      }, 2000);
    },

    async handleStatusCheck() {
      const id = this.id;
      let res = await this.$http.get(`golfer/payment/status/${id}`);
      this.status = res.opmStatus;
    },
  },
};
</script>
