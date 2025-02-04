<template>
  <div>
    <div class="row q-pa-sm bg-green-1">
      <div class="col-4 text-bold">Datum:</div>
      <div class="col-8">
        {{ $dayjs(ProLesson.lesDate).format("dddd D MMMM") }}
      </div>
    </div>

    <div class="row q-pa-sm">
      <div class="col-4 text-bold">Tijd:</div>
      <div class="col-8">
        {{ $filters.minuteToTime(ProLesson.lesBlockedFrom) }}
      </div>
    </div>

    <div class="row q-pa-sm bg-green-1">
      <div class="col-4 text-bold">Les soort:</div>
      <div class="col-8">
        {{ ProLesson.pro_lesson_type.pltName }}
      </div>
    </div>

    <div class="row q-pa-sm">
      <div class="col-4 text-bold">Pro:</div>
      <div class="col-8">
        {{ ProLesson.pro.full_name2 }}
      </div>
    </div>

    <div v-if="ProLesson.fee" class="row q-pa-sm bg-green-1">
      <div class="col-4 text-bold">Tarief:</div>
      <div class="col-8">
        {{ fee }}
      </div>
    </div>

    <div v-if="step === 3">
      <div v-if="ProLesson.relation" class="row q-pa-sm">
        <div class="col-4 text-bold">Jouw gegevens:</div>
        <div class="col-8">
          {{ ProLesson.relation.relCallName }}
          {{ ProLesson.relation.relPrefix }} {{ ProLesson.relation.relName
          }}<br />
          {{ ProLesson.relation.relEmail }}<br />
          {{ ProLesson.relation.relMo }}
        </div>
      </div>

      <div v-for="(client, key) in ProLesson.ProLessonClient" :key="key">
        <div v-if="key > 0" class="row q-pa-sm">
          <div class="col-4 text-bold">Deelnemer {{ key + 1 }}:</div>
          <div class="col-8">
            {{ client.plcName }}<br />
            {{ client.plcEmail }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "publicLessonDetails",
  props: {
    ProLesson: Object,
    step: Number,
  },
  computed: {
    fee() {
      const aFee = this.ProLesson.fee;
      let personText = aFee.lfpSizeTo === 1 ? " persoon " : " personen ";
      let numberText = aFee.lfpSizeFrom;
      if (aFee.lfpSizeFrom !== aFee.lfpSizeTo) {
        numberText += " tot " + aFee.lfpSizeTo;
      }
      return numberText + personText + this.$filters.money(aFee.lfpPrice);
    },
  },
};
</script>
