<template>
  <q-card bordered class="full-width q-pa-md q-mb-md  bg-blue-grey-1" flat>
    <div class="row text-h6">
      <div class="col">Lessen</div>
    </div>
    <q-separator class="q-mb-sm"/>
    <q-list v-if="lessonArray.length > 0" separator>
      <q-item
        v-for="(lesson, index) in lessonArray"
        v-show="index < 3"
        v-bind:key="index"
        v-ripple
        class="full-width q-pa-sm bg-blue-grey-2 q-mb-sm"
        clickable
        style="border-radius: 4px"
        v-on:click="handleOpenLesson(lesson)"
      >
        <q-item-section>
          <q-item-label class="itg-text-overflow">
            <i class="far fa-calendar-alt mr-2"/>
            {{ $filters.unixToDate(lesson.pro_lesson.lesDate, "ddd D MMM") }}
            -
            {{ $filters.minuteToTime(lesson.pro_lesson.lesTimeFrom) }}
          </q-item-label>

          <q-item-label caption class="text-bold">
            <i class="far fa-golf-club mr-2"/>
            {{ lesson.pro_lesson.pro_lesson_type.pltName }} {{ lesson.pro_lesson.relation.full_name2 }}
          </q-item-label>
        </q-item-section>
        <q-item-section avatar> ></q-item-section>
      </q-item>
    </q-list>
    <q-card-section v-else>
      er zijn geen gereserveerde lessen gevonden...
    </q-card-section>
    <q-separator class="q-mb-sm"/>
    <q-btn
      class="q-mt-md full-width"
      color="primary"
      label="boek een les"
      outline
      size="small"
      v-on:click="$router.replace({path: '/lessons'})"
    />
  </q-card>
</template>

<script>
export default {
  data() {
    return {
      lessonArray: [],
    };
  },
  async mounted() {
    this.lessonArray = await this.$http.get("golfer/clientLessons");
  },
  methods: {
    handleOpenLesson(lesson) {
      this.$router.push({name: 'lessons', params: {lesNr: lesson.pro_lesson.lesNr}});
    },
  }
};
</script>
