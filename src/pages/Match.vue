<template>
  <q-page-container>
    <match-list v-if="match === null" v-on:handleOpenMatch="handleOpenMatch" />

    <match-details
      v-if="match !== null"
      :prop_match="match"
      :prop_page="page"
      v-on:handleCloseMatch="handleCloseMatch"
    />
  </q-page-container>
</template>

<script>
import matchList from "../components/match/list";
import matchDetails from "../components/match/details";
import authMixin from "../mixins/auth";

export default {
  mixins: [authMixin],
  components: {
    matchList,
    matchDetails,
  },
  data() {
    return {
      page: 1,
      match: null,
    };
  },
  beforeMount: function () {
    if (this.$route.query.id !== undefined) {
      let that = this;
      this.$http.get(`golfer/event/` + this.$route.query.id).then((res) => {
        that.match = res;
        that.page = 5;
      });
    }
  },
  methods: {
    handleOpenMatch: function (match) {
      let that = this;
      this.$http.get(`golfer/event/` + match.id).then((res) => {
        that.match = res;
      });
    },
    handleCloseMatch: function () {
      this.match = null;
    },
  },
};
</script>
