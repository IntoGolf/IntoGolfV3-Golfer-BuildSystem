<template>
  <div>
    <div class="row q-pa-sm bg-green-1">
      <div class="col-4 text-bold">Datum:</div>
      <div class="col-8">
        {{ form.date }}
      </div>
    </div>

    <div class="row q-pa-sm">
      <div class="col-4 text-bold">Tijd:</div>
      <div class="col-8">
        {{ form.timeStart }}
      </div>
    </div>

    <div class="row q-pa-sm bg-green-1">
      <div class="col-4 text-bold">Les soort:</div>
      <div class="col-8">
        {{ form.type.name }}
      </div>
    </div>

    <div class="row q-pa-sm">
      <div class="col-4 text-bold">Pro:</div>
      <div class="col-8">
        {{ form.pro.name }}
      </div>
    </div>

    <div v-if="form.fee" class="row q-pa-sm bg-green-1">
      <div class="col-4 text-bold">Tarief:</div>
      <div class="col-8">
        {{ $filters.money(form.fee.lfpPrice) }}
      </div>
    </div>

    <div v-if="step === 3">
      <div v-for="(client, key) in form.clients" :key="key" class="row q-pa-sm">
        <div class="col-4 text-bold">{{ getLabel(key) }}:</div>
        <div class="col-8">
          {{ client.firstName }}
          {{ client.prefix }} {{
            client.lastName
          }}<br/>
          {{ client.email }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "publicLessonClientDetails",
  props: {
    form: Object,
    step: Number,
  },
  computed: {
    fee() {
      const aFee = this.form.fee;
      let personText = aFee.lfpSizeTo === 1 ? " persoon " : " personen ";
      let numberText = aFee.lfpSizeFrom;
      if (aFee.lfpSizeFrom !== aFee.lfpSizeTo) {
        numberText += " tot " + aFee.lfpSizeTo;
      }
      return numberText + personText + this.$filters.money(aFee.lfpPrice);
    },
  },
  methods: {
    getLabel(key) {
      if (key === 0) {
        return "Jouw gegevens";
      }
      return "Deelnemer " + (key + 1);
    },
  }
};
</script>
