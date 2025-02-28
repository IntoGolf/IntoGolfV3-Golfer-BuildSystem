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
  computed: {
    pcsNrParam() {
      return this.$route.query.id;
    }
  },
  async mounted() {
    this.handleOpenId()
  },
  methods: {
    async handleOpenId() {
      if (!(this.pcsNrParam > 0)) {
        return
      }
      const list = await this.$http.get("public/courses");
      this.course = list.find((item) => item.pcsNr = this.pcsNrParam);
      if (this.course) {
        this.onOpenCourse(this.course);
      }
    },
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
        date: this.$filters.unixToDate(item.pcsDateFrom),
        timeStart: this.$filters.minuteToTime(item.pro_lessons[0].lesBlockedFrom),
        timeEnd: item.pro_lessons[0].lesBlockedTo,
        size: 0,
        agreeConditions: false,
        agreeCommerce: false,
        payMethod: "onCourse",
        clients: [{
          firstName: "",
          prefix: "",
          lastName: "",
          phone: "",
          email: "",
          handicap: ""
        }],
        pro: {
          proNr: item.pro_lessons[0].pro.relNr,
          name: item.pro_lessons[0].pro.full_name
        },
        fee: {
          lsfNr: item.pro_lesson_fee.lsfNr,
          lfpItmNr: item.pro_lesson_fee.lfpItmNr,
          lfpPrice: item.pro_lesson_fee.lfpPrice,
        },
        pro_lesson_fee: item.pro_lesson_fee
      }
    },
  },
};
</script>
