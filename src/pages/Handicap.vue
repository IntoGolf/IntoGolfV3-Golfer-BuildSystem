<template>

  <q-page-container>

<!--    <top-bar-->
<!--      v-bind:title="title"-->
<!--      v-bind:back_icon="back_icon"-->
<!--      v-bind:back_link="back_link"-->
<!--      v-bind:callBack="callBack"-->
<!--      v-on:handleCloseScorecard="handleCloseScorecard"-->
<!--    />-->

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

      back_icon: "fa-home",
      back_link: "/",
      title: "Handicap",
      callBack: undefined,

      handicapList: false,
    };
  },
  created: function () {
    if (this.$route.query.action != undefined) {
      let scorecard = this.$ls.getItem("scorecard");
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

      this.back_link = "/handicap";
      this.back_icon = "fa-arrow-left";
      this.callBack = function () {
        this.$emit("handleCloseScorecard", false);
      };

      this.scorecard = scorecard.details;
      // this.type = type;
      this.scorecard.type = 1;
      this.page = 2;
    },

    handleSaveScorecard: function (scorecard) {
      this.scorecard = scorecard;
      this.page = 2;
    },

    handleNewScorecard: function (type) {
      this.back_link = "/handicap";
      this.back_icon = "fa-arrow-left";
      this.callBack = function () {
        this.$emit("handleCloseScorecard", false);
      };

      this.type = type;
      this.page = 3;
    },

    handleCloseScorecard: function (reload) {
      this.back_link = "/";
      this.back_icon = "fa-home";
      this.callBack = undefined;

      this.handicapList = false;

      let that = this;
      if (reload) {
        this.$http.get("golfer/handicap/all").then((res) => {
          that.handicapList = res.data;
        });
      }
      this.page = 1;
    },
  },
};
</script>
