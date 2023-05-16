<template>
  <div class="row full-width q-mt-md bg-orange q-pa-sm">
    <div class="col-12">
      <div class="row">
        <div class="col-6">
          <b>{{ proClientCourse.ProCourse.pcsName }}</b>
        </div>
        <div class="col-6 text-right">
          <b>{{
            $filters.unixToDate(
              proClientCourse.ProCourse.pcsDateFrom,
              "ddd DD MMM"
            )
          }}</b>
          {{ proClientCourse.ProCourse.time }}
        </div>
      </div>
      <div class="row">
        <div class="col">
          <i>pro: {{ proClientCourse.ProLessons[0].Relation.full_name2 }}</i>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <i
            >tel: {{ proClientCourse.ProLessons[0].Relation.relPhoneMobile }}</i
          >
        </div>
      </div>
      <div class="row">
        <div class="col">
          <i>e-mail: {{ proClientCourse.ProLessons[0].Relation.relEmail }}</i>
        </div>
      </div>
      <q-separator />
      <div class="row">
        <div class="col text-bold">Lessen</div>
      </div>
      <div
        v-for="(les, key) in proClientCourse.ProLessons"
        :key="key"
        class="row"
      >
        <div class="col">
          {{ $filters.unixToDate(les.lesDate, "ddd DD MMM") }}
          {{ $filters.minuteToTime(les.lesTimeFrom) }} -
          {{ $filters.minuteToTime(les.lesTimeTo) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    proClientCourse: Object,
  },
  methods: {
    handleSubscribe: function () {},
  },
};
</script>
