<template>
  <div class="row full-width q-mt-md bg-orange q-pa-sm">
    <div class="col-12">
      <div class="row">
        <div class="col-6">
          <b>{{ lesson.pro_lesson.pro_lesson_type.pltName }}</b>
        </div>
        <div class="col-6 text-right">
          <b>{{
            $filters.unixToDate(lesson.pro_lesson.lesDate, "ddd DD MMM")
          }}</b>
          {{ $filters.minuteToTime(lesson.pro_lesson.lesTimeFrom) }}
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <i>pro: {{ lesson.pro_lesson.relation.full_name2 }}</i>
        </div>
        <div class="col-6 text-right">
          <q-btn
            color="secondary"
            size="xs"
            v-on:click="handleCancel(lesson.pro_lesson)"
            >Annuleer
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lesson: Object,
  },
  data: function () {
    return {};
  },
  methods: {
    handleCancel: function (lesson) {
      this.$q
        .dialog({
          title: "Annuleer les",
          message: "Deze les wordt geannuleerd, wilt u doorgaan?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          lesson.lesCarNr = 1;
          this.$http.post("golfer/lesson", lesson).then(() => {
            this.$q.notify({
              type: "positive",
              message: "uw les is geannuleerd",
            });
            this.newLesson = false;
            this.$emit("handleLoadClientLessons");
          });
        });
    },
  },
};
</script>
