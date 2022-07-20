<template>
  <q-page-container>
    <div class="row">
      <div class="col text-center">
        <q-img
          v-if="system_logo"
          :src="system_logo"
          style="width: 40px; height: 40px"
        />
        <h4>Golfbaan't Balletjes</h4>
      </div>
    </div>

    <div v-if="matchId > 0" class="row">
      <div class="col text-center">
        <q-btn
          outline
          color="secondary"
          v-on:click="$router.push('/match?id=' + matchId)"
        >
          Wedstrijdscore
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
        class="col text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
        @click="$router.push('/reservations')"
      >
        <span class="title"
          ><i class="far fa-calendar-star"></i>Starttijden</span
        >
      </div>

      <div
        v-if="toNGF"
        class="col text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
        @click="$router.push('/handicap')"
      >
        <span class="title"><i class="far fa-golf-ball"></i>Handicap</span>
      </div>

      <div
        class="col text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
        @click="$router.push('/match')"
      >
        <span class="title"><i class="far fa-list-alt"></i>Wedstrijden</span>
      </div>
    </div>

    <div class="row q-pl-md q-pr-md q-pt-sm q-gutter-sm">
      <div
        class="col text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
        @click="$router.push('/NGF')"
      >
        <span class="title"><i class="far fa-calendar-star"></i>NGF-Pas</span>
      </div>

      <div
        v-if="toNGF"
        class="col text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
        @click="$router.push('/members')"
      >
        <span class="title"><i class="far fa-golf-ball"></i>Ledenlijst</span>
      </div>

      <div
        class="col text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
        @click="$router.push('/messages')"
      >
        <span class="title"><i class="far fa-list-alt"></i>Berichten</span>
      </div>
    </div>

    <div class="row q-pl-md q-pr-md q-pt-sm q-gutter-sm">
      <div
        class="col text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
        @click="$router.push('/profile')"
      >
        <span class="title"><i class="far fa-calendar-star"></i>Profiel</span>
      </div>

      <div
        v-if="toNGF"
        class="col text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
        @click="$router.push('/members')"
      >
        <span class="title"><i class="far fa-golf-ball"></i>Vrij</span>
      </div>

      <div
        class="col text-center text-white bg-secondary shadow-3 text-bold q-pa-md"
        @click="$router.push('/messages')"
      >
        <span class="title"><i class="far fa-list-alt"></i>Vrij</span>
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
      system_logo: "",
      matchId: 0,
      toNGF: false,
      unreadCount: 0,
      currentUser: {},
      gameScore: -3.4,
      userDropdownValue: null,
      userDropDownOptions: ["logout"],
    };
  },
  created() {
    console.log(this.$dayjs());
    this.loadMessageList();
    this.loadSetting();
    this.currentUser = this.$ls.getItem("currentUser");
  },
  computed: {
    gameScoreText() {
      if (this.gameScore >= 0) {
        return "+" + this.gameScore;
      } else {
        return this.gameScore;
      }
    },
    cardInMemory: function () {
      return this.$ls.getItem('scorecard') == undefined;
    },
  },
  methods: {
    getUnreadMsgCount(list) {
      let unreadCount = 0;
      list.forEach((message) => {
        unreadCount += message.message_opened == null ? 1 : 0;
      });
      this.unreadCount = unreadCount;
    },
    loadSetting() {
      this.$http.get(`golfer/public/setting`).then((res) => {
        // this.system_logo = res.system_logo;
        this.matchId = res.match ? res.match.matchId : null;
        this.toNGF = res.toNGF;
      });
    },
    loadMessageList() {
      this.$http.get(`golfer/message/all`).then((res) => {
        this.getUnreadMsgCount(res.data);
      });
    },
  },
};
</script>
