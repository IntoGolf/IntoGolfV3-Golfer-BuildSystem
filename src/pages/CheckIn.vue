<template>
  <q-page-container>
    <div v-if="settings.app_checkin_pincode === 1">
      <h4 v-show="!correct" class="text-center">
        Voer de 4 cijferige check-in code in
      </h4>
      <h5 v-show="!correct" class="text-center">
        u vindt deze code op de baan bij het checkin point
      </h5>
      <h4 v-show="correct" class="text-center">
        Code correct u wordt ingechecked
      </h4>
      <div class="row">
        <div class="q-ml-auto q-mr-auto" style="width: 230px">
          <q-input
            v-model="NR1"
            maxlength="1"
            outlined
            readonly
            style="
              width: 50px;
              float: left;
              margin-right: 10px;
              text-align: center;
              font-size: 24px;
            "
          />
          <q-input
            v-model="NR2"
            maxlength="1"
            outlined
            readonly
            style="
              width: 50px;
              float: left;
              margin-right: 10px;
              text-align: center;
              font-size: 24px;
            "
          />
          <q-input
            v-model="NR3"
            maxlength="1"
            outlined
            readonly
            style="
              width: 50px;
              float: left;
              margin-right: 10px;
              text-align: center;
              font-size: 24px;
            "
          />
          <q-input
            v-model="NR4"
            maxlength="1"
            outlined
            readonly
            style="
              width: 50px;
              float: left;
              text-align: center;
              font-size: 24px;
            "
          />
        </div>
      </div>

      <div class="row q-mt-md">
        <div class="q-ml-auto q-mr-auto q-mb-sm">
          <q-btn
            class="q-ma-sm"
            color="secondary"
            label="0"
            style="font-size: 24px"
            v-on:click="pressKey(0)"
          />
          <q-btn
            class="q-ma-sm"
            color="secondary"
            label="1"
            style="font-size: 24px"
            v-on:click="pressKey(1)"
          />
          <q-btn
            class="q-ma-sm"
            color="secondary"
            label="2"
            style="font-size: 24px"
            v-on:click="pressKey(2)"
          />
          <q-btn
            class="q-ma-sm"
            color="secondary"
            label="3"
            style="font-size: 24px"
            v-on:click="pressKey(3)"
          />
          <q-btn
            class="q-ma-sm"
            color="secondary"
            label="4"
            style="font-size: 24px"
            v-on:click="pressKey(4)"
          />
        </div>
      </div>
      <div class="row">
        <div class="q-ml-auto q-mr-auto">
          <q-btn
            class="q-ma-sm"
            color="secondary"
            label="5"
            style="font-size: 24px"
            v-on:click="pressKey(5)"
          />
          <q-btn
            class="q-ma-sm"
            color="secondary"
            label="6"
            style="font-size: 24px"
            v-on:click="pressKey(6)"
          />
          <q-btn
            class="q-ma-sm"
            color="secondary"
            label="7"
            style="font-size: 24px"
            v-on:click="pressKey(7)"
          />
          <q-btn
            class="q-ma-sm"
            color="secondary"
            label="8"
            style="font-size: 24px"
            v-on:click="pressKey(8)"
          />
          <q-btn
            class="q-ma-sm"
            color="secondary"
            label="9"
            style="font-size: 24px"
            v-on:click="pressKey(9)"
          />
        </div>
      </div>

      <div class="row q-mt-sm">
        <div class="q-ml-auto q-mr-auto">
          <q-btn
            class="q-ma-sm"
            color="secondary"
            label="wissen"
            style="font-size: 24px"
            v-on:click="onClear"
          />
        </div>
      </div>
    </div>

    <div v-else>
      <h4 v-show="!done" class="text-center">
        Klik op onderstaande button om in te checken.
      </h4>
      <h4 v-show="done" class="text-center">U bent ingechecked.</h4>

      <div class="text-center">
        <q-btn
          v-show="!done"
          class="q-ma-sm"
          color="secondary"
          label="Inchecken"
          style="font-size: 24px"
          v-on:click="onCheckIn"
        />
      </div>
    </div>
  </q-page-container>
</template>

<script>
export default {
  components: {},
  props: {
    flight: Object,
  },
  data() {
    return {
      page: 0,
      type: 1,
      NR1: "",
      NR2: "",
      NR3: "",
      NR4: "",
      nr: 1,
      checkCode: "",
      settings: this.$ls.getItem("settings").value,
      done: false,
    };
  },
  created: function () {},
  computed: {
    code: function () {
      return (
        this.NR1.toString() +
        this.NR2.toString() +
        this.NR3.toString() +
        this.NR4.toString()
      );
    },
    correct: function () {
      let result = this.code.length == 4 && this.code == this.checkCode;

      if (result) {
        this.onCheckIn();
      }

      return result;
    },
  },
  methods: {
    onCheckIn: function () {
      let flight = { flpNr: this.$route.query.id };
      this.$http.post("golfer/booking/checkin", flight).then((res) => {
        this.done = true;
        setTimeout(this.onGoHome, 2000);
      });
    },

    onGoHome: function () {
      this.$router.push("/");
    },

    onClear: function () {
      this.NR1 = "";
      this.NR2 = "";
      this.NR3 = "";
      this.NR4 = "";
      this.nr = 1;
    },

    pressKey: function (key) {
      let intTime = this.$filters.timeToMinute(this.$dayjs().format("HH:mm"));
      intTime = intTime * 5767871726;
      this.checkCode = intTime.toString().substr(0, 4);

      if (this.nr == 1) {
        this.NR1 = key;
      }
      if (this.nr == 2) {
        this.NR2 = key;
      }
      if (this.nr == 3) {
        this.NR3 = key;
      }
      if (this.nr == 4) {
        this.NR4 = key;
      }

      this.nr = this.nr == 4 ? 1 : this.nr + 1;
    },

    handleCloseScorecard: function (reload) {
      // this.$http.get("golfer/handicap/all").then((res) => {
      //   that.handicapList = res.data;
      // });
    },
  },
};
</script>
