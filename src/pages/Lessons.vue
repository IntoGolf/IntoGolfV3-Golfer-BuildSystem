<template>
  <q-page-container>
    <q-page>
      <q-card class="q-pa-sm">
        <div v-show="!newLesson">
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
          />
        </div>

        <div v-show="newLesson">
          <comp-new v-on:handleCloseNew="handleCloseNew" />
        </div>
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script>
import authMixin from "../mixins/auth";
import compLesson from "../components/lessons/lesson.vue";
import compNew from "../components/lessons/new.vue";

export default {
  mixins: [authMixin],
  components: {
    compLesson,
    compNew,
  },
  data: function () {
    return {
      newLesson: false,
      clientLessonArray: [],
    };
  },
  watch: {
    newLesson: function (value) {
      if (!value) {
        this.handleLoadClientLessons();
      }
    },
  },
  mounted() {
    this.handleLoadClientLessons();
  },
  methods: {
    handleLoadClientLessons: function () {
      this.$http.get("golfer/clientLessons").then((res) => {
        this.clientLessonArray = res;
      });
    },
    handleCloseNew: function () {
      this.handleLoadClientLessons();
      this.newLesson = false;
    },
  },
};
</script>
