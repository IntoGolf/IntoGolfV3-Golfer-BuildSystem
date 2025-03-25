<template>
  <div>
    <div class="row q-mt-sm">
      <div class="col-6">
        <h5 class="q-mt-none q-mb-none">Reserveer een les</h5>
      </div>
      <div class="col-6 text-right">
        <q-btn
          color="primary"
          flat
          icon="arrow_back"
          v-on:click="$emit('handleCloseNew')"
        >Sluiten
        </q-btn>
      </div>
    </div>
    <div class="row q-mt-md q-gutter-sm">
      <div class="col">
        <q-input
          ref="date"
          v-model="date"
          dense
          label="Datum"
          lazy-rules
          type="date"
        />
      </div>
      <div class="col">
        <q-select
          v-model="pltNr"
          :options="lessonTypeArray"
          behavior="menu"
          dense
          emit-value
          label="Soort les"
          map-options
          option-label="pltName"
          option-value="pltNr"
        />
      </div>
    </div>

    <q-separator class="q-mt-md"/>

    <component-lesson-pros
      :lessonType="proLessonType"
      :lessons="lessonArray"
      :per="per"
      v-on:handleBook="handleBook"/>

  </div>
</template>

<script>
import ComponentLessonPros from "components/proLesson/Pros.vue";

export default {
  components: {
    ComponentLessonPros,
  },
  data: function () {
    return {
      date: this.$dayjs().format("YYYY-MM-DD"),
      relNr: null,
      pltNr: null,
      lessonArray: [],
      lessonTypeArray: [],
      clientLessonArray: [],
      per: {value: 1, label: "Dag"},
    };
  },
  watch: {
    date: function () {
      this.handleLoad();
    },
    pltNr: function () {
      this.handleLoad();
    },
  },
  async created() {
    await this.handleLoadLessonTypes();
  },
  computed: {
    pro: function () {
      return this.proArray.find((pro) => pro.relNr === this.relNr);
    },
    proLessonType: function () {
      return this.lessonTypeArray.find((lesson) => lesson.pltNr === this.pltNr);
    },
    proArray: function () {
      if (this.lessonArray === undefined) {
        return [];
      }
      let helper = [];
      return this.lessonArray.reduce((acc, obj) => {
        if (!helper.includes(obj.pro.relNr)) {
          helper.push(obj.pro.relNr);
          acc.push(obj.pro);
        }
        return acc;
      }, []);
    },
    colWidth: function () {
      return this.proArray.length * 120 + "px";
    },
  },
  methods: {
    async handleLoad() {
      this.lessonArray = await this.$http
        .get("golfer/lessons?date=" + this.date + "&pltNr=" + this.pltNr);
      if (this.proArray.length > 0) {
        this.relNr = this.proArray[0].relNr;
      }
    },
    async handleLoadLessonTypes() {
      this.lessonTypeArray = await this.$http.get("golfer/lessonTypes");
      this.pltNr = this.lessonTypeArray[0].pltNr;
    },
    handleBook: function (lesson) {
      const time = this.$filters.minuteToTime(lesson.pagTimeFrom);
      const date = this.$dayjs(this.date).format('ddd DD MMM');
      const type = lesson.pro_lesson_type.pltName;
      const message = "Je boekt nu een " + type +
        " op " + date +
        " om " + time + " , wil je doorgaan?"
      this.$q
        .dialog({
          title: type,
          message: message,
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.onBooking(lesson);
        });
    },
    async onBooking(lesson) {
      let data = {
        lesNr: null,
        lesRelNrPro: lesson.proNr,
        lesProNr: lesson.proNr,
        lesPltNr: lesson.pro_lesson_type.pltNr,
        lesDate: this.$filters.dateToUnix(this.date, "YYYY-MM-DD"),
        lesTimeFrom: lesson.pagTimeFrom,
        lesTimeTo:
          lesson.pagTimeFrom +
          this.proLessonType.pltBefore +
          this.proLessonType.pltAfter +
          this.proLessonType.pltDuration,
        lesBlockedFrom: lesson.pagTimeFrom,
        lesBlockedTo:
          lesson.pagTimeFrom +
          this.proLessonType.pltBefore +
          this.proLessonType.pltAfter +
          this.proLessonType.pltDuration,
        lesCarNr: 0,
      };
      await this.$http.post("golfer/lesson", data);
      this.$q.notify({
        type: "positive",
        message: "Uw les is geboekt",
      });
      this.$emit("handleCloseNew");
    },
  },
};
</script>
