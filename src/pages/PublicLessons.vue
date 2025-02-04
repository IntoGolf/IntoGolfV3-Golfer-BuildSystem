<template>
  <q-page class="q-pa-md">
    <div v-if="lesson === null">
      <comp-filter
        :date="date"
        :lessonType="lessonType"
        v-on:updateDate="updateDate"
        v-on:updateLessonType="updateLessonType"
        v-on:updatePer="updatePer"
      />

      <comp-pros
        v-if="hasLessons"
        :lessonType="lessonType"
        :lessons="lessonArray"
        :per="per"
        v-on:handleBook="handleBook"
      />

      <div v-else class="text-h5 q-mt-xl q-mb-lg text-center">
        Geen lessen gevonden voor vandaag<br />
        kies een andere datum
      </div>
    </div>

    <comp-book
      v-else
      :date="date"
      :lesson="lesson"
      v-on:handleBack="handleBack"
      v-on:handleClose="handleClose"
    />
  </q-page>
</template>

<script>
import compFilter from "../components/PublicLesson/filter.vue";
import compPros from "../components/PublicLesson/Pros.vue";
import compBook from "../components/PublicLesson/book.vue";

export default {
  components: { compPros, compFilter, compBook },
  data: function () {
    return {
      date: null,
      lessonType: null,
      lessonArray: [],
      per: { value: 1, label: "Dag" },
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
    console.log("open public lessons");
    this.date = this.$dayjs().format("YYYY-MM-DD");
  },
  computed: {
    hasLessons() {
      console.log(this.lessonArray);
      return this.lessonArray.length > 0;
    },
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
