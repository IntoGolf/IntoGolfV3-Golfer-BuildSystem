<template>
  <div>
    <public-lesson-details
      v-if="[1, 2, 3, 4].includes(step)"
      :form="lForm"
      :step="step"
    />

    <public-lesson-pricing
      v-if="step === 1 && lForm.type.category === 1"
      :form="lForm"
      v-on:setFee="setFee"
    />

    <public-lesson-register
      v-else-if="step === 2"
      ref="lessonRegister"
      :form="lForm"
      :tab="personTab"
      v-on:setTab="setTab"
    />

    <public-lesson-confirm
      v-else-if="step === 3"
      :form="lForm"
    />

    <public-lesson-client-finish
      v-else-if="step === 4"
      :form="lForm"
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
          v-show="reloadStep"
          :label="labelHome"
          class="q-mr-sm"
          color="primary"
          v-on:click="onReload"
        />

        <q-btn
          v-show="backOptions.includes(step)"
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
          v-on:click="onClients"
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
          :disable="!lForm.agreeConditions"
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
import PublicLessonRegister from "components/proLessonClient/book/register.vue";
import PublicLessonPricing from "components/proLessonClient/book/pricing.vue";
import PublicLessonConfirm from "components/proLessonClient/book/confirm.vue";
import PublicLessonDetails from "components/proLessonClient/book/details.vue";
import Payment from "components/match/payment.vue";
import PublicLessonClientFinish from "components/proLessonClient/book/finish.vue";

export default {
  name: "publicLessonClientBook",
  components: {
    PublicLessonClientFinish,
    Payment,
    PublicLessonDetails,
    PublicLessonConfirm,
    PublicLessonPricing,
    PublicLessonRegister,
  },
  props: {
    form: Object,
  },
  data() {
    return {
      step: this.form.type.category === 1 ? 1 : 2,
      personTab: "person0",
      mollie: null,
      lForm: this.form,
    };
  },
  computed: {
    backOptions() {
      let result = [3];
      if (this.lForm.type.category === 1) {
        result.push(2)
      }
      return result;
    },
    reloadStep() {
      if (this.hasPcsNrParam) {
        return false;
      }
      let array = [4];
      if (this.lForm.type.category === 1) {
        array.push(1);
      } else {
        array.push(2)
      }
      return array.includes(this.step);
    },
    labelHome() {
      if (this.lForm.type.category === 2) {
        return "Inlooplessen"
      }
      return "Andere datum";
    },
    confirmButtonLabel() {
      return this.lForm.payMethod === "onCourse" ? "Reserveren" : "Betalen";
    },
    labelRegister() {
      const lastPerson = "person" + (this.lForm.clients.length - 1);
      if (lastPerson !== this.personTab) {
        return "Volgende";
      } else if (this.step === 4) {
        return "Terug naar lessen";
      }
      return "Bevestig";
    },
    hasPcsNrParam() {
      return this.$route.query.id > 0;
    }
  },
  methods: {
    async handleSave() {
      let res = await this.$http.post("public/lesson", this.lForm);
      if (this.lForm.payMethod === "iDeal") {
        this.mollie = res.data;
      }
      this.step = 4;
    },
    async onRegisterRelation() {
      if (this.labelRegister === "Volgende") {
        const personIndex = parseInt(this.personTab.substring(6, 7));
        this.personTab = "person" + (personIndex + 1);
        return;
      }

      const formValid = await this.onCheckRelationForm();
      if (formValid) {
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
    setFee(fee) {
      this.lForm.clients = [];
      for (let i = 0; i < fee.lfpSizeTo; i++) {
        this.lForm.clients.push(this.onAddClient());
      }
      this.lForm.fee = fee;
    },
    onAddClient() {
      return {
        firstName: "test",
        prefix: "test",
        lastName: "test",
        phone: "0172617000",
        email: "test@intogolf.nl",
        handicap: "10",
      }
    },
    onReload() {
      window.location.reload();
    },
    setTab(value) {
      this.personTab = value;
    },
    onClients() {
      for (let i = 1; i <= this.lForm.fee.lfpSizeTo; i++) {
        if (this.lForm.clients[i - 1] === undefined) {
          this.lForm.clients.push(this.onAddClient());
        }
      }
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
