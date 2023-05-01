<template>
  <q-page-container class="q-mt-md q-pa-md">
    <div v-show="!newLesson">
      <q-btn color="primary" label="Nieuwe les" v-on:click="newLesson = true" />

      <q-separator class="q-mt-md" />

      <div v-show="clientLessonArray.length === 0" class="text-center">
        <h5>Geen toekomstige lessen gevonden</h5>
      </div>

      <div
        v-for="(lesson, key) in clientLessonArray"
        :key="key"
        align="left"
        class="row full-width q-mt-md bg-orange q-pa-sm"
      >
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
              <i>{{ lesson.pro_lesson.relation.full_name2 }}</i>
            </div>
            <div class="col-6 text-right">
              <q-btn
                color="primary"
                size="xs"
                v-on:click="handleCancel(lesson.pro_lesson)"
                >Annuleer
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-show="newLesson">
      <div class="row q-mr-none q-pr-none justify-end">
        <q-btn
          class="q-pr-none"
          color="secondary"
          flat
          icon="arrow_back"
          v-on:click="newLesson = false"
          >Lessen
        </q-btn>
      </div>

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
        <div class="row">
          <div class="col-6">
            {{ proLessonType.pltName }}
          </div>
          <div class="col-6 text-right">
            <b>{{ $filters.minuteToTime(lesson.pagTimeFrom) }}</b>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <i>pro: {{ pro.full_name2 }}</i>
          </div>
          <div class="col-6 text-right">
            <i>max. {{ proLessonType.pltMaxPers }} pers.</i>
          </div>
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
      } else {
        this.handleLoad();
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
            this.handleLoadClientLessons();
          });
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
