<template>
  <q-page-container class="q-mt-md q-pa-md">
    <div v-show="!newLesson">
      <q-btn color="primary" label="Nieuwe les" v-on:click="newLesson = true" />
      <div
        v-for="(lesson, key) in clientLessonArray"
        :key="key"
        align="left"
        class="row full-width q-mt-md bg-orange q-pa-sm"
      >
        <div class="col-12">
          <div class="row">
            <div class="col-9">
              <b>{{ lesson.pro_lesson.pro_lesson_type.pltName }}</b>
            </div>
            <div class="col-3 text-right">
              <b>{{
                $filters.unixToDate(lesson.pro_lesson.lesDate, "ddd DD MMM")
              }}</b>
            </div>
          </div>
          <div class="row">
            <div class="col-9">
              <i>{{ lesson.pro_lesson.relation.full_name2 }}</i>
            </div>
            <div class="col-3 text-right">
              {{ $filters.minuteToTime(lesson.pro_lesson.lesTimeFrom) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-show="newLesson">
      <div class="row q-mt-md">
        <q-input
          ref="date"
          v-model="date"
          dense
          label="Datum"
          lazy-rules
          outlined
          type="date"
        />
      </div>
      <div class="row q-mt-md">
        <q-select
          v-model="pltNr"
          :options="lessonTypeArray"
          dense
          emit-value
          label="Soort les"
          map-options
          option-label="pltName"
          option-value="pltNr"
          outlined
        />
      </div>
      <div class="row q-mt-md">
        <q-select
          v-model="relNr"
          :options="proArray"
          dense
          emit-value
          label="Pro"
          map-options
          option-label="full_name2"
          option-value="relNr"
          outlined
        />
      </div>

      <q-separator class="q-mt-md" />

      <div
        v-for="(lesson, key) in lessonFilter"
        :key="key"
        align="left"
        class="full-width q-mt-md bg-orange q-pa-sm"
        v-on:click="handleBook(lesson)"
      >
        <div style="width: 100%">
          <div class="float-left" style="width: 80%">
            {{ proLessonType.pltName }}
          </div>
          <div class="float-right text-right" style="width: 20%">
            <b>{{ $filters.minuteToTime(lesson.pagTimeFrom) }}</b>
          </div>
        </div>
        <div style="width: 100%">
          <i>{{ pro.full_name2 }}</i>
        </div>
      </div>
    </div>
  </q-page-container>
</template>

<script>
export default {
  data: function () {
    return {
      date: null,
      relNr: null,
      pltNr: null,
      newLesson: false,
      currentUser: Object.assign(this.$ls.getItem("currentUser")),
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
    newLesson: function (value) {
      if (!value) {
        this.handleLoadClientLessons();
      }
    },
  },
  mounted() {
    this.handleLoadClientLessons();
    this.handleLoadLessonTypes();
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
    lessonFilter: function () {
      if (this.lessonArray === undefined) {
        return [];
      }
      return this.lessonArray.filter(
        (lesson) => lesson.pro.relNr === this.relNr
      );
    },
  },
  methods: {
    handleLoad: function () {
      this.$http
        .get("golfer/lessons?date=" + this.date + "&pltNr=" + this.pltNr)
        .then((res) => {
          this.lessonArray = res;
          this.relNr = this.proArray[0].relNr;
        });
    },
    handleLoadClientLessons: function () {
      this.$http.get("golfer/clientLessons").then((res) => {
        this.clientLessonArray = res;
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
            lesRelNrPro: this.relNr,
            lesPltNr: this.pltNr,
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
            this.newLesson = false;
          });
        });
    },
  },
};
</script>
