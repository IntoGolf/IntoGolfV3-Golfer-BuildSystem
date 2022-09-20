<template>

  <q-page-container>

    <handicap-list
      v-if="page == 1"
      :handicapList="handicapList"
      v-on:handleOpenScorecard="handleOpenScorecard"
      v-on:handleNewScorecard="handleNewScorecard"
    />

    <handicap-score
      v-else-if="page == 2"
      :scorecard="scorecard"
      v-on:handleNewScorecard="handleSaveScorecard"
      v-on:handleCloseScorecard="handleCloseScorecard"
    />

    <handicap-new
      v-else-if="page == 3"
      :type="type"
      :artificialDate="artificialDate"
      v-on:handleNewScorecard="handleSaveScorecard"
      v-on:handleCloseScorecard="handleCloseScorecard"
    />
  </q-page-container>
</template>

<script>
import TopBar from "../components/TopBar";
import HandicapList from "../components/handicap/list";
import HandicapNew from "../components/handicap/new";
import HandicapScore from "../components/handicap/score";

export default {
  components: {
    HandicapList,
    HandicapNew,
    HandicapScore,
  },
  data() {
    return {
      page: 0,
      type: 1,

      scorecard: Object,
      handicapList: false,
    };
  },
  created: function () {
    if (this.$route.query.action != undefined) {
      let scorecard = this.$ls.getItem("scorecard").value;
      this.scorecard = { ...scorecard };
      this.scorecard.type = 1;
      this.page = 2;
    } else {
      this.handleCloseScorecard(true);
    }
  },
  computed: {
    artificialDate: function () {
      let result = "1900-01-01T12:00:00Z";
      if (!this.handicapList) {
        return result;
      }
      this.handicapList.forEach(function (card) {
        if (card.details.course_name == "artificiële kaart") {
          result = card.datetime;
        }
      });
      return result;
    },
  },
  methods: {
    handleOpenScorecard: function (scorecard) {
      if (scorecard.details.is_penalty_score) {
        return;
      }
      this.scorecard = scorecard.details;
      this.scorecard.type = 1;
      this.page = 2;
    },

    handleSaveScorecard: function (scorecard) {
      this.scorecard = scorecard;
      this.page = 2;
    },

    handleNewScorecard: function (type) {
      this.type = type;
      this.page = 3;
    },

    handleCloseScorecard: function (reload) {
      this.handicapList = false;
      let that = this;
      if (reload) {
        this.$http.get("golfer/scorecards").then((res) => {
          that.handicapList = res.data;
        });
      }
      this.page = 1;
    },
  },
};
</script>
