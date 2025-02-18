<template>
  <div class="q-pa-md overflow-auto" style="height: 100vh">
    <pro-course-list v-if="form === null" v-on:onOpenCourse="onOpenCourse"/>
    <q-card
      v-else
      class="full-width shadow-1 q-pa-md"
    >
      <public-lesson-client-book :form="form"/>
    </q-card>
  </div>
</template>

<script>
import ProCourseList from "components/proCourses/list.vue";
import PublicLessonClientBook from "components/proLessonClient/book.vue";

export default {
  components: {PublicLessonClientBook, ProCourseList},
  data() {
    return {
      form: null,
    };
  },
  methods: {
    onOpenCourse(item) {
      this.form = {
        id: item.pcsNr,
        type: {
          id: item.pro_lesson_type.pltNr,
          name: item.pro_lesson_type.pltName,
          category: 3,
          minPerson: item.pro_lesson_type.pltMinPers,
          maxPerson: item.pro_lesson_type.pltMaxPers
        },
        date: item.pcsDateFrom,
        timeStart: item.pro_lessons[0].lesBlockedFrom,
        timeEnd: item.pro_lessons[0].lesBlockedTo,
        size: 0,
        agreeConditions: false,
        agreeCommerce: false,
        payMethod: "onCourse",
        clients: [{
          firstName: "test",
          prefix: "test",
          lastName: "test",
          phone: "0172617000",
          email: "test@intogolf.nl",
          handicap: "10"
        }],
        pro: {
          proNr: item.pro_lessons[0].pro.relNr,
          name: item.pro_lessons[0].pro.full_name
        },
        fee: {
          pcfNr: item.pro_lesson_type.pro_course_fees[0].pcfNr,
          pcfGrpNr: item.pro_lesson_type.pro_course_fees[0].pcfGrpNr,
          lfpItmNr: item.pro_lesson_type.pro_course_fees[0].pcfPltNr,
          lfpPrice: item.pro_lesson_type.pro_course_fees[0].pcfPrice,
        },
        pro_lesson_fee_les: item.pro_lesson_type.pro_course_fees
      }
    },
  },
};
</script>
