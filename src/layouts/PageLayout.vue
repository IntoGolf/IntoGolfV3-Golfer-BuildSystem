<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-header class="bg-secondary" flat>
        <q-toolbar class="text-primary" style="background-color: #2b2d2e">
          <q-btn
            class="text-white"
            dense
            flat
            icon="menu"
            round
            @click="drawer = !drawer"
          />

          <q-toolbar-title class="text-center" style="color: #edfcff">
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
      <router-view class="web-width" />
    </q-layout>

    <q-drawer
      v-model="drawer"
      :style="{ marginTop: isCordova ? '0' : '50px' }"
      show-if-above
      style="background-color: #2e4651; color: #edfcff"
    >
      <q-list style="min-width: 250px">
        <q-item
          v-for="(item, key) in menuArray"
          v-show="item.visible"
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
import authMixin from "../mixins/auth";

export default defineComponent({
  mixins: [authMixin],
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
  },
  mounted() {
    this.drawer = false;
    this.menuArray = [
      {
        name: "Home",
        icon: "home",
        visible: true,
      },
      {
        name: "reservations",
        icon: "schedule",
        visible: this.currentUser.tile_teetimes_y_n == 1,
      },
      {
        name: "match",
        icon: "sports_golf",
        visible: this.currentUser.tile_match_y_n == 1,
      },
      {
        name: "messages",
        icon: "notes",
        visible: this.currentUser.app_display_message_tile == 1,
      },
      {
        name: "course",
        icon: "grass",
        visible:
          this.currentUser.tile_teetimes_y_n == 1 &&
          this.settings.app_display_course_status_tile == 1,
      },
      {
        name: "handicap",
        icon: "grade",
        visible: this.currentUser.tile_handicap_y_n == 1,
      },
      {
        name: "NGF",
        icon: "credit_card",
        visible: this.currentUser.tile_handicap_y_n == 1,
      },
      {
        name: "members",
        icon: "groups",
        visible: this.currentUser.tile_members_y_n == 1,
      },
      {
        name: "pos",
        icon: "restaurant_enu",
        visible:
          this.currentUser.tile_horeca_y_n &&
          this.settings.app_display_balance == 1,
      },
      {
        name: "shop",
        icon: "shopping_bag",
        visible: this.currentUser.tile_shop_y_n == 1,
      },
      {
        name: "proCourse",
        icon: "shop",
        visible: this.currentUser.tile_lessons_y_n == 1,
      },
      {
        name: "lessons",
        icon: "school",
        visible: this.currentUser.tile_lessons_y_n == 1,
      },
      {
        name: "profile",
        icon: "account_circle",
        visible: true,
      },
    ];
  },
  methods: {
    onMenu: function (name) {
      if (name === "Home") {
        name = "";
      }
      console.log(name);
      this.$router.push("/" + name);
      this.drawer = false;
    },
  },
});
</script>
