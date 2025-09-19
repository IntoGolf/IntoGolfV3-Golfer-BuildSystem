<template>
  <q-page-container>
    <q-page class="q-pa-md">
      <!-- Header Section with improved visual hierarchy - only show in step 1 -->
      <div v-if="step === 1" class="row q-mb-lg">
        <div class="col-12">
          <div class="row items-center q-mb-md">
            <div class="col-8">
              <h3 class="text-h4 q-ma-none text-weight-light">
                <q-icon name="schedule" class="q-mr-sm text-primary"/>
                Boek je starttijd
              </h3>
              <p class="text-grey-6 q-ma-none q-mt-xs">Kies je perfecte speeltijd</p>
            </div>
            <div class="col-4 text-right">
              <q-btn-group>
                <q-btn
                  :disable="!canGoPrevious"
                  color="primary"
                  icon="keyboard_arrow_left"
                  flat
                  round
                  @click="setDay(-1)"
                  size="md"
                >
                  <q-tooltip>Vorige dag</q-tooltip>
                </q-btn>
                <q-btn
                  :disable="!canGoNext"
                  color="primary"
                  icon="keyboard_arrow_right"
                  flat
                  round
                  @click="setDay(1)"
                  size="md"
                >
                  <q-tooltip>Volgende dag</q-tooltip>
                </q-btn>
              </q-btn-group>
            </div>
          </div>

          <!-- Enhanced Filters with better spacing and icons -->
          <div class="row q-col-gutter-md">
            <div class="col-md-3 col-xs-12">
              <q-input 
                v-model="date" 
                label="Datum"
                type="date"
                filled
                dense
                :min="todayFormatted"
                :max="maxDate"
              >
                <template v-slot:prepend>
                  <q-icon name="event" color="primary"/>
                </template>
              </q-input>
            </div>
            
            <div class="col-md-3 col-xs-6">
              <q-select
                v-model="flight.fltSize"
                :options="sizeArray"
                emit-value
                label="Aantal spelers"
                filled
                dense
              >
                <template v-slot:prepend>
                  <q-icon name="people" color="primary"/>
                </template>
              </q-select>
            </div>

            <div class="col-md-3 col-xs-6">
              <q-select
                v-model="holes"
                :options="holesArray"
                label="Aantal holes"
                filled
                dense
              >
                <template v-slot:prepend>
                  <q-icon name="golf_course" color="primary"/>
                </template>
              </q-select>
            </div>
            
            <div class="col-md-3 col-xs-12">
              <q-select
                v-model="per"
                :options="perArray"
                label="Dagdeel"
                filled
                dense
              >
                <template v-slot:prepend>
                  <q-icon name="schedule" color="primary"/>
                </template>
              </q-select>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State with better visual feedback -->
      <div v-if="loading" class="row justify-center q-my-xl">
        <div class="col-12 text-center">
          <q-spinner-golf color="primary" size="60px"/>
          <p class="text-h6 q-mt-md text-grey-6">Starttijden worden opgehaald...</p>
          <q-linear-progress indeterminate color="primary" class="q-mt-md" style="max-width: 300px; margin: 0 auto;"/>
        </div>
      </div>

      <!-- Tee Times Display with improved layout -->
      <div v-else-if="hasTimes && step === 1">
        <!-- Merge Text with better typography -->
        <div v-if="mergeText" class="row q-mb-md">
          <div class="col-12">
            <q-card flat bordered class="bg-blue-1">
              <q-card-section class="q-pa-md">
                <div class="row items-center">
                  <q-icon name="info" color="primary" size="24px" class="q-mr-sm"/>
                  <span class="text-body1">{{ mergeText }}</span>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Course Headers with improved design -->
        <div class="row q-col-gutter-sm q-mb-md">
          <div
            v-for="(course, cKey) in courses"
            :key="cKey"
            class="col text-center"
          >
            <q-card class="course-header-card">
              <q-card-section class="q-pa-sm">
                <div class="text-weight-bold course-header-text">{{ course.crlNameInternet }}</div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Time Slots with enhanced visual design -->
        <div class="row q-col-gutter-sm" style="max-height: 600px; overflow-y: auto;">
          <div
            v-for="(course, cKey) in courses"
            :key="cKey"
            class="col"
          >
            <enhanced-course-comp
              :course="course"
              :holes="holes"
              :per="per"
              :size="flight.fltSize"
              @setTimeObject="setTimeObject"
            />
          </div>
        </div>
      </div>

      <!-- No Times Available with better messaging -->
      <div v-else-if="!loading && !hasTimes && step === 1" class="row justify-center q-my-xl">
        <div class="col-md-6 col-xs-12 text-center">
          <q-card flat bordered>
            <q-card-section class="q-pa-xl">
              <q-icon name="golf_course" size="80px" color="grey-4" class="q-mb-md"/>
              <h5 class="text-h5 q-ma-none q-mb-md text-grey-7">Geen starttijden beschikbaar</h5>
              <p class="text-body1 text-grey-6 q-mb-lg">
                Voor {{ $filters.capitalizeFirstLetter(dayjs(date).format("dddd DD MMMM")) }}
                hebben we helaas geen beschikbare starttijden voor {{ holes.value }} holes.
              </p>
              <div class="row q-col-gutter-sm justify-center">
                <div class="col-auto">
                  <q-btn 
                    color="primary" 
                    icon="keyboard_arrow_left"
                    label="Vorige dag"
                    @click="setDay(-1)"
                    :disable="!canGoPrevious"
                    unelevated
                  />
                </div>
                <div class="col-auto">
                  <q-btn 
                    color="primary" 
                    icon-right="keyboard_arrow_right"
                    label="Volgende dag"
                    @click="setDay(1)"
                    :disable="!canGoNext"
                    unelevated
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Booking Form (Step 2) with improved layout -->
      <enhanced-booking-form
        v-if="step === 2"
        :flight="flight"
        :date="date"
        :holes="holes"
        :flightPrice="flightPrice"
        :maxFlightHandicap="maxFlightHandicap"
        :maxHandicap="maxHandicap"
        :displayMaxHandicap="displayMaxHandicap"
        :hasWebsiteBookingText="hasWebsiteBookingText"
        :hasPayOption="hasPayOption"
        :conditions="conditions"
        :paymentOptions="paymentOptions"
        :valid="valid"
        :pay="pay"
        @onBack="onBack"
        @handleSave="handleSave"
        @updateField="updateField"
      />

      <!-- Payment Step -->
      <payment
        v-if="mollie !== null"
        v-show="step === 3"
        :id="mollie.id"
        :url="mollie.url"
        @handleClosePayment="handleClosePayment"
      />

      <!-- Confirmation Step -->
      <confirmation v-if="step === 4"/>
    </q-page>
  </q-page-container>
</template>

<script>
import EnhancedCourseComp from "../components/teetime/EnhancedCourse.vue";
import EnhancedBookingForm from "../components/teetime/EnhancedBookingFormFixed.vue";
import dayjs from "dayjs";
import Payment from "components/payment/initiate.vue";
import Confirmation from "components/teetime/Confirmation.vue";
import { useRecaptcha } from "../composables/useRecaptcha";

export default {
  name: "TeetimesNew",
  components: {
    EnhancedCourseComp,
    EnhancedBookingForm, 
    Confirmation,
    Payment,
  },
  setup() {
    const { withRecaptcha } = useRecaptcha();
    return { withRecaptcha };
  },
  props: {
    ProCourse: Object,
  },
  data() {
    return {
      step: 1,
      courses: [],
      locations: [],
      location: null,
      loading: false,
      holesArray: [
        {label: "9 Holes", value: 9},
        {label: "18 Holes", value: 18},
      ],
      perArray: [
        {label: "Hele dag", value: 1},
        {label: "Ochtend", value: 2},
        {label: "Middag", value: 3},
        {label: "Avond", value: 4},
      ],
      sizeArray: [
        {label: "1 speler", value: 1},
        {label: "2 spelers", value: 2},
        {label: "3 spelers", value: 3},
        {label: "4 spelers", value: 4},
      ],
      date: this.$dayjs().format("YYYY-MM-DD"),
      timeObject: null,
      timePrice: 0,
      size: 3,
      holes: {label: "9 Holes", value: 9},
      per: {label: "Hele dag", value: 1},
      flight: {
        fltDate: null,
        fltTime1: null,
        fltTime1Booked: null,
        fltCrlNr1: null,
        fltCrlNr2: null,
        fltSize: this.defaultSize || 1,
        flpName1: "",
        flpEmail1: null,
        flpPhone1: "",
        flpHandicap1: null,
        flpName2: "",
        flpEmail2: null,
        flpPhone2: "",
        flpHandicap2: null,
        flpName3: "",
        flpEmail3: null,
        flpPhone3: "",
        flpHandicap3: null,
        flpName4: "",
        flpEmail4: null,
        flpPhone4: "",
        flpHandicap4: null,
        agreeConditions: false,
        agreeCommerce: false,
        payMethod: 'iDeal'
      },
      maxHandicap: 54,
      maxTotalHandicap: 108,
      mollie: null,
      paymentOptions: [
        {label: "Betaal direct online en ontvang € 5 korting per persoon", value: "iDeal"},
        {label: "Op locatie", value: "onCourse"},
      ],
    };
  },
  async mounted() {
    await this.handleLoadLocations();
    this.flight.fltSize = this.defaultSize;
  },
  watch: {
    date: function () {
      this.handleLoadDate();
    },
    timeObject: function (newValue) {
      if (newValue !== null) {
        this.flight.fltDate = newValue.sttDate;
        this.flight.fltTime1 = newValue.sttTimeFrom;
        this.flight.fltTime1Booked = newValue.sttTimeFrom;
        this.flight.fltCrlNr1 = newValue.sttCrlNr;
        this.flight.fltCrlNr2 =
          this.holes.value === 18 ? newValue.sttCrlNrNext : null;
        this.step = 2;
      }
    },
    defaultSize: function (newVal) {
      if (newVal && this.flight.fltSize === 1) {
        this.flight.fltSize = newVal;
      }
    },
  },
  computed: {
    todayFormatted() {
      return this.$dayjs().format("YYYY-MM-DD");
    },
    maxDate() {
      return this.$dayjs().add(30, 'days').format("YYYY-MM-DD");
    },
    canGoPrevious() {
      return this.$dayjs(this.date).isAfter(this.$dayjs());
    },
    canGoNext() {
      return this.$dayjs(this.date).isBefore(this.$dayjs().add(30, 'days'));
    },
    maxFlightHandicap() {
      let maxSizeHcp = this.size * this.maxHandicap;
      return maxSizeHcp < this.maxTotalHandicap
        ? maxSizeHcp
        : this.maxTotalHandicap;
    },
    dayjs() {
      return dayjs;
    },
    conditions: function () {
      return this.$store.state.settings.publicItems.website_payment_conditions;
    },
    mergeText: function () {
      return this.$store.state.settings.publicItems.website_flight_merge_text;
    },
    defaultSize() {
      return this.$store.getters["settings/publicItems"].planner_default_reservation_count || 2;
    },
    displayMaxHandicap() {
      return this.$store.getters['settings/showMaxHandicap'];
    },
    hasWebsiteBookingText() {
      return this.$store.getters['settings/hasWebsiteBookingText'];
    },
    valid: function () {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return (
        this.flight.flpName1.length > 3 &&
        this.flight.flpPhone1.length > 7 &&
        (!this.hasPayOption || this.flight.agreeConditions) &&
        emailPattern.test(this.flight.flpEmail1) &&
        this.validHcp
      );
    },
    hasTimes: function () {
      return (
        this.courses.filter((course) => {
          return Object.keys(course.times).length > 0;
        }).length > 0
      );
    },
    flightPrice: function () {
      return Math.round(this.timePrice * 100) / 100;
    },
    totalHandicap() {
      let hcp = parseFloat(this.flight.flpHandicap1);
      hcp +=
        parseInt(this.flight.fltSize) > 1
          ? parseFloat(this.flight.flpHandicap2)
          : 0;
      hcp +=
        parseInt(this.flight.fltSize) > 2
          ? parseFloat(this.flight.flpHandicap3)
          : 0;
      hcp +=
        parseInt(this.flight.fltSize) > 3
          ? parseFloat(this.flight.flpHandicap4)
          : 0;
      return hcp;
    },
    validHcp() {
      return this.totalHandicap < this.maxTotalHandicap;
    },
    pay() {
      return (
        this.hasPayOption && this.flight.payMethod === 'iDeal'
      );
    },
    hasPayOption() {
      return this.$store.state.settings.publicItems.app_display_greenfee_pay == 1;
    }
  },
  methods: {
    async handleLoadLocations() {
      this.loading = true;
      
      try {
        this.locations = await this.$http.get("igg/locations");
        
        const locNr = this.$route.query.locNr;
        const foundLocation = locNr
          ? this.locations.find(loc => loc.locNr == locNr)
          : null;
        
        this.location = foundLocation || this.locations[0];
      } catch (error) {
        console.error("Fout bij laden van locaties:", error);
        // Enhanced fallback with better UX
        this.locations = [];
        this.location = { locNr: 1, locName: "Standaard Locatie" };
      } finally {
        this.loading = false;
      }
    },
    
    async handleLoadDate() {
      this.courses = [];
      this.loading = true;
      
      try {
        let data = {
          params: {
            date: this.date,
            locNr: this.location.locNr
          }
        }
        let res = await this.$http.get("igg", data);
        this.courses = res.payload;
      } catch (error) {
        console.error("Fout bij laden van tijden:", error);
        this.courses = [];
      } finally {
        this.loading = false;
      }
    },
    
    setDay: function (value) {
      const newDate = this.$dayjs(this.date).add(value, "days");
      
      // Check bounds
      if (value < 0 && !this.canGoPrevious) return;
      if (value > 0 && !this.canGoNext) return;
      
      this.date = newDate.format("YYYY-MM-DD");
    },
    
    async handleSave() {
      // Add reCAPTCHA protection
      const formWithCaptcha = await this.withRecaptcha(this.flight, "reservation");
      
      try {
        const res = await this.$http.post("igg/guest", formWithCaptcha);
        
        if (res.data.mollie) {
          window.location.href = res.data.mollie.url;
        } else if (res.data.redirect.length > 0) {
          window.location = res.data.redirect;
        } else {
          this.step = 4;
        }
      } catch (error) {
        console.error("Reservering mislukt:", error);
        // Show user-friendly error message
        this.$q.notify({
          type: 'negative',
          message: 'Reservering mislukt. Probeer het opnieuw.',
          timeout: 3000
        });
      }
    },
    
    onBack() {
      this.step = 1;
      this.timeObject = null;
      this.flight.fltTime1 = null;
      this.timePrice = 0;
      this.maxHandicap = 54;
      this.maxTotalHandicap = 108;
    },
    
    updateField(field, value) {
      this.flight[field] = value;
    },
    
    setTimeObject: function (obj) {
      this.timeObject = obj.time;
      this.timePrice = obj.price;
      this.maxHandicap = obj.course.crlMaxHandicap;
      this.maxTotalHandicap = obj.course.crlMaxTotalHandicap;

      if (this.maxHandicap == 90) {
        this.flight.flpHandicap1 = 54;
        this.flight.flpHandicap2 = 54;
        this.flight.flpHandicap3 = 54;
        this.flight.flpHandicap4 = 54;
      }
    },
    
    handleClosePayment: function (status) {
      if (status === "paid") {
        this.handleLoadDate();
        this.step = 1;
      } else {
        this.step = 2;
      }
      this.mollie = null;
    },
  },
};
</script>

<style scoped>
.q-page {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 50%, #fff5f5 100%);
  min-height: 100vh;
}

.enhanced-time-card {
  transition: all 0.2s ease;
}

.enhanced-time-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.1);
}

.date-navigation {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
}

/* Light, fresh color overrides */
.text-primary {
  color: #4CAF50 !important;
}

.course-header-card {
  background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
  border: 1px solid #c8e6c9;
  border-radius: 12px;
}

.course-header-text {
  color: #2e7d32;
  font-size: 0.95rem;
}

/* Info banner styling */
.bg-blue-1 {
  background: linear-gradient(135deg, #e3f2fd 0%, #f0f8ff 100%) !important;
  border: 1px solid #bbdefb !important;
  border-radius: 12px !important;
}

/* No times card styling */
.q-card.flat {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 1px solid #e9ecef;
  border-radius: 16px;
}
</style>