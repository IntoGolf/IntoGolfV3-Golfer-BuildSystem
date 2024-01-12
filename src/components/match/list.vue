<template>
  <q-page class="q-pa-sm">
    <q-pull-to-refresh @refresh="refreshList">
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
              :color="
                $store.state.currentUser.matchFilter === 1
                  ? 'warning'
                  : 'primary'
              "
              label="Ingeschreven"
              v-on:click="$store.dispatch('currentUser/updateMatchFilter', 1)"
            />
            <q-btn
              :color="
                $store.state.currentUser.matchFilter === 2
                  ? 'warning'
                  : 'primary'
              "
              label="Inschrijven"
              v-on:click="$store.dispatch('currentUser/updateMatchFilter', 2)"
            />
            <q-btn
              :color="
                $store.state.currentUser.matchFilter === 0
                  ? 'warning'
                  : 'primary'
              "
              label="Alles"
              v-on:click="$store.dispatch('currentUser/updateMatchFilter', 0)"
            />
          </q-btn-group>
        </div>
      </div>

      <q-list separator>
        <q-item
          v-for="(match, index) in filterArray"
          v-bind:key="index"
          v-ripple
          class="w-100 bg-white border rounded shadow-1 q-mb-sm"
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
                <div v-if="match.UitslagenGereed === 1" style="float: right">
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
    </q-pull-to-refresh>
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
    };
  },
  created() {
    this.loadList();
  },
  computed: {
    filterArray: function () {
      let that = this;
      return this.list.filter(
        (item) =>
          (!that.filter ||
            (that.filter &&
              item.name.toLowerCase().includes(that.filter.toLowerCase()))) &&
          (that.$store.state.currentUser.matchFilter === 0 ||
            (that.$store.state.currentUser.matchFilter === 1 &&
              that.getUserOnMatch(item)) ||
            (that.$store.state.currentUser.matchFilter === 2 &&
              that.getOpenForSubscription(item)))
      );
    },
  },
  methods: {
    refreshList: function (done) {
      this.$http.get("golfer/events").then((res) => {
        this.list = res;
        done();
      });
    },
    getMatchDate(match) {
      return this.$dayjs(match.playingDate).format("ddd DD MMMM");
    },
    getMatchTime(match) {
      return match.startingTime.substr(0, 5);
    },
    getOpenForSubscription(match) {
      let compareDate = this.$dayjs();
      let startDate = this.$dayjs(match.StartDatumTGInschrijven);
      let endDate = this.$dayjs(match.subscriptionDeadline);

      return (
        compareDate.isBetween(startDate, endDate) &&
        match.InschrijvenInternet === 1 &&
        match.UitslagenGereed !== 1 &&
        match.StartlijstGereed !== 1
      );
    },
    getOpenForMe: function (match) {
      let compareDate = this.$dayjs();
      let startDate = this.$dayjs(match.StartDatumTGInschrijven);
      let endDate = this.$dayjs(match.subscriptionDeadline);
      if (
        !compareDate.isBetween(startDate, endDate) ||
        match.InschrijvenInternet === 0
      ) {
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
        this.currentUser.age > match.Max_Age
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
