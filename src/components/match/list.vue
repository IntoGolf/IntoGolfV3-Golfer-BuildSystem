<template>

  <q-page class="q-pa-md">

    <div class="row">
      <div class="col">
        <q-list class="full-width" separator>
          <q-item
            clickable
            class="full-width bg-white shadow-1 q-mb-sm"
            v-ripple
            v-for="(match, index) in list"
            v-on:click="handleOpenMatch(match)"
            v-bind:key="index"
          >
            <q-item-section>
              <q-item-label class="overflow-hidden">
                <i class="far fa-trophy-alt mr-2" />

                {{ match.name }}
              </q-item-label>

              <q-item-label caption>
                {{ getMatchDate(match) + " " + getMatchTime(match) }}
              </q-item-label>
            </q-item-section>

            <q-item-section avatar> > </q-item-section>
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
    };
  },
  created() {
    this.loadList();
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
      this.$http.get("golfer/match/all").then((res) => {
        this.list = res.data;
      });
    },

    handleOpenMatch: function (match) {
      this.$emit("handleOpenMatch", match);
    },
  },
};
</script>
