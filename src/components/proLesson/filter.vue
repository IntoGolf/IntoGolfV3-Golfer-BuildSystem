<template>
  <div class="row q-mb-md">
    <div class="col-6 q-pr-md">

      <q-input v-model="localDate" label="Datum" mask="##-##-####">
        <template v-slot:append>
          <q-icon class="cursor-pointer" name="event">
            <q-popup-proxy ref="qDateProxy" cover transition-hide="scale" transition-show="scale">
              <q-date v-model="localDate" locale="nl" mask="DD-MM-YYYY"
                      @update:model-value="onDateSelect">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup color="primary" flat label="Close"/>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="col-6 q-mt-md">
      <q-btn-group flat outline spread>
        <q-btn label="dag -" v-on:click="setDay(-1)"/>
        <q-btn label="dag +" v-on:click="setDay(1)"/>
      </q-btn-group>
    </div>
    <div class="col-6 q-pr-md">
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
    <div class="col-6 q-pr-md">
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
        {label: "Dag", value: 1},
        {label: "Ochtend", value: 2},
        {label: "Middag", value: 3},
        {label: "Avond", value: 4},
      ],
      per: {value: 1, label: "Dag"},
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
  methods: {
    setDay: function (value) {
      this.localDate = this.$dayjs(this.localDate, 'DD-MM-YYYY')
        .add(value, "days")
        .format("DD-MM-YYYY");
      this.$emit("updateDate", this.localDate);
    },
    onDateSelect() {
      this.$refs.qDateProxy.hide(); // Automatisch sluiten
    }
  },
  created() {
    this.$http.get("public/lessonTypes").then((res) => {
      this.typeArray = res;
      this.localLessonType = this.typeArray[0];
    });
  },
};
</script>
