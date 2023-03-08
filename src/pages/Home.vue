<template>

  <q-page-container class="web-width">

    <div class="row" style="height: 230px">
      <div class="col text-center q-pt-lg">
        <q-img
            :src="blobUrl"
            style="max-width: 400px; max-height: 150px"
            :fit="'scale-down'"
        />
        <div class="text-h4 q-mb-md">{{ this.settings.system_organisation_name }}</div>
      </div>
    </div>

    <div class="row q-mb-md" style="height: 135px">

      <div
          class="col"
          v-for="(hour,key) in weatherHours"
          :key="key">
        <div class="row">
          <div class="col text-center">
            {{ $dayjs(hour.time).format('HH:mm') }}
          </div>
        </div>
        <div class="row">
          <div class="col text-center">
            <img :src="'https://' + hour.condition.icon"/>
          </div>
        </div>
        <div class="row">
          <div class="col text-center">
            {{ hour.condition.text }}
          </div>
        </div>


      </div>
    </div>

    <div v-if="this.settings.teetime != null" class="row q-mb-md">
      <div class="col text-center">
        <q-btn
            outline
            color="secondary"
            v-on:click="$router.push('/checkin?id=' + this.settings.teetime.flpNr)">
          Aanmelden starttijd {{ $filters.minuteToTime(this.settings.teetime.fltTime1) }}
        </q-btn>
      </div>
    </div>

    <div v-if="this.settings.match != null" class="row q-mb-md">
      <div class="col text-center">
        <q-btn
            outline
            color="secondary"
            v-on:click="$router.push('/match?id=' + this.settings.match.matchId)">
          Wedstrijd {{ this.settings.match.name }}
        </q-btn>
      </div>
    </div>

    <div v-if="cardInMemory" class="row q-mb-md">
      <div class="col text-center">
        <q-btn
            outline
            color="secondary"
            @click="$router.push('/handicap?action=pauzed')"
        >
          Gepauzeerde scorekaart
        </q-btn>
      </div>
    </div>

    <div class="row q-pl-md q-pr-md q-gutter-sm">
      <div
          v-show="settings.app_display_teetime_tile == 1"
          class="col text-h6 text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
          @click="$router.push('/reservations')">
        <span class="title"
        ><i class="far fa-calendar-star"></i>Starttijden</span>
      </div>

      <div
          v-if="settings.app_display_handicap_tile == 1 && toNGF"
          class="col text-h6 text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
          @click="$router.push('/handicap')"
      >
        <span class="title"><i class="far fa-golf-ball"></i>Handicap</span>
      </div>

    </div>

    <div class="row q-pl-md q-pr-md q-pt-sm q-gutter-sm">
      <div
          v-if="settings.app_display_event_tile == 1"
          class="col text-h6 text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
          @click="$router.push('/match')"
      >
        <span class="title"><i class="far fa-list-alt"></i>Wedstrijden</span>
      </div>
      <div
          v-if="settings.app_display_handicap_tile == 1 && toNGF"
          class="col text-h6 text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
          @click="$router.push('/NGF')"
      >
        <span class="title"><i class="far fa-calendar-star"></i>NGF-Pas</span>
      </div>
    </div>

    <div class="row text-h6 q-pl-md q-pr-md q-pt-sm q-gutter-sm">
      <div
          v-if="settings.app_display_member_search_tile == 1"
          class="col text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
          @click="$router.push('/members')">
        <span class="title"><i class="far fa-golf-ball"></i>Ledenlijst</span>
      </div>

      <div
          v-if="settings.app_display_message_tile == 1"
          class="col text-h6 text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
          @click="$router.push('/messages')">
        <span class="title">
          <i class="far fa-list-alt"></i>
          Berichten {{ unreadCount > 0 ? '(' + unreadCount + ')' : '' }}
        </span>
      </div>
    </div>

    <div class="row q-pl-md q-pr-md q-pt-sm q-gutter-sm">
      <div
          v-if="settings.app_display_profile_tile == 1"
          class="col text-h6 text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
          @click="$router.push('/profile')"
      >
        <span class="title"><i class="far fa-calendar-star"></i>Profiel</span>
      </div>

      <div
          v-if="settings.app_display_course_status_tile == 1"
          class="col text-h6 text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
          @click="$router.push('/course')">
        <span class="title"><i class="far fa-golf-ball"></i>Baan</span>
      </div>

    </div>

    <div class="row q-pl-md q-pr-md q-pt-sm q-gutter-sm">
      <div
          v-show="settings.app_display_balance == 1"
          class="col text-h6 text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
          @click="$router.push('/pos')">
        <span class="title"><i class="far fa-calendar-star"></i>Horeca</span>
      </div>

      <div
          v-if="settings.app_display_shop_tile == 1"
          class="col text-h6 text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
          @click="$router.push('/shop')">
        <span class="title"><i class="far fa-golf-ball"></i>Shop</span>
      </div>

    </div>

    <!--
    <div class="btn d-flex flex-column justify-center align-items-center p-2 m-2"
         @click="$router.push('/event_list_mobile')">
      <span class="title"><i class="far fa-calendar-alt"></i>Evenementen</span>
    </div>

    <div class="btn d-flex flex-column justify-center align-items-center p-2 m-2"
         @click="$router.push('/calendar_mobile')">
      <span class="title"><i class="far fa-calendar-star"></i>Calender</span>
    </div>

    <div class="btn d-flex flex-column justify-center align-items-center p-2 m-2"
         @click="$router.push('/meerronden_list_mobile')">
      <span class="title"><i class="far fa-circle"></i>Meerronden</span>
    </div>
    -->

    <!--
    <div class="btn d-flex flex-column justify-center align-items-center p-2 m-2"
         @click="$router.push('/order_list_mobile')">
      <span class="title"><i class="far fa-shopping-cart"></i>Facturen</span>
    </div>
    -->

  </q-page-container>

</template>

<script>

export default {
  components: {},
  data() {
    return {
      toNGF: this.$ls.getItem('currentUser').value.to_ngf,
      messageList: [],
      weather: null,
      blobUrl: '',
      settings: {
        app_display_member_search_tile: 0,
        app_display_balance: 0,
        app_display_event_tile: 0,
        app_display_course_status_tile: 0,
        app_display_teetime_tile: 0,
        match: null,
        system_logo: '',
        system_organisation_name: '',
        teetime: null
      }
    };
  },
  created() {
    this.loadMessageList();
    this.loadSetting();
    this.loadWeather();
  },
  computed: {
    cardInMemory: function () {
      return this.$ls.getItem('scorecard').value != null;
    },
    unreadCount: function () {
      return this.messageList.filter(message => message.message_opened == null).length;
    },
    weatherHours: function () {
      if (this.weather == null) {
        return [];
      }

      let hour = parseInt(this.$dayjs().format('H'));
      hour = hour > 20 ? 20 : hour;

      return this.weather.forecast.forecastday[0].hour.slice(hour, hour + 4);
    }
  },
  methods: {
    takePicture: function () {
      this.camera('environment');
    },

    loadSetting() {

      let that = this;
      this.$http.get(`golfer/settings`).then((res) => {
        this.settings = res;
        this.$ls.setItem('settings', res, 1000 * 60 * 60 * 24 * 7);
        this.$http.get("golfer/image/" + this.settings.system_logo)
            .then((res) => {
              that.blobUrl = "data:image/png;base64," + res;
            });
      });
    },

    loadMessageList() {
      this.$http.get(`golfer/messages`).then((res) => {
        this.messageList = res;
      });
    },

    loadWeather() {

      if (this.$ls.getItem('weather').value && 1 == 2) {
        this.weather = this.$ls.getItem('weather').value;
      } else {
        this.$http.get(`golfer/weather`).then((res) => {
          this.weather = res;
          this.$ls.setItem('weather', res);
        });
      }
    }

  }
}
;
</script>
