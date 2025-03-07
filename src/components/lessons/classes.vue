<template>
  <q-page class="q-pa-sm">
    <q-btn
      class="q-ml-sm"
      color="primary"
      label="Lessen"
      size="small"
      to="lessons"
    />

    <q-separator class="q-mb-md q-mt-md"/>
    <div
      v-for="(item,key) in list"
      :key="key"
      class="row full-width q-mt-md q-pa-sm"
      style="border: 1px solid lightgrey; border-radius: 4px"
      v-on:click="handleBook(item)"
    >
      <div class="col-12">
        <div class="row">
          <div class="col-6">
            <b>{{ item.pcsName + ' ' + item.pro_lesson_type.pltName }}</b>
          </div>
          <div class="col-6 text-right">
            <b>{{ $filters.unixToDate(item.pcsDateFrom, "ddd D MMM") }}</b>
            {{ $filters.minuteToTime(item.pro_lessons[0].lesBlockedFrom) }} /
            {{ $filters.minuteToTime(item.pro_lessons[0].lesBlockedTo) }}
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <i>pro: {{ item.pro_lessons[0].pro.full_name }}</i>
          </div>
          <div class="col-6 text-right">
            v.a.{{ $filters.money(item.pro_lesson_fee.lfpPrice) }}
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "componentLessonClasses",
  data: function () {
    return {
      list: []
    };
  },
  async mounted() {
    await this.handleLoadWalkIn();
  },
  methods: {
    async handleLoadWalkIn() {
      this.list = await this.$http.get("public/courses");
      console.log(this.list);
    },
    handleBook: function (lesson) {
      this.$q
        .dialog({
          title: "Schrijf in op deze cursus",
          message: "Je schrijft nu in op deze cursus, wilt u doorgaan?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.onBooking(lesson);
        });
    },
    async onBooking(lesson) {
      let data = {
        lesNr: lesson.id,
      };
      await this.$http.post("golfer/joinLesson", data);
      this.$q.notify({
        type: "positive",
        message: "Uw les is geboekt",
      });
      this.$router.push({name: 'lessons'});
    },
  },
};
</script>
