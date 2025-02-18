<template>
  <div>
    <div class="row">
      <div class="col text-h5">
        {{ $filters.capitalizeFirstLetter(item.pcsName) }}
      </div>
    </div>
    <q-separator class="q-mt-md q-mb-md"/>
    <div class="row">
      <div class="col-4">Eerste les</div>
      <div class="col-8">
        :
        {{ $filters.unixToDate(item.pcsDateFrom, "dddd D MMMM") }}
      </div>
    </div>
    <div class="row">
      <div class="col-4">Tijd</div>
      <div class="col-8">
        :
        {{ timeFrom }}
        tot
        {{ timeTo }}
      </div>
    </div>
    <div class="row">
      <div class="col-4">Aantal lessen</div>
      <div class="col-8">: {{ item.pro_lessons.length }}</div>
    </div>
    <div class="row">
      <div class="col-4">Lessen datums</div>
      <div class="col-8">: {{ lessonsText }}</div>
    </div>
    <div class="row">
      <div class="col-4">Beschikbare plaatsen</div>
      <div class="col-8">
        :
        {{ item.available_spots }}
      </div>
    </div>
    <div class="row">
      <div class="col-4">Kosten</div>
      <div class="col-8">: {{ price }}</div>
    </div>
    <div class="row">
      <div class="col">
        {{ item.pro_lesson_type.pltNotes }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "proCourseDetails",
  props: {
    item: Object,
  },
  computed: {
    firstLesson() {
      return this.item.pro_lessons[0];
    },
    timeFrom() {
      if (this.firstLesson === undefined) {
        return "onbekend";
      }
      return this.$filters.minuteToTime(this.firstLesson.lesBlockedFrom);
    },
    timeTo() {
      if (this.firstLesson === undefined) {
        return "onbekend";
      }
      return this.$filters.minuteToTime(this.firstLesson.lesBlockedTo);
    },
    lessonsText() {
      let result = "";
      for (let i = 0; i < this.item.pro_lessons.length; i++) {
        result +=
          (i > 0 ? ", " : "") +
          this.$filters.unixToDate(this.item.pro_lessons[i].lesDate, "D/M");
      }
      return result;
    },
    price() {
      const fee = this.item.pro_lesson_type.pro_course_fees[0];
      if (fee === undefined) {
        return "onbekend";
      }
      return this.$filters.money(fee.pcfPrice);
    },
  },
};
</script>
