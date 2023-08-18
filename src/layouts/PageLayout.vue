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
        name: "reservations",
        visible: this.currentUser.tile_teetimes_y_n == 1,
      },
      {
        name: "match",
        visible: this.currentUser.tile_match_y_n == 1,
      },
      {
        name: "messages",
        visible: this.currentUser.app_display_message_tile == 1,
      },
      {
        name: "course",
        visible:
          this.currentUser.tile_teetimes_y_n == 1 &&
          this.settings.app_display_course_status_tile == 1,
      },
      {
        name: "handicap",
        visible: this.currentUser.tile_handicap_y_n == 1,
      },
      {
        name: "NGF",
        visible: this.currentUser.tile_handicap_y_n == 1,
      },
      {
        name: "members",
        visible: this.currentUser.tile_members_y_n == 1,
      },
      {
        name: "profile",
        visible: this.currentUser.app_display_profile_tile == 1,
      },
      {
        name: "pos",
        visible:
          this.currentUser.tile_horeca_y_n &&
          this.settings.app_display_balance == 1,
      },
      {
        name: "shop",
        visible: this.currentUser.tile_shop_y_n == 1,
      },
      {
        name: "proCourse",
        visible: this.currentUser.tile_lessons_y_n == 1,
      },
      {
        name: "lessons",
        visible: this.currentUser.tile_lessons_y_n == 1,
      },
    ];
  },
  methods: {
    onMenu: function (name) {
      this.$router.push("/" + name);
      this.drawer = false;
    },
  },
});
</script>
