<template>
  <q-page-container class="web-width">
    <q-page>
      <div class="row cordova-hide" style="height: 230px">
        <div class="col text-center q-pt-lg">
          <q-img
            :fit="'scale-down'"
            :src="blobUrl"
            style="max-width: 400px; max-height: 150px"
          />
        </div>
      </div>

      <div
        v-if="$store.state.settings.item.app_display_weather === 1"
        class="row cordova-hide q-mb-md"
      >
        <div v-for="(hour, key) in weatherHours" :key="key" class="col">
          <div class="row">
            <div class="col text-center">
              {{ $dayjs(hour.time).format("HH:mm") }}
            </div>
          </div>
          <div class="row">
            <div class="col text-center">
              <img :src="'https://' + hour.condition.icon" />
            </div>
          </div>
          <div class="row">
            <div class="col text-center q-pa-sm">
              {{ hour.condition.text }}
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="
          $store.state.currentUser.item.tile_teetimes_y_n &&
          $store.state.settings.item.teetime !== null &&
          $store.state.settings.item.teetime !== undefined
        "
        class="row q-mb-md"
      >
        <div class="col text-center">
          <q-btn
            color="secondary"
            outline
            v-on:click="
              $router.push(
                '/checkin?id=' + $store.state.settings.item.teetime.flpNr
              )
            "
          >
            Aanmelden starttijd
            {{
              $filters.minuteToTime($store.state.settings.item.teetime.fltTime1)
            }}
          </q-btn>
        </div>
      </div>

      <div
        v-if="
          $store.state.currentUser.item.tile_match_y_n &&
          $store.state.settings.item.match !== null
        "
        class="row q-mb-md"
      >
        <div class="col text-center">
          <q-btn
            color="secondary"
            outline
            v-on:click="
              $router.push(
                '/match?id=' + $store.state.settings.item.match.matchId
              )
            "
          >
            Wedstrijd {{ $store.state.settings.item.match.name }}
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

      <div
        v-show="setHasCalendar"
        class="row q-pl-md q-pr-md q-pb-sm q-gutter-sm"
      >
        <div
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/Baankalender')"
        >
          <span class="title"
            ><i class="far fa-calendar-star"></i>Baankalender</span
          >
        </div>
      </div>
      <div class="row q-pl-md q-pr-md q-gutter-sm">
        <div
          v-show="usrHasTeeTimes"
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/reservations')"
        >
          <span class="title"
            ><i class="far fa-calendar-star"></i>Starttijden</span
          >
        </div>

        <div
          v-if="usrHasMatch"
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/match')"
        >
          <span class="title"><i class="far fa-list-alt"></i>Wedstrijden</span>
        </div>
      </div>

      <div class="row text-h6 q-pl-md q-pr-md q-pt-sm q-gutter-sm">
        <div
          v-if="setHasMessages"
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/messages')"
        >
          <span class="title">
            <i class="far fa-list-alt"></i>
            Berichten {{ unreadCount > 0 ? "(" + unreadCount + ")" : "" }}
          </span>
        </div>

        <div
          v-if="setHasCourseStatus"
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/Baanstatus')"
        >
          <span class="title"><i class="far fa-golf-ball"></i>Baanstatus</span>
        </div>
      </div>

      <div class="row q-pl-md q-pr-md q-pt-sm q-gutter-sm">
        <div
          v-if="usrHasHandicap"
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/handicap')"
        >
          <span class="title"><i class="far fa-golf-ball"></i>Handicap</span>
        </div>
        <div
          v-if="usrHasHandicap"
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/NGF')"
        >
          <span class="title"><i class="far fa-calendar-star"></i>NGF-Pas</span>
        </div>
      </div>

      <div class="row q-pl-md q-pr-md q-pt-sm q-gutter-sm">
        <div
          v-if="usrHasMembers"
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/members')"
        >
          <span class="title"><i class="far fa-golf-ball"></i>Ledenlijst</span>
        </div>

        <div
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/profile')"
        >
          <span class="title"><i class="far fa-calendar-star"></i>Profiel</span>
        </div>
      </div>

      <div v-show="usrHasPos" class="row q-pl-md q-pr-md q-pt-sm q-gutter-sm">
        <div
          v-show="usrHasPos && setHasBalance"
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/pos')"
        >
          <span class="title"><i class="far fa-calendar-star"></i>Horeca</span>
        </div>

        <div
          v-if="usrHasShop"
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/shop')"
        >
          <span class="title"><i class="far fa-golf-ball"></i>Shop</span>
        </div>
      </div>

      <div
        v-show="usrHasLessons"
        class="row q-pl-md q-pr-md q-pt-sm q-gutter-sm"
      >
        <div
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/proCourse')"
        >
          <span class="title"
            ><i class="far fa-calendar-star"></i>Cursussen</span
          >
        </div>
        <div
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/lessons')"
        >
          <span class="title"><i class="far fa-calendar-star"></i>Lessen</span>
        </div>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import authMixin from "../mixins/auth";
import { mapGetters } from "vuex";

export default {
  mixins: [authMixin],
  data() {
    return {
      weather: null,
      blobUrl: "",
    };
  },
  created() {
    this.loadImage();
    this.loadWeather();
  },
  computed: {
    cardInMemory: function () {
      return localStorage.getItem("golfer__scorecard") !== null;
    },
    unreadCount: function () {
      return this.$store.state.messages.items.filter(
        (message) => message.message_opened === null
      ).length;
    },
    weatherHours: function () {
      if (
        this.weather === null ||
        this.weather.forecast.forecastday.length === 0
      ) {
        return [];
      }

      let hour = parseInt(this.$dayjs().format("H"));
      hour = hour > 20 ? 20 : hour;

      return this.weather.forecast.forecastday[0].hour.slice(hour, hour + 4);
    },
    ...mapGetters("settings", [
      "setHasCalendar",
      "setHasCircles",
      "setHasBalance",
      "setHasCourseStatus",
      "setHasGreenFeeCard",
      "setHasMessages",
    ]),
    ...mapGetters("currentUser", [
      "usrHasLessons",
      "usrHasShop",
      "usrHasPos",
      "usrHasHandicap",
      "usrHasMatch",
      "usrHasMembers",
      "usrHasLessons",
      "usrHasTeeTimes",
    ]),
  },
  methods: {
    loadImage() {
      this.$http
        .get("golfer/image/" + this.$store.state.settings.item.system_logo)
        .then((res) => {
          this.blobUrl = "data:image/png;base64," + res;
        });
    },
    loadWeather() {
      if (this.$store.state.settings.item.app_display_weather === 1) {
        this.$http.get(`golfer/weather`).then((res) => {
          this.weather = res;
        });
      }
    },
  },
};
</script>
