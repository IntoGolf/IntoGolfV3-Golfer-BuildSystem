<template>
  <div
    v-for="(lesson, key) in lessonFilter"
    :key="key"
    class="full-width text-left"
    v-on:click="$emit('handleBook', lesson)"
  >
    <lesson :lesson="lesson"/>
  </div>
</template>

<script>
import Lesson from "./Lesson.vue";

export default {
  components: {Lesson},
  props: {
    pro: Object,
    lessons: Array,
    per: Object,
    lessonType: Object,
  },
  emits: ["handleBook"],
  computed: {
    from: function () {
      let result = 240;
      if (this.per.value === 3) {
        result = 720;
      } else if (this.per.value === 4) {
        result = 1080;
      }
      return result;
    },
    to: function () {
      let result = 1439;
      if (this.per.value === 2) {
        result = 720;
      } else if (this.per.value === 3) {
        result = 1080;
      }
      return result;
    },
    lessonFilter: function () {
      if (this.lessons === undefined) {
        return [];
      }
      let result = this.lessons.filter(
        (lesson) => lesson.pro.relNr === this.pro.relNr
      );

      result = Object.values(result).filter((t) => {
        return (
          t.pagTimeFrom >= this.from &&
          t.pagTimeFrom +
          t.pro_lesson_type.pltDuration +
          t.pro_lesson_type.pltBefore +
          t.pro_lesson_type.pltAfter <=
          this.to
        );
      });

      return result;
    },
  },
};
</script>
