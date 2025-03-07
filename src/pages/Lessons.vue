<template>
  <q-page class="q-pa-sm">
    <div v-if="!newLesson && !lesson">
      <q-btn
        color="primary"
        label="Priveles"
        size="small"
        v-on:click="newLesson = true"
      />

      <q-btn
        v-show="walkinsArray.length > 0"
        class="q-ml-sm"
        color="primary"
        label="Inlooplessen"
        size="small"
        to="walkins"
      />

      <q-btn
        v-show="classesArray.length > 0"
        class="q-ml-sm"
        color="primary"
        label="Cursussen"
        size="small"
        to="relation_classes"
      />

      <q-separator class="q-mt-md q-mb-md"/>

      <div v-if="clientLessonArray.length === 0">
        <div class="text-bold text-h6">Geen geboekte privelessen</div>
      </div>
      <div v-else>
        <div class="text-bold text-h6">Jouw lessen</div>
        <span>Hieronder vindt je de door jouw geboekte lessen.</span>
      </div>


      <comp-lesson
        v-for="(lesson, key) in clientLessonArray"
        :key="key"
        :lesson="lesson"
        v-on:handleLoadClientLessons="handleLoadClientLessons"
        v-on:onSelectLesson="onSelectLesson"
      />

    </div>

    <lesson-details
      v-else-if="lesson"
      :lesson="lesson"
      v-on:onCloseLesson="onCloseLesson"
    />

    <div v-else>
      <comp-new v-on:handleCloseNew="handleCloseNew"/>
    </div>
  </q-page>
</template>

<script>
import authMixin from "../mixins/auth";
import compLesson from "../components/lessons/lesson.vue";
import compNew from "../components/lessons/new.vue";
import LessonDetails from "components/lessons/lessonDetails.vue";

export default {
  mixins: [authMixin],
  components: {
    LessonDetails,
    compLesson,
    compNew,
  },
  data: function () {
    return {
      newLesson: false,
      lesson: null,
      clientLessonArray: [],
      clinicsArray: [],
      classesArray: [],
      walkinsArray: [],
    };
  },
  watch: {
    newLesson: function (value) {
      if (!value) {
        this.handleLoadClientLessons();
      }
    },
  },
  methods: {
    async handleLoadClientLessons() {
      this.clientLessonArray = await this.$http.get("golfer/clientLessons");
      if (this.$route.params.lesNr > 0) {
        this.lesson = this.clientLessonArray.find((les) => les.pro_lesson.lesNr == this.$route.params.lesNr)
      }
    },
    async handleLoadClasses() {
      let res = await this.$http.get("public/courses");
      console.log(res);
      this.classesArray = res;
    },
    async handleLoadWalkins() {
      this.walkinsArray = await this.$http.get("public/walkins");
      console.log(this.walkinsArray);
    },
    handleCloseNew: function () {
      this.handleLoadClientLessons();
      this.newLesson = false;
    },
    onSelectLesson(lesson) {
      this.lesson = lesson;
    },
    async onCloseLesson() {
      this.lesson = null;
      await this.handleLoadClientLessons();
      this.$router.push({name: 'lessons'});
    },
  },
  async mounted() {
    await this.handleLoadClientLessons();
    await this.handleLoadClasses();
    await this.handleLoadWalkins();
  }
};
</script>
