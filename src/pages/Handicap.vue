<template>
  <q-page class="q-pa-sm">
    <div v-if="page === 1">
      <handicap-menu v-on:handleNew="handleNew" />

      <q-pull-to-refresh @refresh="refreshScoreCards">
        <handicap-list
          :handicapList="scorecards"
          v-on:handleOpen="handleOpen"
        />
      </q-pull-to-refresh>
    </div>

    <handicap-score
      v-else-if="page === 2"
      :courseArray="courseArray"
      :scorecard="scorecard"
      :teeArray="teeArray"
      v-on:handleClose="handleClose"
      v-on:handleSave="handleSave"
    />

    <handicap-new-domestic
      v-else-if="page === 3 && type === 1"
      :artificialDate="artificialDate"
      :courseArray="courseArray"
      :handicap="handicap"
      :scorecard="scorecard"
      :teeArray="teeArray"
      :type="type"
      v-on:handleClose="handleClose"
      v-on:handleSave="handleSave"
    />

    <handicap-new-foreign
      v-else-if="page === 3 && type === 2"
      :artificialDate="artificialDate"
      :countryArray="countries"
      :scorecard="scorecard"
      :type="type"
      v-on:handleClose="handleClose"
      v-on:handleSave="handleSave"
    />
  </q-page>
</template>

<script>
import HandicapMenu from "../components/handicap/menu";
import HandicapList from "../components/handicap/list";
import HandicapNewDomestic from "../components/handicap/newDomestic";
import HandicapNewForeign from "../components/handicap/newForeign";
import HandicapScore from "../components/handicap/score";

import authMixin from "../mixins/auth";
import { mapActions, mapGetters } from "vuex";

export default {
  mixins: [authMixin],
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
        ngf_card_id: "",
        datetime: "",
        remarks: "",
        club: 2,
        course: 2,
        loop: { id: 1, label: "9 Holes" },
        tee: this.defaultTee,
        marker: "",
        format_of_play: 1,
        is_competition: 0,
        is_qualifying: 1,
        course_country_code: "NL",
        player: {
          gsn: "",
          club: 0,
        },
        holes: [
          {
            number: 1,
            strokes: 0,
            is_computed: false,
          },
        ],
        course_name: "",
        loop_name: "",
        tee_name: "",
        courserate: "",
        sloperate: "",
        total_par: "",
        stableford: "",
      },
      handicapList: [],
      courseArray: [],
      teeArray: [],
    };
  },
  mounted() {
    this.fetchScorecards();
    this.fetchCountries();
    this.fetchSettings();
  },
  watch: {
    settings: function () {
      this.scorecard_template.club = parseInt(this.settings.system_ngf_code);
    },
  },
  computed: {
    ...mapGetters("scorecards", ["scorecards"]),
    ...mapGetters("countries", ["countries"]),
    defaultTee: function () {
      if (this.currentUser.relGender === 2) {
        return this.teeList.find((tee) => tee.Category === 15);
      } else {
        return this.teeList.filter((tee) => tee.Category === 9);
      }
    },
    artificialDate: function () {
      let result = "1900-01-01T12:00:00Z";
      if (!this.scorecards) {
        return result;
      }
      this.scorecards.forEach(function (card) {
        if (card.details.course_name === "artificiële kaart") {
          result = card.datetime;
        }
      });
      return result;
    },
    handicap: function () {
      if (!this.scorecards || this.scorecards.length === 0) {
        return 54;
      }
      return this.scorecards[0].handicap_index;
    },
  },
  methods: {
    ...mapActions("scorecards", ["fetchScorecards"]),
    ...mapActions("countries", ["fetchCountries"]),
    ...mapActions("settings", ["fetchSettings"]),
    refreshScoreCards: function (done) {
      this.fetchScorecards().then(() => {
        done();
      });
    },
    async handleOpen(card) {
      let res = await this.$http.get("golfer/scorecard?id=" + card.ngf_card_id);
      if (res.data.is_penalty_score) {
        return;
      }
      this.scorecard = res.data;
      this.scorecard.handicap = card.handicap_index;
      this.scorecard.type = 1;
      this.page = 2;
    },
    async handleSave(scorecard) {
      let that = this;
      let res = await this.$http.post("golfer/scorecard", scorecard);
      if (res.response.error.length > 0) {
        res.response.error.forEach((item) => {
          this.$q.notify({
            message: item.message,
            type: "negative",
            icon: "announcement",
            position: "center",
            timeout: 1000,
            actions: [
              {
                label: "Sluiten",
                color: "white",
                handler: () => {
                  /* ... */
                },
              },
            ],
          });
        });
      } else {
        this.$q.notify({
          message: "Scorekaart opgeslagen",
          type: "positive",
          icon: "announcement",
          position: "center",
          timeout: 2000,
          actions: [
            {
              label: "Sluiten",
              color: "white",
              handler: () => {
                that.handleOpen({
                  ngf_card_id: res.response.scorecard.ngf_card_id,
                });
              },
            },
          ],
        });
      }
    },
    handleNew: function (type) {
      this.scorecard = { ...this.scorecard_template };
      this.scorecard.type = type;
      this.scorecard.datetime = this.$dayjs().format("YYYY-MM-DD HH:mm");
      this.scorecard.player.gsn = this.currentUser.relGsn;
      this.scorecard.player.club = this.currentUser.relHomeCourse;
      this.type = type;
      this.page = 3;
    },
    handleClose: function (reload) {
      if (reload) {
        this.fetchScorecards();
      }
      this.page = 1;
    },
  },
};
</script>
