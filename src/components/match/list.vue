<template>

  <q-page class="q-pa-md">

    <div class="row q-mb-md">
      <div class="col">
        <q-input
            v-model="filter"
            label="Zoek wedstrijd"
            clearable
            clear-icon="close"/>
      </div>
    </div>

    <div class="row q-mb-md">
      <div class="col">

        <q-btn-group spread>
          <q-btn :color="subFilter == 1 ? 'warning' : 'secondary'" label="Ingeschreven" v-on:click="subFilter = 1" />
          <q-btn :color="subFilter == 2 ? 'warning' : 'secondary'" label="Inschrijven" v-on:click="subFilter = 2" />
          <q-btn :color="subFilter == 0 ? 'warning' : 'secondary'" label="Alles" v-on:click="subFilter = 0" />
        </q-btn-group>

      </div>
    </div>

    <div class="row" style="height: calc(100vh - 200px); overflow-y: scroll">
      <div class="col">
        <q-list class="full-width" separator>
          <q-item
              clickable
              class="full-width bg-white shadow-1 q-mb-sm"
              v-ripple
              v-for="(match, index) in filterArray"
              v-on:click="handleOpenMatch(match)"
              v-bind:key="index"
          >
            <q-item-section>
              <q-item-label class="overflow-hidden">
                <i class="far fa-trophy-alt mr-2"/>

                {{ match.name }}
              </q-item-label>

              <q-item-label caption>
                <div style="float: left">
                  {{ getMatchDate(match) + " " + getMatchTime(match) }}
                </div>
                <div style="float: right">
                  <div v-show="!getUserOnMatch(match) && getOpenForMe(match)" style="float: right">Inschrijven</div>
                  <div v-show="!getOpenForMe(match) && getOpenForSubscription(match)" style="float: right">Open voor anderen</div>
                  <div v-show="getUserOnMatch(match)" style="float: right">Ingeschreven</div>
                </div>
              </q-item-label>
            </q-item-section>

          </q-item>
        </q-list>
      </div>
    </div>

  </q-page>

</template>

<script>
export default {
  data() {
    return {
      list: [],
      filter: '',
      subFilter: 0,
      currentUserPref: Object,
      currentUser: Object.assign(this.$ls.getItem("currentUser")),
    };
  },
  created() {
    this.currentUserPref = {...this.$ls.getItem("currentUserPref").value};
    this.subFilter = this.currentUserPref.matchList.subFilter;
    this.loadList();
  },
  watch: {
    subFilter: function(newValue) {
      this.currentUserPref.matchList.subFilter = newValue;
      this.$ls.setItem('currentUserPref', {...this.currentUserPref}, 1000 * 60 * 60 * 24 * 7);
    }
  },
  computed: {
    filterArray: function () {
      let that = this;
      return this.list.filter(item =>
          (!that.filter || that.filter && item.name.toLowerCase().includes(that.filter.toLowerCase())) &&
          (that.subFilter == 0 || (that.subFilter == 1 && that.getUserOnMatch(item)) || (that.subFilter == 2 && that.getOpenForSubscription(item)))
      );
    }
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
          match.restrictionBySex != 0 &&
          match.restrictionBySex != this.currentUser.relGender
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
          this.currentUser.relHandicap < match.handicapFemaleMin ||
          this.currentUser.relHandicap > match.handicapFemaleMax
      ) {
        return false;
      }

      return true;
    },

    getUserOnMatch(match) {
      let relNr = this.currentUser.relNr;
      let result = false;
      match.players.forEach(function (item) {
        if (item.relNr == relNr) {
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
          match.UitslagenGereed != 1
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
