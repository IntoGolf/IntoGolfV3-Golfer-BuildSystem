<template>
  <div>
    <q-layout view="hHh lpR fFf">
      <q-page-container v-if="!loading">
        <q-toolbar class="text-primary" style="background-color: #2b2d2e">
          <q-btn
            class="text-white"
            dense
            flat
            icon="menu"
            round
            @click="drawer = !drawer"
          />
          <q-toolbar-title class="text-center text-white">
            {{ settings.system_organisation_name }}
          </q-toolbar-title>
        </q-toolbar>

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
    </q-layout>

    <q-drawer
      v-model="drawer"
      show-if-above
      style="background-color: #00a4e8; color: #2e4651"
    >
      <q-list style="min-width: 250px">
        <q-item
          v-if="currentUser.tile_teetimes_y_n == 1"
          v-ripple
          clickable
          @click="$router.push('/reservations')"
        >
          <q-item-section>
            <q-item-label>Starttijden</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-if="currentUser.tile_match_y_n == 1"
          v-ripple
          clickable
          @click="$router.push('/match')"
        >
          <q-item-section>
            <q-item-label>Wedstrijden</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-if="currentUser.app_display_message_tile === 1"
          v-ripple
          clickable
          @click="$router.push('/messages')"
        >
          <q-item-section>
            <q-item-label>Berichten</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-if="currentUser.app_display_message_tile === 1"
          v-ripple
          clickable
          @click="$router.push('/messages')"
        >
          <q-item-section>
            <q-item-label>Berichten</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-if="
            currentUser.tile_teetimes_y_n &&
            settings.app_display_course_status_tile == 1
          "
          v-ripple
          clickable
          @click="$router.push('/course')"
        >
          <q-item-section>
            <q-item-label>Baan</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-if="currentUser.tile_handicap_y_n === 1"
          v-ripple
          clickable
          @click="$router.push('/handicap')"
        >
          <q-item-section>
            <q-item-label>Handicap</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-if="currentUser.tile_handicap_y_n === 1"
          v-ripple
          clickable
          @click="$router.push('/NGF')"
        >
          <q-item-section>
            <q-item-label>NGF-Pas</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-if="currentUser.tile_members_y_n === 1"
          v-ripple
          clickable
          @click="$router.push('/members')"
        >
          <q-item-section>
            <q-item-label>Ledenlijst</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-if="settings.app_display_profile_tile === 1"
          v-ripple
          clickable
          @click="$router.push('/profile')"
        >
          <q-item-section>
            <q-item-label>Profiel</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-if="
            currentUser.tile_horeca_y_n && settings.app_display_balance === 1
          "
          v-ripple
          clickable
          @click="$router.push('/pos')"
        >
          <q-item-section>
            <q-item-label>Horeca</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          v-if="currentUser.tile_shop_y_n"
          v-ripple
          clickable
          @click="$router.push('/shop')"
        >
          <q-item-section>
            <q-item-label>Item 2</q-item-label>
          </q-item-section>
        </q-item>

        <template v-if="currentUser.tile_lessons_y_n">
          <q-item v-ripple clickable @click="$router.push('/proCourse')">
            <q-item-section>
              <q-item-label>Cursussen</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-ripple clickable @click="$router.push('/lessons')">
            <q-item-section>
              <q-item-label>Lessen</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>
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
