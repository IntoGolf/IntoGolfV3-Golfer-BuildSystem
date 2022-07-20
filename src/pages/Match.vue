<template>

  <q-page-container>

<!--    <top-bar-->
<!--      v-bind:title="title"-->
<!--      v-bind:back_icon="back_icon"-->
<!--      v-bind:back_link="back_link"-->
<!--      v-bind:callBack="callBack"-->
<!--      v-on:handleCloseMatch="handleCloseMatch"-->
<!--    />-->

    <match-list
      v-if="match == null"
      :currentUser="currentUser"
      v-on:handleOpenMatch="handleOpenMatch"
    />

    <match-details
      v-if="match != null"
      :prop_match="match"
      :prop_page="page"
      :currentUser="currentUser"
      v-on:handleCloseMatch="handleCloseMatch"
    />
  </q-page-container>
</template>

<script>
// import TopBar from "../components/TopBar";
import matchList from "../components/match/list";
import matchDetails from "../components/match/details";

export default {
  components: {
    matchList,
    matchDetails,
  },
  data() {
    return {
      back_icon: "fa-home",
      back_link: "/",
      title: "Wedstrijden",
      callBack: undefined,

      page: 1,
      match: null,
      currentUser: Object.assign(this.$ls.getItem("currentUser")),
    };
  },
  beforeMount: function () {
    if (this.$route.query.id != undefined) {
      let that = this;
      this.$http
        .get(`golfer/match/detail/` + this.$route.query.id)
        .then((res) => {
          that.match = res.data;
          that.page = 5;
        });
    }
  },
  methods: {
    handleOpenMatch: function (match) {
      this.back_icon = "fa-arrow-left";
      this.back_link = "/match";
      this.title = "Wedstrijd";
      this.callBack = function () {
        this.$emit("handleCloseMatch");
      };

      this.match = match;
    },
    handleCloseMatch: function () {
      this.back_icon = "fa-home";
      this.back_link = "/";
      this.title = "Wedstrijden";
      this.callBack = undefined;

      this.match = null;
    },
  },
};
</script>
