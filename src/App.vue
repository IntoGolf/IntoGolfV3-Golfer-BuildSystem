<template>
  <q-layout v-if="['/login'].includes($route.path)">
    <login />
  </q-layout>
  <q-layout v-else id="layoutParent" ref="layoutParent" view="lHh Lpr lFf">
    <q-header
      v-if="
        ![
          '/login',
          '/teetimes',
          '/sign-up',
          '/public_lessons',
          '/classes',
        ].includes($route.path)
      "
      ref="layoutHeader"
      class="web-width q-header"
      flat
    >
      <q-toolbar
        v-if="!['/', '/login'].includes($route.path) || $q.platform.is.mobile"
      >
        <q-btn
          v-if="!$q.platform.is.desktop"
          :style="{
            color: $store.state.settings.item.app_primary_font_color,
          }"
          dense
          flat
          icon="menu"
          round
          @click="drawer = !drawer"
        />
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
          dense
          flat
          icon="account_circle"
          round
          v-on:click="$router.push('/profile')"
        />
      </q-toolbar>
    </q-header>
    <router-view class="bg-white web-width" />
    <!-- Render this part on non-desktop devices -->
    <q-drawer
      v-if="$q.platform.is.mobile"
      v-model="drawer"
      :style="{ marginTop: isCordova ? '0' : '42px' }"
      class="q-drawer"
      show-if-above
    >
      <div
        style="
          width: 100%;
          text-align: center;
          padding-top: 10px;
          padding-bottom: 5px;
        "
      />
      <q-list style="min-width: 250px">
        <q-item
          v-for="(item, key) in menuVisibleArray"
          :key="key"
          v-ripple
          clickable
          @click="onMenu(item.name)"
        >
          <q-item-section side>
            <q-icon :name="item.icon" style="color: #edfcff" />
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
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import Login from "pages/Login.vue";

export default defineComponent({
  name: "PageLayout",
  components: { Login },
  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    isCordova() {
      return this.$q.platform.is.cordova || this.$q.platform.is.mobile;
    },
    headerColor() {
      return this.$store.state.settings.item.app_primary_color;
    },
    menuVisibleArray() {
      return this.menuArray.filter((item) => item.visible);
    },
    ...mapGetters("settings", [
      "setHasCalendar",
      "setHasCircles",
      "setHasBalance",
      "setHasCourseStatus",
      "setHasGreenFeeCard",
      "setHasMessages",
      "usrHasExtTeetime",
      "usrHasCourseStatus",
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
    menuArray() {
      return [
        {
          name: "Dashboard",
          menuName: "Dashboard",
          icon: "home",
          visible: true,
        },
        {
          name: "Baankalender",
          menuName: "Baankalender",
          icon: "schedule",
          visible: this.setHasCalendar,
        },
        {
          name: "Meerronden",
          menuName: "Meerronden",
          icon: "schedule",
          visible: true,
        },
        {
          name: "Chat",
          menuName: "Chat",
          icon: "chat",
          visible: this.setHasCircles,
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
          icon: "schedule",
          visible: this.usrHasTeeTimes,
        },
        {
          name: "greenfeecards",
          menuName: "greenfeecards",
          icon: "schedule",
          visible: this.setHasGreenFeeCard,
        },
        {
          name: "match",
          menuName: "match",
          icon: "sports_golf",
          visible: this.usrHasMatch,
        },
        {
          name: "messages",
          menuName: "messages",
          icon: "notes",
          visible: this.setHasMessages,
        },
        {
          name: "Baanstatus",
          menuName: "Baanstatus",
          icon: "grass",
          visible: this.setHasCourseStatus,
        },
        {
          name: "handicap",
          menuName: "handicap",
          icon: "grade",
          visible: this.usrHasHandicap,
        },
        {
          name: "NGF",
          menuName: "NGF",
          icon: "credit_card",
          visible: this.usrHasHandicap,
        },
        {
          name: "members",
          menuName: "members",
          icon: "groups",
          visible: this.usrHasMembers,
        },
        {
          name: "pos",
          menuName: "pos",
          icon: "restaurant_enu",
          visible: this.usrHasPos && this.setHasBalance,
        },
        {
          name: "shop",
          menuName: "shop",
          icon: "shopping_bag",
          visible: this.usrHasShop,
        },
        {
          name: "proCourse",
          menuName: "proCourse",
          icon: "shop",
          visible: this.usrHasLessons,
        },
        {
          name: "lessons",
          menuName: "lessons",
          icon: "school",
          visible: this.usrHasLessons,
        },
        {
          name: "lessoncards",
          menuName: "lessoncards",
          icon: "school",
          visible: this.usrHasLessons,
        },
        {
          name: "profile",
          menuName: "profile",
          icon: "account_circle",
          visible: true,
        },
      ];
    },
  },
  mounted() {
    this.drawer = false;
  },
  methods: {
    onMenu: function (name) {
      if (name === "Dashboard") {
        name = "";
      }
      this.$router.push("/" + name);
      this.drawer = false;
    },
  },
});
</script>
