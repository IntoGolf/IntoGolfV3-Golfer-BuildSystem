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
      v-for="(item,key) in walkInArray"
      :key="key"
      class="row full-width q-mt-md q-pa-sm"
      style="border: 1px solid lightgrey; border-radius: 4px"
      v-on:click="handleBook(item)"
    >
      <div class="col-12">
        <div class="row">
          <div class="col-6">
            <b>{{ item.type.name }}</b>
          </div>
          <div class="col-6 text-right">
            <b>{{ item.date }}</b>
            {{ item.timeStart }} / {{ item.timeEnd }}
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <i>pro: {{ item.pro.name }}</i>
          </div>
          <div class="col-6 text-right"></div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "componentLessonWalkin",
  data: function () {
    return {
      walkInArray: []
    };
  },
  async mounted() {
    await this.handleLoadWalkIn();
  },
  methods: {
    async handleLoadWalkIn() {
      this.walkInArray = await this.$http.get("public/walkins");
    },
    handleBook: function (lesson) {
      this.$q
        .dialog({
          title: "Boek deze inlooples",
          message: "Uw boekt nu deze les, wilt u doorgaan?",
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
