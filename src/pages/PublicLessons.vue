<template>
  <q-page-container>
    <q-page style="width: 640px; margin-left: auto; margin-right: auto">
      <q-card v-if="lesson === null" class="q-pa-md q-mt-sm q-mb-lg">
        <div class="col-md-4 offset-md-4 col-xs-12">
          <comp-header-filter :date="date" v-on:updateDate="updateDate" />

          <comp-filter
            :date="date"
            :lessonType="lessonType"
            v-on:updateDate="updateDate"
            v-on:updateLessonType="updateLessonType"
            v-on:updatePer="updatePer"
          />

          <comp-pros
            :lessonType="lessonType"
            :lessons="lessonArray"
            :per="per"
            v-on:handleBook="handleBook"
          />
        </div>
      </q-card>

      <q-card v-if="lesson !== null" class="q-pa-md q-mt-sm q-mb-lg">
        <comp-book
          :date="date"
          :lesson="lesson"
          v-on:handleBack="handleBack"
          v-on:handleClose="handleClose"
        />
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script>
import compFilter from "../components/PublicLesson/filter.vue";
import compPros from "../components/PublicLesson/Pros.vue";
import compHeaderFilter from "../components/PublicLesson/headerFilter.vue";
import compBook from "../components/PublicLesson/book.vue";

export default {
  components: { compPros, compFilter, compHeaderFilter, compBook },
  data: function () {
    return {
      date: null,
      lessonType: null,
      lessonArray: [],
      per: 1,
      step: 1,
      lesson: null,
    };
  },
  watch: {
    date: function () {
      this.handleLoad();
    },
    lessonType: function () {
      this.handleLoad();
    },
  },
  created() {
    this.date = this.$dayjs().format("YYYY-MM-DD");
  },
  methods: {
    handleLoad: function () {
      if (this.date === null || this.lessonType === null) {
        return;
      }
      this.$http
        .get(
          "public/lessons?date=" + this.date + "&pltNr=" + this.lessonType.pltNr
        )
        .then((res) => {
          this.lessonArray = res;
        });
    },
    updateDate: function (date) {
      this.date = date;
    },
    updateLessonType: function (lessonType) {
      this.lessonType = lessonType;
    },
    updatePer: function (per) {
      this.per = per;
    },
    handleBook: function (lesson) {
      this.lesson = lesson;
    },
    handleClose: function () {
      this.lesson = null;
    },
    handleBack: function () {
      this.lesson = null;
    },
  },
};
</script>
