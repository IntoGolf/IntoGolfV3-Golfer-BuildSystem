<template>
  <q-layout
    v-if="['/login'].includes($route.path)"
    class="ios-layout-safe"
  >
    <login/>
  </q-layout>
  <q-layout
    v-else
    id="layoutParent"
    ref="layoutParent"
    :style="{ maxWidth: showFullHeader ? '480px' : '800px' }"
    style="margin-left: auto; margin-right: auto"
    view="lHh Lpr lFf"
  >
    <q-header v-if="showFullHeader" class="shadow-2">
      <div
        class="text-h5 q-pa-md"
        style="max-width: 480px; margin-left: auto; margin-right: auto"
      >
        {{ this.$route.meta.title }}
      </div>
    </q-header>
    <q-header
      v-if="showHeader"
      ref="layoutHeader"
      :style="{
        color: $store.state.settings.item.app_primary_font_color,
        backgroundColor: $store.state.settings.item.app_primary_color,
      }"
      class="web-width q-header ios-safe-header"
      flat
    >
      <q-toolbar
        v-if="
          !['/', '/login', 'verify-code'].includes($route.path) || this.isApp
        "
      >
        <q-btn
          v-if="this.isApp"
          :style="{
            color: $store.state.settings.item.app_primary_font_color,
          }"
          dense
          flat
          icon="menu"
          round
          @click="drawer = !drawer"
        >
        </q-btn>
        <q-btn
          v-else
          :style="{
            color: $store.state.settings.item.app_primary_font_color,
          }"
          dense
          flat
          icon="menu"
          round
          @click="$router.push('/')"
        />
        <q-toolbar-title
          :style="{
            color: $store.state.settings.item.app_primary_font_color,
          }"
          class="text-center"
        >
          {{ this.$route.meta.title }}
        </q-toolbar-title>
        <q-btn
          v-if="!['home'].includes($route.name)"
          dense
          flat
          icon="home"
          round
          v-on:click="$router.push('/')"
        />
        <q-btn v-else dense flat round/>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view :key="$route.fullPath" class="web-width bg-white"/>
    </q-page-container>
    <q-drawer
      v-if="isApp"
      v-model="drawer" :style="{backgroundColor:backgroundColor}"
      class="q-drawer"
      show-if-above>
      <div
        style="
          width: 100%;
          text-align: center;
          padding-top: 42px;
          padding-bottom: 5px;
        "
      />
      <q-list style="min-width: 250px">
        <q-item
          v-for="(item, key) in menuVisibleArray"
          :key="key"
          v-ripple
          :style="qItemActiveStyle(item.name)"
          active-class="qItemActiveClass"
          clickable
          v-on:click="onMenu(item.name)"
        >
          <q-item-section side>
            <q-icon :name="item.icon" style="color: #edfcff"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t(item.menuName) }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
  </q-layout>
</template>

<script>
import {defineComponent} from "vue";
import {mapGetters} from "vuex";
import Login from "pages/Login.vue";
import {setCssVar} from "quasar";
import PushNotificationService from "src/services/PushNotificationService.js";

export default defineComponent({
  name: "PageLayout",
  components: {Login},
  data() {
    return {
      drawer: false,
      pushService: null,
    };
  },
  computed: {
    backgroundColor() {
      return this.getBackgroundColor;
    },
    fullName() {
      if (this.$store.getters["currentUser/item"]) {
        return this.$store.getters["currentUser/item"].full_name2;
      }
      return "";
    },
    isApp() {
      return this.$q.platform.is.capacitor || this.$q.platform.is.mobile;
    },
    showFullHeader() {
      if (["/publicLesson", "/classes", "/publicStatus", "/publicWalkins"].includes(this.$route.path)) {
        return true;
      }
      return false;
    },
    showHeader() {
      if (
        [
          "/login",
          "/teetimes",
          "/signUp",
          "/verifyCode",
          "/publicLesson",
          "/classes",
          "/publicWalkins",
          "/publicStatus",
        ].includes(this.$route.path)
      ) {
        return false;
      }
      return !(this.$q.platform.is.desktop && this.$route.path === "/");
    },
    headerColor() {
      return this.$store.state.settings.item.app_primary_color;
    },
    menuVisibleArray() {
      return this.menuArray.filter((item) => item.visible);
    },
    ...mapGetters("settings", [
      "setHasActivities",
      "setHasInvoices",
      "setHasCalendar",
      "setHasCircles",
      "setHasBalance",
      "setHasCourseStatus",
      "setHasGreenFeeCard",
      "setHasMessages",
      "usrHasExtTeetime",
      "usrHasCourseStatus",
      "showWhs",
      "showHistory",
      "getBackgroundColor",
      "showMoreRound",
      "menuTextLedenBoekje"
    ]),
    ...mapGetters("currentUser", [
      "usrHasLessons",
      "usrHasCalendar",
      "usrHasInvoices",
      "usrHasShop",
      "usrHasPos",
      "usrHasHandicap",
      "usrHasMatch",
      "usrHasMembers",
      "usrHasLessons",
      "usrHasTeeTimes",
    ]),
    menuArray() {
      return [
        {
          name: "/",
          menuName: "Home",
          icon: "home",
          visible: true,
        },
        {
          name: "baankalender",
          menuName: "Baankalender",
          icon: "calendar_month",
          visible: this.usrHasCalendar,
        },
        {
          name: "nonGolfEvents",
          menuName: "Activiteiten",
          icon: "schedule",
          visible: this.setHasActivities,
        },
        {
          name: "match",
          menuName: "match",
          icon: "emoji_events",
          visible: this.usrHasMatch,
        },
        {
          name: "meerronden",
          menuName: "Meerronden",
          icon: "emoji_events",
          visible: this.usrHasMatch && this.showMoreRound,
        },
        {
          name: "invoice",
          menuName: "Facturen",
          icon: "euro",
          visible: this.usrHasInvoices,
        },
        {
          name: "chat",
          menuName: "Chat",
          icon: "chat",
          visible: this.setHasCircles,
          //visible: true,
        },
        {
          name: "external_teetimes",
          menuName: "Starttijden",
          icon: "schedule",
          visible: this.usrHasExtTeetime,
        },
        {
          name: "external_course_status",
          menuName: "Baanstatus",
          icon: "grass",
          visible: this.usrHasCourseStatus,
        },
        {
          name: "reservations",
          menuName: "reservations",
          icon: "sports_golf",
          visible: this.usrHasTeeTimes,
        },
        {
          name: "greenfeecards",
          menuName: "greenfeecards",
          icon: "schedule",
          visible: this.setHasGreenFeeCard,
        },
        {
          name: "messages",
          menuName: "messages",
          icon: "feed",
          visible: this.setHasMessages,
        },
        {
          name: "baanstatus",
          menuName: "Baanstatus",
          icon: "grass",
          visible: this.setHasCourseStatus,
        },
        {
          name: "history",
          menuName: "Speelhistorie",
          icon: "calendar_month",
          visible: this.showHistory,
        },
        {
          name: "handicap",
          menuName: "handicap",
          icon: "trending_down",
          visible: this.usrHasHandicap,
        },
        {
          name: "ngf",
          menuName: "NGF",
          icon: "credit_card",
          visible: this.usrHasHandicap,
        },
        {
          name: "members",
          menuName: this.menuTextLedenBoekje,
          icon: "groups",
          visible: this.usrHasMembers,
        },
        {
          name: "friends",
          menuName: "Vrienden",
          icon: "people",
          visible: true,
        },
        {
          name: "open-bookings",
          menuName: "Open Bookings",
          icon: "lock_open",
          visible: true,
        },
        {
          name: "pos",
          menuName: "Horeca saldo",
          icon: "credit_card",
          visible: this.usrHasPos && this.setHasBalance,
        },
        {
          name: "shop",
          menuName: "shop",
          icon: "shopping_bag",
          visible: this.usrHasShop,
        },
        // {
        //   name: "proCourse",
        //   menuName: "proCourse",
        //   icon: "shop",
        //   visible: this.usrHasLessons,
        // },
        {
          name: "lessons",
          menuName: "lessons",
          icon: "school",
          visible: this.usrHasLessons,
        },
        {
          name: "whs",
          menuName: "WHS",
          icon: "school",
          visible: this.showWhs,
        },
        // {
        //   name: "lessoncards",
        //   menuName: "lessoncards",
        //   icon: "school",
        //   visible: this.usrHasLessons,
        // },
        {
          name: "profile",
          menuName: "profile",
          icon: "account_circle",
          visible: true,
        },
      ];
    },
  },
  async mounted() {
    console.log('📱 App.vue mounted() - Starting initialization');
    this.drawer = false;
    await this.setColors();

    // Initialize push notification service and get REAL FCM token
    try {
      this.pushService = new PushNotificationService(this, this.$router, this.$axios);
      await this.pushService.initialize();
    } catch (error) {
      console.error('📱 Push service error:', error);
      this.$q.notify({
        type: 'negative',
        message: 'Push Service Error',
        caption: error.message,
        timeout: 5000
      });
    }
  },
  async beforeUnmount() {
    // Cleanup push notification service
    if (this.pushService) {
      await this.pushService.cleanup();
    }
  },
  methods: {

    qItemActiveStyle(name) {
      return {
        fontWeight: this.$route.name === name ? 'bold' : ''
      }
    },
    onMenu(name) {
      if (name === this.$route.name) {
        this.$router.replace({path: '/reload', query: {page: this.$route.name}});
      } else {
        this.$router.replace({path: '/' + name});
      }
    },
    async setColors() {
      let settings = this.$store.state.settings.publicItems;
      if (settings.app_primary_color === undefined) {
        await this.$store.dispatch("settings/fetchPublicSettings")
        settings = this.$store.state.settings.publicItems;
      }

      setCssVar("primary", settings.app_primary_color);
      setCssVar("primary_font", settings.app_primary_font_color);
      setCssVar("secondary", settings.app_secondary_color);
      setCssVar("secondary_font", settings.app_secondary_font_color);
    }
  }
})
</script>

<style>
.qItemActiveClass {
  color: white;
  font-weight: bold;
}
</style>
