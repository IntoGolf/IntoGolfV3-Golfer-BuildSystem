<template>
  <div class="bg-white q-pa-md overflow-hidden scroll-y" style="height: 100vh">
    <div v-if="mollie === null">
      <div v-if="!ProCourse">
        <div v-if="ProCourseArray.length === 0" class="row">
          <div class="col text-h6 q-mt-xl">
            Er zijn momenteel geen cursussen beschikbaar.
          </div>
        </div>
        <div v-else class="row">
          <q-card
            v-for="(item, key) in ProCourseArray"
            :key="key"
            class="full-width shadow-1 q-pa-md"
          >
            <div class="row text-bold">
              <div class="col text-h5">
                {{ $filters.capitalizeFirstLetter(item.pcsName) }}
              </div>
            </div>
            <q-separator class="q-mt-md q-mb-md" />
            <div class="row">
              <div class="col-4">Eerste les</div>
              <div class="col-8">
                :
                {{ $filters.unixToDate(item.pcsDateFrom, "dddd D MMMM") }}
              </div>
            </div>

            <div class="row">
              <div class="col-4">Tijd</div>
              <div class="col-8">
                :
                {{ $filters.minuteToTime(item.pro_lessons[0].lesBlockedFrom) }}
                tot
                {{ $filters.minuteToTime(item.pro_lessons[0].lesBlockedTo) }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">Aantal lessen</div>
              <div class="col-8">: {{ item.pro_lessons.length }}</div>
            </div>
            <div class="row">
              <div class="col-4">Lessen datums</div>
              <div class="col-8">: {{ lessonsText(item) }}</div>
            </div>
            <div class="row">
              <div class="col-4">Beschikbare plaatsen</div>
              <div class="col-8">
                :
                {{ item.available_spots }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">Kosten</div>
              <div class="col-8">: {{ $filters.money(item.fee.lfpPrice) }}</div>
            </div>
            <div class="row">
              <div class="col">
                {{ item.pro_lesson_type.pltNotes }}
              </div>
            </div>
            <q-separator class="q-mt-md q-mb-md" />
            <div class="row">
              <div class="col text-right">
                <q-btn
                  color="primary"
                  label="Inschrijven"
                  v-on:click="ProCourse = item"
                />
              </div>
            </div>
          </q-card>
        </div>
      </div>
      <q-card
        v-else-if="ProCourse && !subscribe"
        class="full-width shadow-1 q-pa-md"
      >
        <div class="row justify-center q-mb-md">
          <div class="col text-h5">Inschrijven {{ ProCourse.pcsName }}</div>
        </div>
        <q-separator class="q-mb-md" />
        <div class="row">
          <div class="col">
            <div class="row">
              <div class="col-4">Eerste les</div>
              <div class="col-8">
                :
                {{ $filters.unixToDate(ProCourse.pcsDateFrom, "dddd D MMMM") }}
              </div>
            </div>

            <div class="row">
              <div class="col-4">Tijd</div>
              <div class="col-8">
                :
                {{
                  $filters.minuteToTime(ProCourse.pro_lessons[0].lesBlockedFrom)
                }}
                tot
                {{
                  $filters.minuteToTime(ProCourse.pro_lessons[0].lesBlockedTo)
                }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">Aantal lessen</div>
              <div class="col-8">: {{ ProCourse.pro_lessons.length }}</div>
            </div>
            <div class="row">
              <div class="col-4">Lessen datums</div>
              <div class="col-8">: {{ lessonsText(ProCourse) }}</div>
            </div>
            <div class="row">
              <div class="col-4">Beschikbare plaatsen</div>
              <div class="col-8">
                :
                {{ ProCourse.available_spots }}
              </div>
            </div>
            <div class="row">
              <div class="col-4">Kosten</div>
              <div class="col-8">
                : {{ $filters.money(ProCourse.fee.lfpPrice) }}
              </div>
            </div>
            <q-separator
              v-show="ProCourse.pcsText != null && ProCourse.pcsText.length > 0"
              class="q-mt-md"
            />
            <div class="row">
              <div id="course-text" class="col" v-html="ProCourse.pcsText" />
            </div>
            <q-form ref="formCourse">
              <div v-show="step === 1">
                <q-separator class="q-mt-md q-mb-md" />
                <q-input
                  v-model="form.plcName"
                  :rules="[(val) => !!val || '* Required']"
                  label="Naam"
                />
                <q-input
                  v-model="form.plcEmail"
                  :rules="[emailRule]"
                  label="E-mailadres"
                />
                <q-input
                  v-model="form.plcPhone"
                  :rules="[(val) => !!val || '* Required']"
                  label="Telefoon"
                />
                <q-input
                  v-model="form.plcHandicap"
                  :rules="[numberRule]"
                  label="Speelsterkte"
                />
              </div>
              <div v-show="step === 2">
                <q-separator class="q-mt-md q-mb-md" />
                <div class="text-h6">Betaalwijze</div>
                <q-option-group
                  v-model="form.payType"
                  :options="payTypeArray"
                />
                <div class="row text-h6">Leveringsvoorwaarden:</div>
                <div
                  class="row q-pa-sm"
                  style="
                    border: 1px solid lightgrey;
                    height: 100px;
                    font-size: 10px;
                    overflow-y: scroll;
                  "
                >
                  {{ conditions }}
                </div>
                <q-checkbox
                  v-model="form.agreeConditions"
                  :rules="[(val) => !!val || '* Required']"
                  class="q-mb-sm"
                  label="Ik ga akkoord met de leveringsvoorvaarden"
                  stack-label
                />
                <q-checkbox
                  v-model="form.agreeCommerce"
                  :rules="[(val) => !!val || '* Required']"
                  class="q-mb-sm"
                  label="Stuur mij aanbiedingen"
                  stack-label
                />
              </div>
            </q-form>
            <q-separator class="q-mt-md q-mb-md" />
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

export default {
  components: { Payment },
  data() {
    return {
      ProCourseArray: [],
      ProCourse: null,
      subscribe: false,
      payTypeArray: [
        { label: "Op de baan", value: "onCourse" },
        { label: "iDeal", value: "iDeal" },
      ],
      step: 1,
      mollie: null,
      form: null,
      emailRule: (val) =>
        /.+@.+\..+/.test(val) || "Voer een geldig e-mailadres in",
      numberRule: (val) => {
        const num = parseFloat(val.replace(",", "."));
        return (
          (!isNaN(num) && num >= -9.9 && num <= 54) ||
          "Voer een geldig nummer in tussen -9,9 en 54"
        );
      },
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
    conditions: function () {
      if (this.$store.state.settings === null) {
        return "";
      }
      return this.$store.state.settings.item.website_payment_conditions;
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
    lessonsText: function (item) {
      let result = "";
      for (let i = 0; i < item.pro_lessons.length; i++) {
        result +=
          (i > 0 ? ", " : "") +
          this.$filters.unixToDate(item.pro_lessons[i].lesDate, "D/M");
      }
      return result;
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
  },
};
</script>
