<template>
  <div style="height: 100vh">
    <div v-if="ProCourseArray.length === 0" class="row">
      <div class="col text-h6 q-mt-xl">
        Er zijn momenteel geen cursussen beschikbaar.
      </div>
    </div>
    <div v-else class="row">
      <div class="col">
        <q-card
          v-for="(item, key) in ProCourseArray"
          :key="key"
          class="full-width shadow-1 q-pa-md q-mb-md"
        >
          <pro-course-details :item="item"/>
          <q-separator class="q-mt-md q-mb-md"/>
          <div class="row">
            <div class="col text-right">
              <q-btn
                color="primary"
                label="Inschrijven"
                v-on:click="onOpenCourse(item)"
              />
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import ProCourseDetails from "components/proCourses/details.vue";

export default {
  name: "proCourseList",
  components: {ProCourseDetails},
  data() {
    return {
      ProCourseArray: [],
    };
  },
  async created() {
    await this.getClasses();
  },
  methods: {
    async getClasses() {
      this.ProCourseArray = await this.$http.get("public/courses");
    },
    onOpenCourse(item) {
      this.$emit("onOpenCourse", item);
    },
  },
};
</script>
