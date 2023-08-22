<template>
  <div>
    <div class="row">
      <div class="col q-pt-sm text-bold text-center">
        <b>{{ pro.full_name2 }}</b>
      </div>
    </div>
    <div class="row hide-scrollbar" style="overflow-y: scroll">
      <comp-lessons
        :lessonType="lessonType"
        :lessons="lessons"
        :per="per"
        :pro="pro"
        v-on:handleBook="handleBook"
      />
    </div>
  </div>
</template>

<script>
import compLessons from "./Lessons.vue";

export default {
  components: { compLessons },
  props: {
    pro: Object,
    lessons: Array,
    per: Object,
    lessonType: Object,
  },
  methods: {
    handleBook: function (lesson) {
      this.$emit("handleBook", lesson);
    },
  },
};
</script>
