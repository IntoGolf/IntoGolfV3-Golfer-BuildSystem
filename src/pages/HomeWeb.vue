<template>
  <q-page-container v-if="!loading" class="web-width">
    <q-page>
      <div class="row cordova-hide" style="height: 230px">
        <div class="col text-center q-pt-lg">
          <q-img
            :fit="'scale-down'"
            :src="blobUrl"
            style="max-width: 400px; max-height: 150px"
          />
          <div v-if="1 === 2" class="text-h4 q-mb-md">
            {{ settings.system_organisation_name }}
          </div>
        </div>
      </div>

      <div
        v-if="settings.app_display_weather === 1"
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

      <div class="row q-pl-md q-pr-md q-gutter-sm">
        <div
          v-show="currentUser.tile_teetimes_y_n"
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/reservations')"
        >
          <span class="title"
            ><i class="far fa-calendar-star"></i>Starttijden</span
          >
        </div>

        <div
          v-if="currentUser.tile_match_y_n"
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/match')"
        >
          <span class="title"><i class="far fa-list-alt"></i>Wedstrijden</span>
        </div>
      </div>

      <div class="row text-h6 q-pl-md q-pr-md q-pt-sm q-gutter-sm">
        <div
          v-if="settings.app_display_message_tile == 1"
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/messages')"
        >
          <span class="title">
            <i class="far fa-list-alt"></i>
            Berichten {{ unreadCount > 0 ? "(" + unreadCount + ")" : "" }}
          </span>
        </div>

        <div
          v-if="
            currentUser.tile_teetimes_y_n &&
            settings.app_display_course_status_tile == 1
          "
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/course')"
        >
          <span class="title"><i class="far fa-golf-ball"></i>Baan</span>
        </div>
      </div>

      <div class="row q-pl-md q-pr-md q-pt-sm q-gutter-sm">
        <div
          v-if="currentUser.tile_handicap_y_n"
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/handicap')"
        >
          <span class="title"><i class="far fa-golf-ball"></i>Handicap</span>
        </div>
        <div
          v-if="currentUser.tile_handicap_y_n"
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/NGF')"
        >
          <span class="title"><i class="far fa-calendar-star"></i>NGF-Pas</span>
        </div>
      </div>

      <div class="row q-pl-md q-pr-md q-pt-sm q-gutter-sm">
        <div
          v-if="currentUser.tile_members_y_n"
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/members')"
        >
          <span class="title"><i class="far fa-golf-ball"></i>Ledenlijst</span>
        </div>

        <div
          v-if="settings.app_display_profile_tile == 1"
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/profile')"
        >
          <span class="title"><i class="far fa-calendar-star"></i>Profiel</span>
        </div>
      </div>

      <div
        v-show="currentUser.tile_horeca_y_n"
        class="row q-pl-md q-pr-md q-pt-sm q-gutter-sm"
      >
        <div
          v-show="
            currentUser.tile_horeca_y_n && settings.app_display_balance === 1
          "
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/pos')"
        >
          <span class="title"><i class="far fa-calendar-star"></i>Horeca</span>
        </div>

        <div
          v-if="currentUser.tile_shop_y_n"
          class="col text-h6 text-center text-white bg-primary shadow-3 text-bold q-pa-md"
          @click="$router.push('/shop')"
        >
          <span class="title"><i class="far fa-golf-ball"></i>Shop</span>
        </div>
      </div>

      <div
        v-show="currentUser.tile_lessons_y_n"
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

export default {
  mixins: [authMixin],
  data() {
    return {
      messageList: [],
      weather: null,
      blobUrl: "",
    };
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
      return localStorage.getItem("golfer__scorecard") !== null;
    },
    unreadCount: function () {
      return this.messageList.filter(
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
  },
};
</script>
