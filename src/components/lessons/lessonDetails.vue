<template>
  <q-page class="q-pa-sm">
    <q-card bordered class="q-pa-sm q-mt-md" flat>
      <div class="row q-pb-sm q-pt-sm">
        <div class="col"><h5 class="q-mt-sm q-mb-sm">Lesinformatie</h5></div>
      </div>
      <q-separator />
      <div class="row q-pb-sm q-pt-sm">
        <div class="col text-bold">Datum</div>
        <div class="col overflow-hidden text-right">
          {{ $dayjs(date, "DD-MM-YYYY").format("dddd D MMM") }}
        </div>
      </div>
      <div class="row q-pb-sm q-pt-sm">
        <div class="col text-bold">Tijd</div>
        <div class="col overflow-hidden text-right">
          {{ time }}
        </div>
      </div>
      <div class="row q-pb-sm q-pt-sm">
        <div class="col text-bold">Pro</div>
        <div class="col overflow-hidden text-right">
          {{ pro }}
        </div>
      </div>
      <div class="row q-pb-sm q-pt-sm">
        <div class="col text-bold">Soort les</div>
        <div class="col overflow-hidden text-right">
          {{ soortLes }}
        </div>
      </div>
      <div class="row q-pb-sm q-pt-sm">
        <div class="col text-bold">Max. aantal deelnemers</div>
        <div class="col overflow-hidden text-right">
          {{ pro_lesson.pro_lesson_type.pltMaxPers }}
        </div>
      </div>
      <q-separator class="q-mt-sm q-mb-sm" />
      <div class="col"><h6 class="q-mt-sm q-mb-sm">Deelnemer(s)</h6></div>
      <q-list separator>
        <q-item
          v-for="(client, key) in pro_lesson.clients"
          :key="key"
          v-ripple
          class="full-width q-mb-sm"
          clickable
          style="border-radius: 4px"
        >
          <q-item-section>
            <q-item-label class="itg-text-overflow">
              {{ client.plcName }}
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-icon v-if="client.canCancel === 1" name="delete" />
          </q-item-section>
        </q-item>
      </q-list>
      <q-separator class="q-mt-sm q-mb-sm" />
      <div class="col"><h6 class="q-mt-sm q-mb-sm">Acties</h6></div>
      <q-btn
        v-if="pro_lesson.canCancel === 1"
        class="full-width q-mb-md"
        color="primary"
        icon="delete"
        v-on:click="handleCancel"
      >
        Annuleer les
      </q-btn>
      <q-btn
        class="full-width q-mb-md"
        color="primary"
        icon="arrow_back_ios"
        v-on:click="$emit('onCloseLesson')"
      >
        Sluit les
      </q-btn>
    </q-card>
  </q-page>
</template>

<script>
export default {
  props: {
    lesson: Object,
  },
  data: function () {
    return {};
  },
  computed: {
    pro_lesson() {
      return this.lesson.pro_lesson;
    },
    date() {
      return this.$filters.unixToDate(this.pro_lesson.lesDate);
    },
    time() {
      return this.$filters.minuteToTime(this.pro_lesson.lesTimeFrom);
    },
    pro() {
      return this.pro_lesson.relation.full_name2;
    },
    soortLes() {
      return this.pro_lesson.pro_lesson_type.pltName;
    },
  },
  methods: {
    handleCancel: function () {
      this.$q
        .dialog({
          title: "Annuleer les",
          message: "Deze les wordt geannuleerd, wilt u doorgaan?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.pro_lesson.lesCarNr = 1;
          this.$http.post("golfer/lesson", this.pro_lesson).then(() => {
            this.$q.notify({
              type: "positive",
              message: "uw les is geannuleerd",
            });
            this.newLesson = false;
            this.$emit("onCloseLesson");
          });
        });
    },
  },
};
</script>
