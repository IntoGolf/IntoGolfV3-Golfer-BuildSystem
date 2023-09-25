<template>
  <q-page>
    <q-card class="q-pa-sm">
      <div class="row q-mb-md">
        <div class="col">
          <q-input
            v-model="filter"
            clear-icon="close"
            clearable
            label="Zoek wedstrijd"
          />
        </div>
      </div>

      <div class="row q-mb-md">
        <div class="col">
          <q-btn-group spread>
            <q-btn
              :color="subFilter === 1 ? 'warning' : 'primary'"
              label="Ingeschreven"
              v-on:click="subFilter = 1"
            />
            <q-btn
              :color="subFilter === 2 ? 'warning' : 'primary'"
              label="Inschrijven"
              v-on:click="subFilter = 2"
            />
            <q-btn
              :color="subFilter === 0 ? 'warning' : 'primary'"
              label="Alles"
              v-on:click="subFilter = 0"
            />
          </q-btn-group>
        </div>
      </div>

      <div class="row" style="height: calc(100vh - 200px); overflow-y: scroll">
        <div class="col">
          <q-list class="full-width" separator>
            <q-item
              v-for="(match, index) in filterArray"
              v-bind:key="index"
              v-ripple
              class="full-width bg-white shadow-1 q-mb-sm"
              clickable
              v-on:click="handleOpenMatch(match)"
            >
              <q-item-section>
                <q-item-label class="overflow-hidden">
                  <i class="far fa-trophy-alt mr-2" />

                  {{
                    $filters.capitalizeFirstLetter(match.name) +
                    " " +
                    match.match_type.name +
                    " " +
                    (match.match_type.name !== "MatchPlay"
                      ? match.match_scoring_type.name
                      : "")
                  }}
                </q-item-label>

                <q-item-label caption>
                  <div style="float: left">
                    {{ getMatchDate(match) + " " + getMatchTime(match) }}
                  </div>
                  <div style="float: right">
                    <div
                      v-if="match.UitslagenGereed === 1"
                      style="float: right"
                    >
                      Uitslagen beschikbaar
                    </div>
                    <div
                      v-else-if="match.StartlijstGereed === 1"
                      style="float: right"
                    >
                      Startlijst gereed
                    </div>
                    <div
                      v-else-if="!getUserOnMatch(match) && getOpenForMe(match)"
                      style="float: right"
                    >
                      Inschrijven
                    </div>
                    <div
                      v-else-if="
                        !getOpenForMe(match) && getOpenForSubscription(match)
                      "
                      style="float: right"
                    >
                      Open voor anderen
                    </div>
                    <div v-else-if="getUserOnMatch(match)" style="float: right">
                      Ingeschreven
                    </div>
                  </div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import authMixin from "../../mixins/auth";

export default {
  mixins: [authMixin],
  data() {
    return {
      list: [],
      filter: "",
      subFilter: 0,
    };
  },
  created() {
    this.subFilter = this.currentUserPref.matchList.subFilter;
    this.loadList();
  },
  watch: {
    subFilter: function (newValue) {
      this.currentUserPref.matchList.subFilter = newValue;
      this.$ls.setItem(
        "currentUserPref",
        { ...this.currentUserPref },
        1000 * 60 * 60 * 24 * 7
      );
    },
  },
  computed: {
    filterArray: function () {
      let that = this;
      return this.list.filter(
        (item) =>
          (!that.filter ||
            (that.filter &&
              item.name.toLowerCase().includes(that.filter.toLowerCase()))) &&
          (that.subFilter === 0 ||
            (that.subFilter === 1 && that.getUserOnMatch(item)) ||
            (that.subFilter === 2 && that.getOpenForSubscription(item)))
      );
    },
  },
  methods: {
    getMatchDate(match) {
      let d = new Date(match.playingDate);
      return d.toLocaleDateString();
    },

    getMatchTime(match) {
      return match.startingTime.substr(0, 5);
    },

    getOpenForSubscription(match) {
      let compareDate = this.$dayjs();
      let startDate = this.$dayjs(match.StartDatumTGInschrijven);
      let endDate = this.$dayjs(match.subscriptionDeadline);
      return compareDate.isBetween(startDate, endDate);
    },

    getOpenForMe: function (match) {
      let compareDate = this.$dayjs();
      let startDate = this.$dayjs(match.StartDatumTGInschrijven);
      let endDate = this.$dayjs(match.subscriptionDeadline);
      if (!compareDate.isBetween(startDate, endDate)) {
        return false;
      }

      if (
        match.restrictionBySex !== 0 &&
        match.restrictionBySex !== parseInt(this.currentUser.relGender)
      ) {
        return false;
      }

      if (
        this.currentUser.age < match.Min_Age ||
        this.currentUser.relHandicap > match.Max_Age
      ) {
        return false;
      }

      if (
        this.currentUser.relGender === 1 &&
        (this.currentUser.relHandicap < match.handicapMaleMin ||
          this.currentUser.relHandicap > match.handicapMaleMax)
      ) {
        return false;
      }

      if (
        this.currentUser.relGender === 2 &&
        (this.currentUser.relHandicap < match.handicapFemaleMin ||
          this.currentUser.relHandicap > match.handicapFemaleMax)
      ) {
        return false;
      }

      return true;
    },

    getUserOnMatch(match) {
      let relNr = this.currentUser.relNr;
      let result = false;
      match.players.forEach(function (item) {
        if (item.relNr === relNr) {
          result = true;
        }
      });
      return result;
    },

    getShowScorecard(match) {
      let compareDate = this.$dayjs();
      let startDate = this.$dayjs(match.playingDate + " " + match.startingTime);
      return (
        compareDate > startDate &&
        compareDate < startDate.add(6, "hours") &&
        match.UitslagenGereed !== 1
      );
    },

    loadList() {
      this.$http.get("golfer/events").then((res) => {
        this.list = res;
      });
    },

    handleOpenMatch: function (match) {
      this.$emit("handleOpenMatch", match);
    },
  },
};
</script>
