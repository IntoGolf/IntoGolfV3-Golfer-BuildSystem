<template>
  <div class="row q-mb-md">
    <div class="col-md-3 col-xs-6 q-pr-md">
      <q-input v-model="localDate" label="Datum" size="sm" type="date" />
    </div>
    <div class="col-md-6 col-xs-6 q-pr-md">
      <q-select
        v-model="localLessonType"
        :options="typeArray"
        label="Lessoort"
        option-label="pltName"
        option-value="pltNr"
        size="sm"
        toggle-color="primary"
      />
    </div>
    <div class="col-md-3 col-xs-6 q-pr-md">
      <q-select
        v-model="per"
        :options="perArray"
        label="Periode"
        size="sm"
        toggle-color="primary"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    date: String,
  },
  data: function () {
    return {
      localDate: this.date,
      localLessonType: null,
      typeArray: [],
      perArray: [
        { label: "Dag", value: 1 },
        { label: "Ochtend", value: 2 },
        { label: "Middag", value: 3 },
        { label: "Avond", value: 4 },
      ],
      per: { value: 1, label: "Dag" },
    };
  },
  watch: {
    date: function (newDate) {
      this.localDate = newDate;
    },
    localDate: function (newDate) {
      this.$emit("updateDate", newDate);
    },
    localLessonType: function (newLessonType) {
      this.$emit("updateLessonType", newLessonType);
    },
    per: function (newPer) {
      this.$emit("updatePer", newPer);
    },
  },
  created() {
    this.$http.get("public/lessonTypes").then((res) => {
      this.typeArray = res;
      this.localLessonType = this.typeArray[0];
    });
  },
};
</script>
