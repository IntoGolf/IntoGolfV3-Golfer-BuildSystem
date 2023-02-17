<template>

  <q-page-container>

    <q-page class="q-pa-md">

      <div
          v-if="page == 1">

        <handicap-menu
            v-on:handleNew="handleNew"
        />

        <handicap-list
            :handicapList="handicapList"
            v-on:handleOpen="handleOpen"
        />

      </div>

      <handicap-score
          v-else-if="page == 2"
          :scorecard="scorecard"
          :currentUser="currentUser"
          :courseArray="courseArray"
          :teeArray="teeArray"
          v-on:handleSave="handleSave"
          v-on:handleClose="handleClose"
      />

      <handicap-new-domestic
          v-else-if="page == 3 && type==1"
          :type="type"
          :artificialDate="artificialDate"
          :scorecard="scorecard"
          :currentUser="currentUser"
          :courseArray="courseArray"
          :teeArray="teeArray"
          :handicap="handicap"
          v-on:handleSave="handleSave"
          v-on:handleClose="handleClose"
      />

      <handicap-new-foreign
          v-else-if="page == 3 && type==2"
          :type="type"
          :artificialDate="artificialDate"
          :scorecard="scorecard"
          :currentUser="currentUser"
          :countryArray="countryArray"
          v-on:handleSave="handleSave"
          v-on:handleClose="handleClose"
      />

    </q-page>

  </q-page-container>

</template>

<script>

import HandicapMenu from "../components/handicap/menu";
import HandicapList from "../components/handicap/list";
import HandicapNewDomestic from "../components/handicap/newDomestic";
import HandicapNewForeign from "../components/handicap/newForeign";
import HandicapScore from "../components/handicap/score";

export default {
  components: {
    HandicapMenu,
    HandicapList,
    HandicapNewDomestic,
    HandicapNewForeign,
    HandicapScore,
  },
  data() {
    return {
      page: 1,
      type: 1,
      scorecard: Object,
      scorecard_template: {
        ngf_card_id: '',
        datetime: '',
        remarks: '',
        club: 2,
        course: 2,
        loop: {id: 1, label: "9 Holes"},
        tee: this.defaultTee,
        marker: '',
        format_of_play: 1,
        is_competition: 0,
        is_qualifying: 1,
        course_country_code: "NL",
        player: {
          gsn: '',
          club: 0
        },
        holes: [
          {
            number: 1,
            strokes: 0,
            is_computed: false,
          }
        ],
        course_name: '',
        loop_name: '',
        tee_name: '',
        courserate: '',
        sloperate: '',
        total_par: '',
        stableford: '',
      },
      handicapList: [],
      currentUser: Object.assign(this.$ls.getItem("currentUser")),
      courseArray: [],
      teeArray: [],
      countryArray: [],
    };
  },
  created: function () {
    console.log('go');
    this.handleLoadScorecard();
    this.handleLoadCourses();
    this.handleLoadCountries();
    // if (this.$route.query.action != undefined) {
    //   let scorecard = this.$ls.getItem("scorecard").value;
    //   this.scorecard = {...scorecard};
    //   this.scorecard.type = 1;
    //   this.page = 2;
    // }
  },
  computed: {
    defaultTee: function () {
      if (this.currentUser.relGender == 2) {
        return this.teeList.find(tee => tee.Category == 15)
      } else {
        return this.teeList.filter(tee => tee.Category == 9)
      }
    },
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
    handicap: function () {
      return 54;
      if (!this.handicapList) {
        return 54;
      }
      return this.handicapList[0].handicap_index;
    }
  },
  methods: {
    handleOpen: function (scorecard) {
      if (scorecard.details.is_penalty_score) {
        return;
      }
      this.scorecard = scorecard.details;
      this.scorecard.handicap = scorecard.handicap_index;
      this.scorecard.type = 1;
      this.page = 2;
    },
    handleSave: function (scorecard, open) {
      this.$http.post("golfer/scorecard", scorecard).then((res) => {
        if (open) {
          this.handleLoadScorecard(res.response.scorecard.ngf_card_id);
        } else {
          this.handleLoadScorecard()
        }
      });
    },
    handleNew: function (type) {
      this.scorecard = {...this.scorecard_template};
      this.scorecard.type = type;
      this.scorecard.datetime = this.$dayjs().format('YYYY-MM-DD hh:mm');
      this.scorecard.player.gsn = this.currentUser.relGsn;
      this.scorecard.player.club = this.currentUser.relHomeCourse;
      this.type = type;
      this.page = 3;
    },
    handleClose: function (reload) {
      if (reload) {
        this.handleLoadScorecard();
      }
      this.page = 1;
    },
    handleLoadScorecard: function (ngf_card_id) {
      this.$http.get("golfer/scorecards").then((res) => {
        if (ngf_card_id) {
          let scorecard = res.find(card => card.ngf_card_id == ngf_card_id);
          this.handleOpen(scorecard);
        } else {
          this.handicapList = res;
        }
      });
    },
    handleLoadCountries() {
      this.$http.get("golfer/countries").then((res) => {
        this.countryArray = res;
      });
    },
    handleLoadCourses() {
      this.$http.get("golfer/courses").then((res) => {
        this.courseArray = res;
        this.teeArray = [];
      });
    },
  },
};
</script>
