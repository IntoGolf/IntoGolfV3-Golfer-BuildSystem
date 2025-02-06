<template>
  <div class="bg-white q-pa-md overflow-auto" style="height: 100vh">
    <div v-if="mollie === null">
      <pro-course-list v-if="!ProCourse" v-on:onOpenCourse="onOpenCourse"/>
      <q-card
        v-else-if="ProCourse"
        class="full-width shadow-1 q-pa-md"
      >
        <pro-course-details :item="ProCourse"/>
        <q-form ref="formCourse">
          <pro-course-guest-form v-show="step === 1" :form="form"/>
          <pro-course-confirm v-show="step === 2" :form="form"/>
        </q-form>
        <q-separator class="q-mt-md q-mb-md"/>
        <div class="row">
          <div class="col text-right">
            <q-btn
              :label="step === 1 ? 'Terug naar cursussen' : 'Terug'"
              color="primary"
              flat
              v-on:click="onBack"
            />
            <q-btn
              :disable="
                (step === 2 && !this.form.agreeConditions) ||
                (step === 1 && !validateForm())
              "
              :label="subBtnLabel"
              color="primary"
              v-on:click="onSubscribe"
            />
          </div>
        </div>
      </q-card>
    </div>

    <payment
      v-else
      :id="mollie.opmKey"
      :sub-text-expired="'Klik op sluiten om terug te keren naar de inschrijving'"
      :sub-text-failed="'Klik op sluiten om terug te keren naar de inschrijving'"
      :sub-text-halted="'Klik op sluiten om terug te keren naar de inschrijving'"
      :sub-text-paid="'Klik op sluiten om terug te keren naar het cursusaanbod'"
      :url="mollie.url"
      v-on:handleCloseSubscribe="onCloseMollie"
    />
  </div>
</template>

<script>
import Payment from "components/match/payment.vue";
import ProCourseList from "components/proCourses/list.vue";
import ProCourseDetails from "components/proCourses/details.vue";
import ProCourseGuestForm from "components/proCourses/guestForm.vue";
import ProCourseConfirm from "components/proCourses/confirm.vue";

export default {
  components: {ProCourseConfirm, ProCourseGuestForm, ProCourseDetails, ProCourseList, Payment},
  data() {
    return {
      ProCourseArray: [],
      ProCourse: null,
      step: 1,
      mollie: null,
      form: null,
    };
  },
  async created() {
    this.resetForm();
    await this.getClasses();
  },
  computed: {
    subBtnLabel() {
      if (this.step === 1) {
        return "Bevestigen";
      }
      return this.form.payType === "iDeal" ? "Betalen" : "Inschrijven";
    },
  },
  methods: {
    async getClasses() {
      this.ProCourseArray = await this.$http.get("golfer/classes");
    },
    async validateForm() {
      const form = this.$refs.formCourse;
      if (!form) {
        return;
      }
      return await form.validate();
    },
    onBack() {
      if (this.step === 1) {
        this.ProCourse = null;
      } else if (this.step === 2) {
        this.step = 1;
      }
    },
    async onSubscribe() {
      if (this.step === 1) {
        const formValid = await this.validateForm();
        if (!formValid) {
          this.$q.notify({
            message: "Vul alle velden in!",
            position: "center",
            timeout: 200,
          });
        } else {
          this.step = 2;
        }
      } else if (this.step === 2) {
        this.form.ProCourse = this.ProCourse;
        const res = await this.$http.post("public/course", this.form);

        if (this.form.payType === "iDeal") {
          this.mollie = res.data;
        } else {
          this.ProCourse = null;
        }
      }
    },
    onCloseMollie(status) {
      if (status === "paid") {
        this.resetPage();
      } else {
        this.resetMollie();
      }
    },
    resetMollie() {
      this.mollie = null;
    },
    resetPage() {
      this.step = 1;
      this.mollie = null;
      this.ProCourse = null;
      this.resetForm();
    },
    resetForm() {
      this.form = {
        plcName: "Laurens Luder",
        plcEmail: "laurens@intogolf.nl",
        plcPhone: "0172617000",
        plcHandicap: "54",
        payType: "onCourse",
        agreeConditions: false,
        agreeCommerce: false,
      };
    },
    onOpenCourse(item) {
      this.ProCourse = item;
    },
  },
};
</script>
