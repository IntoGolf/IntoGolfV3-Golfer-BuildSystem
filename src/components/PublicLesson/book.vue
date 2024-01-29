<template>
  <div>
    <div v-if="mollie === null" class="row q-mt-md">
      <div class="col">
        <div class="row text-center q-mb-lg">
          <div class="col text-h5 q-ml-auto q-mr-auto">Reservering les</div>
        </div>

        <q-separator class="q-mb-md" />

        <div class="row q-pa-sm bg-green-1">
          <div class="col-4 text-bold">Datum:</div>
          <div class="col-8">
            {{ $dayjs(date).format("dddd DD MMMM") }}
          </div>
        </div>

        <div class="row q-pa-sm">
          <div class="col-4 text-bold">Tijd:</div>
          <div class="col-8">
            {{ $filters.minuteToTime(lesson.pagTime) }}
          </div>
        </div>

        <div class="row q-pa-sm bg-green-1">
          <div class="col-4 text-bold">Les soort:</div>
          <div class="col-8">
            {{ lesson.pro_lesson_type.pltName }}
          </div>
        </div>

        <div class="row q-pa-sm">
          <div class="col-4 text-bold">Pro:</div>
          <div class="col-8">
            {{ lesson.pro.full_name2 }}
          </div>
        </div>

        <div
          v-if="lesson.pro_lesson_fee_player !== null"
          class="row q-pa-sm bg-green-1"
        >
          <div class="col-4 text-bold">Prijs deelname les:</div>
          <div class="col-8">
            {{ $filters.money(lesson.pro_lesson_fee_player.lfpPrice) }}
          </div>
        </div>

        <div
          v-if="1 === 2 && lesson.pro_lesson_fee_les !== null"
          class="row p-2"
        >
          <div class="col-4 text-bold">Prijs per les</div>
          <div class="col-8">
            {{ $filters.money(lesson.pro_lesson_fee_les.lfpPrice) }}
          </div>
        </div>

        <div class="row q-mt-sm">
          Nadat je de les hebt betaald ontvang je een e-mail ter bevestiging van
          je reservering. In deze e-mail vindt je een link waarmee je je les kan
          aanvullen.
        </div>

        <q-separator class="q-mb-md q-mt-md" />

        <div class="text-h6">Uw contact gegevens</div>
        <q-input
          v-model="ProLesson.ProLessonClient.plcName"
          :rules="[(val) => !!val || '* Required']"
          class="q-mb-sm"
          label="Naam"
          lazy-rules
        />
        <q-input
          v-model="ProLesson.ProLessonClient.plcEmail"
          :rules="[emailRule]"
          class="q-mb-sm"
          label="E-mailadres"
          lazy-rules
        />
        <q-input
          v-model="ProLesson.ProLessonClient.plcPhone"
          :rules="[(val) => !!val || '* Required']"
          class="q-mb-sm"
          label="Telefoonummer"
          lazy-rules
          mask="###############"
        />

        <div class="row text-h6">Leveringsvoorwaarden:</div>
        <div
          class="row q-pa-sm"
          style="
            border: 1px solid lightgrey;
            height: 150px;
            font-size: 10px;
            overflow-y: scroll;
          "
        >
          {{ conditions }}
        </div>
        <div class="row q-mt-md">
          <q-checkbox
            v-model="ProLesson.ProLessonClient.agreeConditions"
            :rules="[(val) => !!val || '* Required']"
            class="q-mb-sm"
            label="Ik ga akkoord met de leveringsvoorvaarden"
            stack-label
          />
        </div>
        <div class="row">
          <q-checkbox
            v-model="ProLesson.ProLessonClient.agreeCommerce"
            :rules="[(val) => !!val || '* Required']"
            class="q-mb-sm"
            label="Stuur mij aanbiedingen"
            stack-label
          />
        </div>
        <q-btn
          class="q-mr-sm"
          color="primary"
          label="Terug"
          v-on:click="handleBack"
        />
        <q-btn
          :disable="!valid"
          color="secondary"
          label="Betalen"
          v-on:click="handleSave"
        />
      </div>
    </div>
    <div v-else>
      <payment
        :id="mollie.id"
        :url="mollie.url"
        v-on:handleClosePayment="handleClosePayment"
      />
    </div>
  </div>
</template>

<script>
import Payment from "components/payment/initiate.vue";

export default {
  components: { Payment },
  props: {
    date: String,
    lesson: Array,
  },
  data() {
    return {
      step: 1,
      ProLesson: {
        lesDate: null,
        lesBlockedFrom: null,
        lesBlockedTo: null,
        lesPltNr: null,
        lesRelNrPro: null,
        lesSize: null,
        lesLsfNr: null,
        lesPrice: null,
        lesItmNr: null,
        ProLessonClient: {
          plcName: "Laurens",
          plcPhone: "0172617000",
          plcEmail: "laurens@intogolf.nl",
          plcLsfNr: null,
          plcPrice: null,
          plcItmNr: null,
          agreeConditions: true,
          agreeCommerce: false,
        },
      },
      mollie: null,
    };
  },
  watch: {
    lesson: {},
  },
  computed: {
    conditions: function () {
      if (this.settings === null) {
        return "";
      }
      return this.$store.state.settings.item.website_payment_conditions;
    },
    valid: function () {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return (
        this.ProLesson.ProLessonClient.plcName.length > 3 &&
        this.ProLesson.ProLessonClient.agreeConditions &&
        emailPattern.test(this.ProLesson.ProLessonClient.plcEmail)
      );
    },
  },
  methods: {
    handleSave: function () {
      let les = this.ProLesson;
      les.lesDate = this.$filters.dateToUnix(this.date, "YYYY-MM-DD");
      les.lesBlockedFrom = this.lesson.pagTimeFrom;
      les.lesPltNr = this.lesson.pro_lesson_type.pltNr;
      les.lesRelNrPro = this.lesson.pro.relNr;
      les.lesRelNrPro = this.lesson.pro.relNr;

      les.ProLessonClient.plcLsfNr = this.lesson.pro_lesson_fee_player.lfpNr;
      les.ProLessonClient.plcPrice = this.lesson.pro_lesson_fee_player.lfpPrice;
      les.ProLessonClient.plcItmNr = this.lesson.pro_lesson_fee_player.lfpItmNr;

      this.$http.post("public/lesson", les).then((res) => {
        this.mollie = res.data;
      });
    },
    handleBack: function () {
      this.$emit("handleBack");
    },
    handleClosePayment: function () {
      this.mollie = null;
      this.$emit("handleClose");
    },
  },
};
</script>
