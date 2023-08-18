<template>
  <div>
    <q-page-container class="page-bgr">
      <div
        v-if="currentUser.tile_teetimes_y_n && settings.teetime !== null"
        class="row q-mb-md"
      >
        <div class="col text-center">
          <q-btn
            color="secondary"
            outline
            v-on:click="$router.push('/checkin?id=' + settings.teetime.flpNr)"
          >
            Aanmelden starttijd
            {{ $filters.minuteToTime(settings.teetime.fltTime1) }}
          </q-btn>
        </div>
      </div>

      <div
        v-if="currentUser.tile_match_y_n && settings.match !== null"
        class="row q-mb-md"
      >
        <div class="col text-center">
          <q-btn
            color="secondary"
            outline
            v-on:click="$router.push('/match?id=' + settings.match.matchId)"
          >
            Wedstrijd {{ settings.name }}
          </q-btn>
        </div>
      </div>

      <div v-if="cardInMemory" class="row q-mb-md">
        <div class="col text-center">
          <q-btn
            color="secondary"
            outline
            @click="$router.push('/handicap?action=pauzed')"
          >
            Gepauzeerde scorekaart
          </q-btn>
        </div>
      </div>
    </q-page-container>
  </div>
</template>

<script>
import authMixin from "../mixins/auth";

export default {
  mixins: [authMixin],
  data() {
    return {
      messageList: [],
      weather: null,
      blobUrl: "",
      drawer: false,
    };
  },
  mounted() {
    this.drawer = false;
  },
  created() {
    this.$http.get("golfer/image/" + this.settings.system_logo).then((res) => {
      this.blobUrl = "data:image/png;base64," + res;
    });
    if (this.settings.app_display_weather === 1) {
      this.$http.get(`golfer/weather`).then((res) => {
        this.weather = res;
      });
    }
    this.$http.get(`golfer/messages`).then((res) => {
      this.messageList = res;
    });
  },
  computed: {
    cardInMemory: function () {
      return this.$ls.getItem("scorecard").value !== null;
    },
    unreadCount: function () {
      return this.messageList.filter(
        (message) => message.message_opened === null
      ).length;
    },
    weatherHours: function () {
      if (this.weather === null) {
        return [];
      }

      let hour = parseInt(this.$dayjs().format("H"));
      hour = hour > 20 ? 20 : hour;

      return this.weather.forecast.forecastday[0].hour.slice(hour, hour + 4);
    },
  },
  methods: {
    doSomething: function (menu) {},
  },
};
</script>

<style lang="scss">
.page-bgr {
  height: 100vh;
  opacity: 0.3;
  padding-top: 4rem;
  background-image: url("../assets/images/stewie.png");
  background-repeat: no-repeat;
  background-position: center center;

  h1 {
    font-size: 10rem;
    color: #88959e;
  }
}
</style>
