<template>
  <div>
    <div
      v-for="(lesson, key) in lessonFilter"
      :key="key"
      align="left"
      class="full-width q-mt-md bg-orange q-pa-sm"
      v-on:click="$emit('handleBook', lesson)"
    >
      <div class="row">
        <div class="col">
          <div class="row">
            <div class="col">
              <b>{{ $filters.minuteToTime(lesson.pagTimeFrom) }}</b>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <i>max. {{ proLessonType.pltMaxPers }} pers.</i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pro: Object,
    lessons: Array,
    proLessonType: Object,
  },
  computed: {
    lessonFilter: function () {
      if (this.lessons === undefined) {
        return [];
      }
      return this.lessons.filter(
        (lesson) => lesson.pro.relNr === this.pro.relNr
      );
    },
  },
  methods: {},
};
</script>
