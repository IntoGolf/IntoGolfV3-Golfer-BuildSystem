<template>
  <q-card
    v-for="(lesson, key) in lessonArray"
    :key="key"
    class="dashboard-card q-mb-md"
  >
    <q-card-section class="bg-amber-3 dashboard-card-title">
      Les
    </q-card-section>
    <q-card-section class="q-pa-sm">
      <div class="row q-pa-sm" style="background-color: #f2f2f2">
        <div class="col-4 text-bold">Datum:</div>
        <div class="col-8">
          {{ $filters.unixToDate(lesson.pro_lesson.lesDate, "dddd DD MMMM") }}
        </div>
      </div>
      <div class="row q-pa-sm">
        <div class="col-4 text-bold">Tijd:</div>
        <div class="col-8">
          {{ $filters.minuteToTime(lesson.pro_lesson.lesTimeFrom) }}
        </div>
      </div>
      <div class="row q-pa-sm" style="background-color: #f2f2f2">
        <div class="col-4 text-bold">Les:</div>
        <div class="col-8">{{ lesson.pro_lesson.pro_lesson_type.pltName }}</div>
      </div>
      <div class="row q-pa-sm">
        <div class="col-4 text-bold">Pro:</div>
        <div class="col-8">{{ lesson.pro_lesson.relation.full_name2 }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  data() {
    return {
      lessonArray: [],
    };
  },
  mounted() {
    this.$http.get("golfer/clientLessons").then((res) => {
      this.lessonArray = res;
    });
  },
};
</script>
