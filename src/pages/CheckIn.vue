<template>
  <q-page-container>
    <q-page class="q-pa-sm">
      <div v-if="settings.app_checkin_pincode == 1">
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
              color="primary"
              label="0"
              style="font-size: 24px"
              v-on:click="pressKey(0)"
            />
            <q-btn
              class="q-ma-sm"
              color="primary"
              label="1"
              style="font-size: 24px"
              v-on:click="pressKey(1)"
            />
            <q-btn
              class="q-ma-sm"
              color="primary"
              label="2"
              style="font-size: 24px"
              v-on:click="pressKey(2)"
            />
            <q-btn
              class="q-ma-sm"
              color="primary"
              label="3"
              style="font-size: 24px"
              v-on:click="pressKey(3)"
            />
            <q-btn
              class="q-ma-sm"
              color="primary"
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
              color="primary"
              label="5"
              style="font-size: 24px"
              v-on:click="pressKey(5)"
            />
            <q-btn
              class="q-ma-sm"
              color="primary"
              label="6"
              style="font-size: 24px"
              v-on:click="pressKey(6)"
            />
            <q-btn
              class="q-ma-sm"
              color="primary"
              label="7"
              style="font-size: 24px"
              v-on:click="pressKey(7)"
            />
            <q-btn
              class="q-ma-sm"
              color="primary"
              label="8"
              style="font-size: 24px"
              v-on:click="pressKey(8)"
            />
            <q-btn
              class="q-ma-sm"
              color="primary"
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
              color="primary"
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
            color="primary"
            label="Inchecken"
            style="font-size: 24px"
            v-on:click="onCheckIn"
          />
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import authMixin from "../mixins/auth";

export default {
  mixins: [authMixin],
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
      done: false,
      correct: false,
    };
  },
  computed: {
    code: function () {
      return (
        this.NR1.toString() +
        this.NR2.toString() +
        this.NR3.toString() +
        this.NR4.toString()
      );
    },
  },
  methods: {
    async onCheckIn() {
      let flight = { flpNr: this.$route.query.id };
      if (this.flight) {
        let player = this.flight.flight_players.find(
          (player) =>
            player.flpRelNr === this.$store.state.currentUser.item.relNr
        );
        if (player) {
          flight = { flpNr: player.flpNr, code: this.code };
        }
      }
      const res = await this.$http.post("golfer/booking/checkin", flight);
      if (res.data === -1) {
        this.$q.notify({
          type: "negative",
          message: "Onjuiste code",
        });
      } else {
        setTimeout(this.onGoHome, 2000);
      }
      this.onClear();
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
      if (this.nr === 1) {
        this.NR1 = key;
      }
      if (this.nr === 2) {
        this.NR2 = key;
      }
      if (this.nr === 3) {
        this.NR3 = key;
      }
      if (this.nr === 4) {
        this.NR4 = key;
      }

      if (this.nr === 4) {
        this.onCheckIn();
      }

      this.nr = this.nr === 4 ? 1 : this.nr + 1;
    },
  },
};
</script>
