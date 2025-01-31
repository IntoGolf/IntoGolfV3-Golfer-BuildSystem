<template>
  <q-page class="q-pa-sm">
    <div v-if="!newLesson && !lesson">
      <q-btn
        color="primary"
        label="Nieuwe les"
        size="small"
        v-on:click="newLesson = true"
      />

      <q-separator class="q-mt-md" />

      <div v-show="clientLessonArray.length === 0" class="text-center">
        <h5>Geen toekomstige lessen gevonden</h5>
      </div>

      <comp-lesson
        v-for="(lesson, key) in clientLessonArray"
        :key="key"
        :lesson="lesson"
        v-on:handleLoadClientLessons="handleLoadClientLessons"
        v-on:onSelectLesson="onSelectLesson"
      />

      <comp-clinic
        v-for="(clinic, key) in clinicsArray"
        :key="key"
        :clinic="clinic"
        v-on:handleLoadClientLessons="handleLoadClientLessons"
      />
    </div>

    <lesson-details
      v-else-if="lesson"
      :lesson="lesson"
      v-on:onCloseLesson="onCloseLesson"
    />

    <div v-else>
      <comp-new v-on:handleCloseNew="handleCloseNew" />
    </div>
  </q-page>
</template>

<script>
import authMixin from "../mixins/auth";
import compLesson from "../components/lessons/lesson.vue";
import compClinic from "../components/lessons/clinic.vue";
import compNew from "../components/lessons/new.vue";
import LessonDetails from "components/lessons/lessonDetails.vue";

export default {
  mixins: [authMixin],
  components: {
    LessonDetails,
    compClinic,
    compLesson,
    compNew,
  },
  data: function () {
    return {
      newLesson: false,
      lesson: null,
      clientLessonArray: [],
      clinicsArray: [],
    };
  },
  watch: {
    newLesson: function (value) {
      if (!value) {
        this.handleLoadClientLessons();
      }
    },
  },
  created() {
    this.handleLoadClientLessons();
    this.handleLoadClinics();
  },
  methods: {
    async handleLoadClientLessons() {
      this.clientLessonArray = await this.$http.get("golfer/clientLessons");
    },
    async handleLoadClinics() {
      this.clinicsArray = []; //await this.$http.get("golfer/clinics");
    },
    handleCloseNew: function () {
      this.handleLoadClientLessons();
      this.newLesson = false;
    },
    onSelectLesson(lesson) {
      this.lesson = lesson;
    },
    onCloseLesson() {
      this.lesson = null;
      this.handleLoadClientLessons();
    },
  },
};
</script>
