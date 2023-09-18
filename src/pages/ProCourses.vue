\
<template>
  <q-page-container>
    <q-page>
      <q-card class="q-pa-sm">
        <div class="text-h6">Uw cursussen:</div>
        <q-separator />
        <div
          v-show="clientCourseArray.length === 0"
          class="q-mt-md text-subtitle1"
        >
          U bent niet ingeschreven op een cursus
        </div>
        <comp-pro-client-course
          v-for="(proClientCourse, key) in clientCourseArray"
          :key="key"
          :proClientCourse="proClientCourse"
        />

        <div class="q-mt-md text-h6">Cursusagenda:</div>
        <q-separator />
        <div v-show="courseArrayFilter.length === 0">
          Er zijn geen cursussen beschikbaar
        </div>
        <comp-pro-course
          v-for="(proCourse, key) in courseArrayFilter"
          :key="key"
          :proCourse="proCourse"
          v-on:handleRefresh="handleRefresh"
        />
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script>
import authMixin from "../mixins/auth";
import compProClientCourse from "../components/proCourses/proClientCourse.vue";
import compProCourse from "../components/proCourses/proCourse.vue";

export default {
  mixins: [authMixin],
  components: {
    compProCourse,
    compProClientCourse,
  },
  data: function () {
    return {
      courseArray: [],
      clientCourseArray: [],
      ProCourseClient: null,
    };
  },
  watch: {},
  mounted() {
    this.handleRefresh();
  },
  computed: {
    courseArrayFilter: function () {
      return this.courseArray.filter(
        (course) =>
          this.clientCourseArray.findIndex(
            (clientCourse) => clientCourse.plcPcsNr == course.pcsNr
          ) == -1
      );
    },
  },
  methods: {
    handleRefresh: function () {
      this.handleLoadCourseArray();
      this.handleLoadClientCourseArray();
    },
    handleLoadCourseArray: function () {
      this.$http.get("golfer/pro_courses").then((res) => {
        this.courseArray = res.data;
      });
    },
    handleLoadClientCourseArray: function () {
      this.$http.get("golfer/pro_client_courses").then((res) => {
        this.clientCourseArray = res.data;
      });
    },
  },
};
</script>
