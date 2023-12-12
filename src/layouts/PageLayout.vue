<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-header class="web-width q-header" flat>
        <q-toolbar>
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
            v-if="$q.platform.is.desktop"
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
      <router-view class="bg-white web-width q-pl-md q-pr-md q-mt-sm" />
    </q-layout>

    <q-drawer
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
      ></div>
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
            <q-item-label>{{ $t(item.name) }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "PageLayout",
  data() {
    return {
      drawer: false,
      menuArray: [],
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
  mounted() {
    this.drawer = false;
    this.menuArray = [
      {
        name: "Dashboard",
        icon: "home",
        visible: true,
      },
      {
        name: "Baankalender",
        icon: "schedule",
        visible: this.setHasCalendar,
      },
      {
        name: "reservations",
        icon: "schedule",
        visible: this.usrHasTeeTimes,
      },
      {
        name: "greenfeecards",
        icon: "schedule",
        visible: this.setHasGreenFeeCard,
      },
      {
        name: "match",
        icon: "sports_golf",
        visible: this.usrHasMatch,
      },
      {
        name: "messages",
        icon: "notes",
        visible: this.setHasMessages,
      },
      {
        name: "Baanstatus",
        icon: "grass",
        visible: this.setHasCourseStatus,
      },
      {
        name: "handicap",
        icon: "grade",
        visible: this.usrHasHandicap,
      },
      {
        name: "NGF",
        icon: "credit_card",
        visible: this.usrHasHandicap,
      },
      {
        name: "members",
        icon: "groups",
        visible: this.usrHasMembers,
      },
      {
        name: "pos",
        icon: "restaurant_enu",
        visible: this.usrHasPos && this.setHasBalance,
      },
      {
        name: "shop",
        icon: "shopping_bag",
        visible: this.usrHasShop,
      },
      {
        name: "proCourse",
        icon: "shop",
        visible: this.usrHasLessons,
      },
      {
        name: "lessons",
        icon: "school",
        visible: this.usrHasLessons,
      },
      {
        name: "lessoncards",
        icon: "school",
        visible: this.usrHasLessons,
      },
      {
        name: "profile",
        icon: "account_circle",
        visible: true,
      },
      {
        name: "circle",
        icon: "account_circle",
        visible: this.setHasCircles,
      },
    ];
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
