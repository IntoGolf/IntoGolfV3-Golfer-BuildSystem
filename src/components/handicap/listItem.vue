<template>
  <q-item
    v-ripple
    :style="{ borderBottom: index === 19 ? '2px solid #409eff' : '' }"
    class="w-100 bg-white border rounded shadow-1 q-mb-sm"
    clickable
    @click="$emit('handleOpen', card)"
  >
    <q-item-section avatar>
      <div v-if="card.is_qualifying" class="itg-text-qualifying">Q</div>

      <div v-else class="itg-text-non-qualifying">-</div>
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-truncate">
        {{ card.details.course_name }}
      </q-item-label>

      <q-item-label caption>
        {{ $dayjs(card.datetime).format("ddd D MMM YYYY HH:mm") }}
      </q-item-label>
    </q-item-section>

    <q-item-section avatar>
      <q-item-label class="text-truncate">
        {{
          card.handicap_index !== null ? card.handicap_index.toFixed(1) : "-"
        }}
      </q-item-label>

      <q-item-label caption>
        {{ subtext }}
      </q-item-label>
    </q-item-section>
  </q-item>
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
  props: {
    card: Object,
    index: Number,
  },
  computed: {
    subtext: function () {
      if (this.card.is_penalty_score) {
        return " penalty score";
      } else if (this.card.inBest) {
        return " in beste 8";
      }
      return " buiten beste 8";
    },
  },
};
</script>
