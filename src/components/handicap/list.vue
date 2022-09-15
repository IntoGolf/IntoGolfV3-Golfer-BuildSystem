<template>

  <q-page class="q-pa-md">
    <div class="row">
      <div class="col">
        <q-btn-group spread class="q-mb-md">
          <q-btn
            v-show="!cardInMemory"
            color="secondary"
            label="Binnenland"
            icon="add"
            @click="handleNewScorecard(1)"
          />
          <q-btn
            v-show="!cardInMemory"
            color="secondary"
            label="Buitenland"
            icon="add"
            @click="handleNewScorecard(2)"
          />
          <q-btn
            v-show="cardInMemory"
            color="secondary"
            label="Doorgaan met gepauzeerde kaart"
            icon="add"
            @click="handlePauzedScorecard()"
          />
        </q-btn-group>
      </div>
    </div>

    <q-list v-if="handicapList.length > 0" separator>
      <q-item
        clickable
        class="w-100 bg-white border rounded shadow-1 mb-2"
        v-ripple
        v-for="(card, index) in handicapList"
        v-bind:key="index"
        @click="handleOpenScorecard(card)"
      >
        <q-item-section avatar>
          <div v-if="card.is_qualifying" class="itg-text-qualifying">Q</div>
          <div v-else class="itg-text-non-qualifying">-</div>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-truncate">{{
            card.details.course_name
          }}</q-item-label>
          <q-item-label caption>{{ subtext(card.details) }}</q-item-label>
        </q-item-section>

        <q-item-section avatar>
          {{ card.handicap_index.toFixed(1) }}
        </q-item-section>
      </q-item>
    </q-list>

    <main
        v-if="!handicapList"
        class="text-h6 text-center">
      Uw handicapoverzicht wordt opgehaald bij de NGF
    </main>

    <q-banner
        v-else-if="handicapList.length == 0"
        class="bg-orange-3 text-grey-8 text-bold text-center">
      U heeft nog geen scorekaarten
    </q-banner>
  </q-page>
</template>

<style lang="scss" scoped>
.itg-q-item {
  background-color: white;
}

.page-handicap-list {
  .border-top-none {
    border-top: none !important;
  }

  .table-summary {
    tr:first-child {
      th,
      td {
        border-top: none !important;
      }
    }
  }
}

.itg-text-qualifying {
  color: #00d97e;
  text-align: center;
}

.itg-text-non-qualifying {
  color: orange;
  text-align: center;
}
</style>

<script>
export default {
  props: ["handicapList"],
  data() {
    return {};
  },
  computed: {
    cardInMemory: function () {
      return this.$ls.getItem('scorecard').value  != null;
    },
  },
  methods: {
    subtext: function (card) {
      let text = '';
      // this.$options.filters.date(card.datetime, "DD-MM-YYYY HH:mm");
      if (card.is_penalty_score) {
        text += " penalty score";
      } else if (card.inBest) {
        text += " in beste 8";
      } else if (!card.inBest) {
        text += " buiten beste 8";
      }
      return text;
    },
    handlePauzedScorecard: function () {
      let scorecard = this.$ls.getItem("scorecard").value;
      let card = { details: { ...scorecard } };
      this.$emit("handleOpenScorecard", card);
    },
    handleOpenScorecard: function (card) {
      this.$emit("handleOpenScorecard", card);
    },
    handleNewScorecard: function (type) {
      this.$emit("handleNewScorecard", type);
    },
  },
};
</script>
