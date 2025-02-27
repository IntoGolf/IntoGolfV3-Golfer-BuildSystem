<template>
  <div>
    <public-lesson-details
      v-if="[1, 2, 3].includes(step)"
      :ProLesson="ProLesson"
      :step="step"
    />

    <public-lesson-pricing
      v-if="step === 1"
      :fee="ProLesson.fee"
      :lesson="lesson"
      v-on:setFee="setFee"
    />

    <public-lesson-register
      v-else-if="step === 2"
      ref="lessonRegister"
      :lesson="lesson"
      :proLesson="ProLesson"
      :tab="personTab"
      v-on:setTab="setTab"
    />

    <public-lesson-confirm
      v-else-if="step === 3"
      :lesson="lesson"
      :paymentOptions="paymentOptions"
      :proLesson="ProLesson"
    />

    <payment
      v-if="mollie !== null"
      :id="mollie.opmKey"
      :url="mollie.url"
      v-on:handleCloseSubscribe="onCloseMollie"
    />

    <div class="row text-center q-mb-lg">
      <div class="col q-ml-auto q-mr-auto">
        <q-btn
          v-show="step === 1"
          class="q-mr-sm"
          color="primary"
          label="Andere datum"
          v-on:click="onReload"
        />

        <q-btn
          v-show="[2, 3].includes(step)"
          class="q-mr-sm"
          color="primary"
          label="Terug"
          v-on:click="step--"
        />
        <q-btn
          v-show="step === 1"
          class="q-mr-sm"
          color="primary"
          label="Deelnemers"
          v-on:click="onDeelnemers"
        />
        <q-btn
          v-show="step === 2"
          :label="labelRegister"
          class="q-mr-sm"
          color="primary"
          v-on:click="onRegisterRelation"
        />
        <q-btn
          v-show="step === 3"
          :label="confirmButtonLabel"
          class="q-mr-sm"
          color="primary"
          v-on:click="handleSave"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PublicLessonRegister from "components/proLesson/book/register.vue";
import PublicLessonPricing from "components/proLesson/book/pricing.vue";
import PublicLessonConfirm from "components/proLesson/book/confirm.vue";
import PublicLessonDetails from "components/proLesson/book/details.vue";
import Payment from "components/match/payment.vue";

export default {
  components: {
    Payment,
    PublicLessonDetails,
    PublicLessonConfirm,
    PublicLessonPricing,
    PublicLessonRegister,
  },
  props: {
    date: String,
    lesson: Object,
  },
  data() {
    return {
      step: 1,
      personTab: "person0",
      paymentOptions: [
        {label: "Op de baan", value: "onCourse"},
        {label: "via iDeal met 10% korting", value: "iDeal"},
      ],
      mollie: null,
      ProLesson: {
        lesDate: this.date,
        lesBlockedFrom: this.lesson.pagTimeFrom,
        lesBlockedTo: null,
        lesPltNr: null,
        lesProNr: null,
        lesSize: null,
        lesLsfNr: null,
        lesPrice: null,
        lesItmNr: null,
        fee: null,
        agreeConditions: true,
        agreeCommerce: false,
        pro_lesson_type: this.lesson.pro_lesson_type,
        pro: this.lesson.pro,
        relation: null,
        payMethod: "onCourse",
        ProLessonClient: {
          plcName: "laurens",
          plcPhone: "0172617000",
          plcEmail: "laurens+331@intogolf.nl",
        },
      },
    };
  },
  mounted() {
    this.ProLesson.fee = this.feeOptions[0].value;
  },
  computed: {
    confirmButtonLabel() {
      return this.ProLesson.payMethod === "onCourse" ? "Reseveren" : "Betalen";
    },
    feeOptions() {
      return this.lesson.pro_lesson_fee_les.map((price) => {
        let personText = price.lfpSizeTo === 1 ? " persoon " : " personen ";
        let numberText = price.lfpSizeFrom;
        if (price.lfpSizeFrom !== price.lfpSizeTo) {
          numberText += " tot " + price.lfpSizeTo;
        }
        return {
          label: numberText + personText + this.$filters.money(price.lfpPrice),
          value: price,
        };
      });
    },
    conditions: function () {
      if (this.$store.state.settings === null) {
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
    labelRegister() {
      const lastPerson = "person" + (this.ProLesson.ProLessonClient.length - 1);
      if (lastPerson !== this.personTab) {
        return "Volgende";
      }
      return "Bevestig";
    },
  },
  methods: {
    async handleSave() {
      let les = this.ProLesson;
      les.lesDate = this.$filters.dateToUnix(this.date, "YYYY-MM-DD");
      les.lesBlockedFrom = this.lesson.pagTimeFrom;
      les.lesPltNr = this.lesson.pro_lesson_type.pltNr;
      les.lesProNr = this.lesson.proNr;

      les.ProLessonClient.plcLsfNr = this.lesson.pro_lesson_fee_les[0].lfpNr;
      les.ProLessonClient.plcPrice = this.lesson.pro_lesson_fee_les[0].lfpPrice;
      les.ProLessonClient.plcItmNr = this.lesson.pro_lesson_fee_les[0].lfpItmNr;

      let res = await this.$http.post("public/lesson", les);
      if (les.payMethod === "iDeal") {
        this.mollie = res.data;
      }
      this.step = 4;
    },
    handleBack: function () {
      this.$emit("handleBack");
    },
    handleClosePayment: function () {
      this.$emit("handleClose");
    },
    async onSaveRelation() {
      let res = await this.$http.post(
        "/api/publicLesson/relation",
        this.relation
      );
    },
    async onRegisterRelation() {
      if (this.labelRegister === "Volgende") {
        const personIndex = parseInt(this.personTab.substring(6, 7));
        this.personTab = "person" + (personIndex + 1);
        return;
      }

      const formValid = await this.onCheckRelationForm();
      const relValid = await this.onSetRelation();
      if (formValid && relValid) {
        this.step++;
      }
    },
    async onCheckRelationForm() {
      const form = this.$refs.lessonRegister.$refs.formRelation;

      if (!form) {
        return false;
      }
      return await form.validate();
    },
    async onSetRelation() {
      let res = await this.$http.post(
        "public/lesson/relation",
        this.$refs.lessonRegister.relation
      );
      this.ProLesson.relation = this.$refs.lessonRegister.relation;
      return res.data === "ok";
    },
    setFee(fee) {
      this.ProLesson.ProLessonClient = [];
      for (let i = 0; i < fee.lfpSizeTo; i++) {
        this.ProLesson.ProLessonClient.push({
          plcName: "test",
          plcPhone: "",
          plcEmail: "test@intogolf.nl",
          plcHandicap: "10",
        });
      }
      this.ProLesson.fee = fee;
    },
    onReload() {
      window.location.reload();
    },
    setTab(value) {
      this.personTab = value;
    },
    onDeelnemers() {
      this.personTab = "person0";
      this.step++;
    },
    onCloseMollie(status) {
      this.mollie = null;
      if (status === "paid") {
        this.onReload();
      } else {
        this.step = 3;
      }
    },
  },
};
</script>
