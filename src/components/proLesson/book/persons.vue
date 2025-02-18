<template>
  <div>
    <q-separator class="q-mb-md q-mt-md"/>
    <div class="text-h6">Les deelnemers</div>
    <public-lesson-person
      v-for="(person, key) in proLesson.ProLessonClient"
      :key="key"
      :person="person"
    />
  </div>
</template>

<script>
import PublicLessonPerson from "components/proLesson/book/person.vue";

export default {
  name: "publicLessonPersons",
  props: {
    proLesson: Object,
  },
  components: {PublicLessonPerson},
  methods: {},
};
</script>
