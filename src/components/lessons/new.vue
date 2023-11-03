<template>
  <div>
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
          :options="lessonType1Array"
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

    <q-separator class="q-mt-md" />

    <div class="row">
      <div class="col hide-scrollbar" style="overflow-x: scroll">
        <div :style="{ width: colWidth }" class="row q-gutter-sm">
          <div v-for="(pro, key) in proArray" :key="key" class="col q-mb-lg">
            <div class="row">
              <div class="col q-pt-sm text-bold text-center">
                <b>{{ pro.full_name2 }}</b>
              </div>
            </div>
            <div class="row hide-scrollbar">
              <comp-lesson
                :lessons="lessonArray"
                :pro="pro"
                :proLessonType="proLessonType"
                v-on:handleBook="handleBook"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import compLesson from "./newProLessons.vue";

export default {
  components: {
    compLesson,
  },
  data: function () {
    return {
      date: null,
      relNr: null,
      pltNr: null,
      lessonArray: [],
      lessonTypeArray: [],
      clientLessonArray: [],
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
  mounted() {
    this.handleLoadLessonTypes();
  },
  computed: {
    lessonType1Array: function () {
      return this.lessonTypeArray.filter((item) => item.pltLtcNr == 1);
    },
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
    handleLoad: function () {
      this.$http
        .get("golfer/lessons?date=" + this.date + "&pltNr=" + this.pltNr)
        .then((res) => {
          this.lessonArray = res;
          if (this.proArray.length > 0) {
            this.relNr = this.proArray[0].relNr;
          }
        });
    },
    handleLoadLessonTypes: function () {
      this.$http.get("golfer/lessonTypes").then((res) => {
        this.lessonTypeArray = res;
        this.pltNr = this.lessonTypeArray[0].pltNr;
        this.date = this.$dayjs().format("YYYY-MM-DD");
      });
    },
    handleBook: function (lesson) {
      this.$q
        .dialog({
          title: "Boek een les",
          message: "Uw boekt nu een les, wilt u doorgaan?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          let data = {
            lesNr: null,
            lesRelNrPro: lesson.pro.relNr,
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
          this.$http.post("golfer/lesson", data).then(() => {
            this.$q.notify({
              type: "positive",
              message: "Uw les is geboekt",
            });
            this.$emit("handleCloseNew");
          });
        });
    },
  },
};
</script>
