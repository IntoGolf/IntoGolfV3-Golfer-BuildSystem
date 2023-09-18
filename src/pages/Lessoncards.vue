<template>
  <q-page-container>
    <q-page>
      <div v-for="card in list" :key="card.id" class="q-mb-md">
        <q-card class="lesson-card">
          <q-card-section class="card-header">
            <div class="text-h6">{{ card.lsfName }}</div>
          </q-card-section>

          <q-card-section class="q-pa-sm">
            <div class="row">
              <div class="col-4 text-bold">Geldig:</div>
              <div class="col-8">
                {{ card.plcDateFrom }} / {{ card.plcDateTo }}
              </div>
            </div>
            <div class="row">
              <div class="col-4 text-bold">Aantal lessen:</div>
              <div class="col-8">{{ card.lsfRounds }}</div>
            </div>
            <div class="row">
              <div class="col-4 text-bold">Verbruik:</div>
              <div class="col-8">{{ card.plcUsage }}</div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section
            v-for="(lesson, key) in card.lessons"
            :key="key"
            :class="{ 'odd-row': key % 2 === 0, 'even-row': key % 2 !== 0 }"
            class="q-pa-sm"
          >
            <div class="row">
              <div class="col">
                <div class="row">
                  <div class="col text-bold">
                    {{ lesson.date + " " + lesson.time }}
                  </div>
                  <div class="col text-right text-bold">{{ lesson.name }}</div>
                </div>
                <div class="row">
                  <div class="col">Pro: {{ lesson.pro }}</div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-page>
  </q-page-container>
</template>

<style scoped>
.lesson-card {
  border-radius: 4px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* To ensure child elements adhere to card's border radius */
  background: linear-gradient(
    145deg,
    #f0f7fd,
    #e3efff
  ); /* Subtle gradient background */
}

.card-header {
  background-color: #33698c; /* Blue background */
  color: white; /* Text color set to white for better contrast */
  padding: 8px 12px;
  border-bottom: 1px solid #0056b3; /* Darker blue for border */
}

.card-info {
  padding: 16px 24px;
}

.usage-section {
  background-color: #eef5fc; /* Lighter blue shade for the usage section */
  padding: 16px 24px;
}

.odd-row {
  background-color: #f4f4ef; /* A light grey background for odd rows */
}

.even-row {
  background-color: #ffffff; /* A white background for even rows, this can be omitted if the default background color is already white */
}
</style>

<script>
import authMixin from "../mixins/auth";

export default {
  mixins: [authMixin],
  data: function () {
    return {
      list: [],
    };
  },
  mounted() {
    this.handleLoad();
  },
  methods: {
    handleLoad: function () {
      this.$http.get("golfer/lessonCards").then((res) => {
        this.list = res.data;
      });
    },
  },
};
</script>
