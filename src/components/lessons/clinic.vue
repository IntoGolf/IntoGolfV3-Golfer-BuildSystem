<template>
  <q-card
    :key="key"
    bordered
    class="my-card"
    flat
    style="width: calc(100% - 40px); margin: 20px"
  >
    <q-img
      src="https://media.gettyimages.com/id/1543092241/nl/foto/north-berwick-scotland-calum-hill-of-scotland-takes-part-in-a-clinic-on-the-driving-range.jpg?s=612x612&w=0&k=20&c=edW5HI28ISoK8MhMqKXLFwZSvjeuGRAZ000i_FBOTW8="
      style="height: 175px"
    >
      <div class="absolute-top-right text-subtitle2 text-center">
        <div class="text-h5">€ 120</div>
      </div>
    </q-img>

    <q-card-section>
      <div class="text-overline text-orange-9">
        {{ $filters.unixToDate(clinic.lesDate, "ddd DD MMM") }}
        {{ $filters.minuteToTime(clinic.lesTimeFrom) }}
      </div>
      <div class="text-h5 q-mt-sm q-mb-xs">
        {{ clinic.pro_lesson_type.pltName }}
      </div>
      <div class="text-caption text-grey">pro: {{ clinic.pro.full_name }}</div>
    </q-card-section>

    <q-card-actions class="justify-end">
      <q-btn
        color="primary"
        flat
        label="Inschrijven"
        @click="$store.dispatch('ProCourse/setItem', item)"
      />

      <q-space />
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  props: {
    clinic: Object,
  },
  data: function () {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
