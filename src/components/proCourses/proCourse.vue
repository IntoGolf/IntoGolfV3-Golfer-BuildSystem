<template>
  <div class="row full-width q-mt-md bg-orange q-pa-sm">
    <div class="col-12">
      <div class="row">
        <div class="col-6">
          <b>{{ proCourse.pcsName }}</b>
        </div>
        <div class="col-6 text-right">
          <b>{{ $filters.unixToDate(proCourse.pcsDateFrom, "ddd DD MMM") }}</b>
          {{ proCourse.time }}
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <i>pro: {{ proCourse.ProLessons[0].Relation.full_name2 }}</i>
        </div>
        <div class="col-6 text-right"></div>
      </div>
      <q-separator />
      <div class="row">
        <div class="col text-bold">Lessen</div>
      </div>
      <div v-for="(les, key) in proCourse.ProLessons" :key="key" class="row">
        <div class="col">
          {{ $filters.unixToDate(les.lesDate, "ddd DD MMM") }}
          {{ $filters.minuteToTime(les.lesTimeFrom) }} -
          {{ $filters.minuteToTime(les.lesTimeTo) }}
        </div>
      </div>
      <q-separator />
      <div class="row">
        <div class="col text-right">
          <q-btn
            class="q-mt-sm"
            color="secondary"
            label="Inschrijven"
            size="sm"
            v-on:click="handleSubscribe"
          />
        </div>
      </div>
    </div>
  </div>
</template>
import authMixin from "../mixins/auth";

<script>
import authMixin from "src/mixins/auth";

export default {
  mixins: [authMixin],
  props: {
    proCourse: Object,
  },
  methods: {
    handleSubscribe: function () {
      this.$q
        .dialog({
          title: "Inschrijven cursus",
          message: "U schrijft in op deze cursus, wilt u doorgaan?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.$http
            .post("golfer/pro_client_course", { pcsNr: this.proCourse.pcsNr })
            .then((res) => {
              this.$q.notify({
                type: "positive",
                message: "U bent ingeschreven",
              });
              this.$emit("handleRefresh");
            });
        });
    },
  },
};
</script>
