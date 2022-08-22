<template>

  <q-page-container class="web-width">

    <div class="row">
      <div class="col text-center q-pt-lg">
        <q-img
            src="~assets/images/logo_nw.svg"
            style="width: 100px;"
        />
        <h4>Demo GolfClub</h4>
      </div>
    </div>

    <div v-if="match != null" class="row q-mb-md">
      <div class="col text-center">
        <q-btn
            outline
            color="secondary"
            v-on:click="$router.push('/match?id=' + match.matchId)"
        >
          Wedstrijd {{match.name}}
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
          class="col text-h6 text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
          @click="$router.push('/reservations')">
        <span class="title"
        ><i class="far fa-calendar-star"></i>Starttijden</span>
      </div>

      <div
          v-if="toNGF"
          class="col text-h6 text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
          @click="$router.push('/handicap')"
      >
        <span class="title"><i class="far fa-golf-ball"></i>Handicap</span>
      </div>

    </div>

    <div class="row q-pl-md q-pr-md q-pt-sm q-gutter-sm">
      <div
          class="col text-h6 text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
          @click="$router.push('/match')"
      >
        <span class="title"><i class="far fa-list-alt"></i>Wedstrijden</span>
      </div>
      <div
          v-if="toNGF"
          class="col text-h6 text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
          @click="$router.push('/NGF')"
      >
        <span class="title"><i class="far fa-calendar-star"></i>NGF-Pas</span>
      </div>
    </div>

    <div class="row text-h6 q-pl-md q-pr-md q-pt-sm q-gutter-sm">
      <div
          v-if="toNGF"
          class="col text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
          @click="$router.push('/members')"
      >
        <span class="title"><i class="far fa-golf-ball"></i>Ledenlijst</span>
      </div>

      <div
          class="col text-h6 text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
          @click="$router.push('/messages')"
      >
        <span class="title">
          <i class="far fa-list-alt"></i>
          Berichten {{ unreadCount > 0 ? '(' + unreadCount + ')' : ''}}
        </span>
      </div>
    </div>

    <div class="row q-pl-md q-pr-md q-pt-sm q-gutter-sm">
      <div
          class="col text-h6 text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
          @click="$router.push('/profile')"
      >
        <span class="title"><i class="far fa-calendar-star"></i>Profiel</span>
      </div>

      <div
          v-if="toNGF"
          class="col text-h6 text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
          @click="$router.push('/')"
      >
        <span class="title"><i class="far fa-golf-ball"></i>Aanmelden</span>
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
         @click="$router.push('/Course_status_mobile')">
      <span class="title"><i class="far fa-comment"></i>Baanstatus</span>
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
      system_logo: '../../src/assets/images/logo_nw.svg',
      match: null,
      toNGF: false,
      messageList: [],
    };
  },
  created() {
    this.loadMessageList();
    this.loadSetting();
  },
  computed: {
    cardInMemory: function () {
      return this.$ls.getItem('scorecard').value != null;
    },
    unreadCount: function() {
      return this.messageList.filter(message => message.message_opened == null).length;
    }
  },
  methods: {
    loadSetting() {
      this.$http.get(`golfer/public/setting`).then((res) => {
        // this.system_logo = res.system_logo;
        this.match = res.match ? res.match : null;
        this.toNGF = res.toNGF;
      });
    },
    loadMessageList() {
      this.$http.get(`golfer/message/all`).then((res) => {
        this.messageList = res.data;
      });
    },
  },
};
</script>
