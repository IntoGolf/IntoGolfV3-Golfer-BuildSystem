<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md">
      <div v-if="form === null">
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
          Geen lessen gevonden voor vandaag<br/>
          kies een andere datum
        </div>
      </div>


      <public-lesson-client-book
        v-else
        :form="form"/>

    </q-card>
  </q-page>
</template>

<script>
import compFilter from "../components/proLesson/filter.vue";
import compPros from "../components/proLesson/Pros.vue";
import PublicLessonClientBook from "components/proLessonClient/book.vue";

export default {
  components: {PublicLessonClientBook, compPros, compFilter},
  data: function () {
    return {
      date: null,
      lessonType: null,
      lessonArray: [],
      per: {value: 1, label: "Dag"},
      step: 1,
      form: null,
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
    this.date = this.$dayjs().format("DD-MM-YYYY");
  },
  computed: {
    hasLessons() {
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
      console.log(this.date);
      this.form = {
        id: null,
        type: {
          id: lesson.pro_lesson_type.pltNr,
          name: lesson.pro_lesson_type.pltName,
          category: lesson.pro_lesson_type.pltLtcNr,
          minPerson: lesson.pro_lesson_type.pltMinPers,
          maxPerson: lesson.pro_lesson_type.pltMaxPers
        },
        date: this.date,
        timeStart: this.$filters.minuteToTime(lesson.pagTimeFrom),
        timeEnd: this.$filters.minuteToTime(lesson.pagTimeTo),
        size: 0,
        agreeConditions: false,
        agreeCommerce: false,
        payMethod: "onCourse",
        clients: [],
        pro: {
          proNr: lesson.pro.relNr,
          name: lesson.pro.full_name2
        },
        fee: {
          lsfNr: null,
          lsfName: "",
          lsfCardYN: 0,
          lfpNr: null,
          lfpPrice: "",
          lfpItmNr: null,
          lfpSizeFrom: 0,
          lfpSizeTo: 999,
          plcNr: null
        },
        pro_lesson_fee_les: lesson.pro_lesson_fee_les
      }
    },
    handleClose: function () {
      this.form = null;
    },
    handleBack: function () {
      this.form = null;
    },
  },
};
</script>
