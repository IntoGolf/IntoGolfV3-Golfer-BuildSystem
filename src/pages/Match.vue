<template>

  <q-page-container>

    <match-list
      v-if="match == null"
      :currentUser="currentUser"
      v-on:handleOpenMatch="handleOpenMatch"/>

    <match-details
      v-if="match != null"
      :prop_match="match"
      :prop_page="page"
      :currentUser="currentUser"
      v-on:handleCloseMatch="handleCloseMatch"/>

  </q-page-container>
</template>

<script>

import matchList from "../components/match/list";
import matchDetails from "../components/match/details";

export default {
  components: {
    matchList,
    matchDetails,
  },
  data() {
    return {
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
      this.match = match;
    },
    handleCloseMatch: function () {
      this.match = null;
    },
  },
};
</script>
