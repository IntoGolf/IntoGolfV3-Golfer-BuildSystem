<template>
  <div class="page-NGF container q-mt-xl" v-loading="loading">

<!--    <top-bar-->
<!--      v-bind:title="title"-->
<!--      v-bind:back_icon="back_icon"-->
<!--      v-bind:back_link="back_link"-->
<!--      v-bind:callBack="callBack"-->
<!--    ></top-bar>-->

    <div class="row mt-5">
      <img
        ref="ngfCard"
        :src="blobUrl"
        :style="{
          height: cardHeight,
          width: cardWidth,
          top: cardTop,
          left: cardLeft,
          transform: cardTransform,
        }"
        class="img-fluid ngf_card"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@media screen and (max-width: 576px) {
  .ngf_card {
    left: 0 !important;
  }
}

@media screen and (min-width: 576px) {
  .ngf_card {
    left: 0 !important;
    margin-top: 80px;
    max-width: 640px;
    max-height: 380px;
    margin-left: calc(50% - 320px);
    margin-right: auto;
  }
}

.ngf_card {
  position: fixed;
}
</style>

<script>
// import TopBar from "../components/TopBar";

export default {
  data: function () {
    return {
      loading: false,

      back_icon: "fa-home",
      back_link: "/",
      title: "NGF-kaart",
      callBack: undefined,

      currentUser: Object.assign(this.$ls.getItem("currentUser")),
      blobUrl: "",
      cardHeight: "0",
      cardWidth: "0",
      cardTop: "0",
      cardLeft: "0",
      cardTransform: "none",
      degree: 0,
    };
  },
  created() {
    this.loadCard();
    window.addEventListener("resize", this.rotate);
  },
  methods: {
    loadCard() {
      let that = this;
      this.$http
        .get("golfer/handicap/card")
        .then((res) => {
          that.blobUrl = "data:image/png;base64," + res.base64;
          that.rotate();
        })
        .catch((error) => {
          this.$q.notify({
            message: error,
            type: "negative",
            icon: "announcement",
            actions: [
              {
                label: "Dismiss",
                color: "white",
                handler: () => {
                  /* ... */
                },
              },
            ],
          });
        });
    },

    imgPos: function (scale) {
      let headerOffset = 40;
      let widthOffset = 30;
      let cardHeight = 505;
      let cardWidth = 900;

      let vh = document.documentElement.clientHeight - headerOffset;
      let vw = document.documentElement.clientWidth - widthOffset;

      let ratio = vw / cardWidth;

      let scaledCardHeight = cardHeight * ratio * scale;
      let scaledCardWidth = cardWidth * ratio * scale;

      this.cardHeight = scaledCardHeight + "px";
      this.cardWidth = scaledCardWidth + "px";
      this.cardTop = vh / 2 - scaledCardHeight / 2 + headerOffset + "px";
      this.cardLeft = (scaledCardWidth / 2 - vw / 2) * -1 + "px";
    },

    rotate: function () {
      if (
        document.documentElement.clientHeight >
        document.documentElement.clientWidth
      ) {
        this.imgPos(1.5);
        this.cardTransform = "rotate(90deg)";
      } else {
        this.imgPos(0.8);
        this.cardTransform = "rotate(0deg)";
      }
    },
  },
};
</script>
