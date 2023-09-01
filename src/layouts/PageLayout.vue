<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-header class="web-width q-header" flat>
        <q-toolbar>
          <q-btn
            v-if="!$q.platform.is.desktop"
            :style="{ color: settings.app_primary_font_color }"
            dense
            flat
            icon="menu"
            round
            @click="drawer = !drawer"
          />

          <q-btn
            v-if="$q.platform.is.desktop"
            :style="{ color: settings.app_primary_font_color }"
            dense
            flat
            icon="menu"
            round
            @click="$router.push('/')"
          />

          <q-toolbar-title
            :style="{ color: settings.app_primary_font_color }"
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
      <router-view class="q-background web-width q-pl-md q-pr-md q-mt-sm" />
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
      >
        <!--        <q-img-->
        <!--          src="/logoInternational.png"-->
        <!--          style="margin-left: auto; margin-right: auto"-->
        <!--          width="60%"-->
        <!--        />-->
      </div>
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
    headerColor() {
      return this.settings.app_primary_color;
    },
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
        visible: this.settings.app_display_message_tile == 1,
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
      if (name === "Dashboard") {
        name = "";
      }
      this.$router.push("/" + name);
      this.drawer = false;
    },
  },
});
</script>
