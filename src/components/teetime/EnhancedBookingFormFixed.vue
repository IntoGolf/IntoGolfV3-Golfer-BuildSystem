<template>
  <div class="enhanced-booking-form">
    <!-- Header with better visual hierarchy -->
    <div class="row q-mb-lg">
      <div class="col-12">
        <q-card flat class="bg-transparent">
          <q-card-section class="q-pa-none">
            <div class="row items-center q-mb-md">
              <div class="col-auto">
                <q-btn
                  icon="arrow_back"
                  color="primary"
                  flat
                  round
                  @click="$emit('onBack')"
                  size="md"
                >
                  <q-tooltip>Terug naar tijden</q-tooltip>
                </q-btn>
              </div>
              <div class="col">
                <h3 class="text-h4 q-ma-none q-ml-md text-weight-light">
                  <q-icon name="edit" class="q-mr-sm text-primary"/>
                  Jouw reservering
                </h3>
                <p class="text-grey-6 q-ma-none q-mt-xs q-ml-md">Vul je gegevens in om te reserveren</p>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Reservation Summary Card -->
    <div class="row q-mb-lg">
      <div class="col-12">
        <q-card class="reservation-summary-card">
          <q-card-section>
            <div class="text-h6 q-mb-md">
              <q-icon name="event" class="q-mr-sm text-primary"/>
              Reservering overzicht
            </div>
            
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-3">
                <div class="summary-item">
                  <q-icon name="today" color="primary" size="20px"/>
                  <div class="q-ml-sm">
                    <div class="text-caption text-grey-6">Datum</div>
                    <div class="text-weight-medium">
                      {{ $filters.capitalizeFirstLetter(dayjs(date).format("ddd DD MMM")) }}
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="col-6 col-md-3">
                <div class="summary-item">
                  <q-icon name="schedule" color="primary" size="20px"/>
                  <div class="q-ml-sm">
                    <div class="text-caption text-grey-6">Tijd</div>
                    <div class="text-weight-medium">
                      {{ $filters.minuteToTime(flight.fltTime1) }}
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="col-6 col-md-3">
                <div class="summary-item">
                  <q-icon name="people" color="primary" size="20px"/>
                  <div class="q-ml-sm">
                    <div class="text-caption text-grey-6">Spelers</div>
                    <div class="text-weight-medium">{{ flight.fltSize }}</div>
                  </div>
                </div>
              </div>
              
              <div class="col-6 col-md-3">
                <div class="summary-item">
                  <q-icon name="golf_course" color="primary" size="20px"/>
                  <div class="q-ml-sm">
                    <div class="text-caption text-grey-6">Holes</div>
                    <div class="text-weight-medium">{{ holes.value }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Price Display -->
            <div v-if="showPrice" class="q-mt-md q-pt-md" style="border-top: 1px solid #eee;">
              <div class="row items-center">
                <div class="col">
                  <span class="text-weight-medium">Te betalen:</span>
                </div>
                <div class="col-auto">
                  <div class="text-h6 text-primary text-weight-bold">
                    {{ $filters.money(flightPrice) }}
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Simple Form - emit events instead of direct mutation -->
    <div class="row">
      <div class="col-12">
        <q-form @submit.prevent="handleSubmit">
          
          <!-- Main Player (Player 1) -->
          <q-card class="q-mb-md">
            <q-card-section>
              <div class="text-h6 q-mb-md">
                <q-icon name="person" class="q-mr-sm text-primary"/>
                Hoofdspeler (jij)
              </div>
              
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input
                    :model-value="flight.flpName1"
                    @update:model-value="val => $emit('updateField', 'flpName1', val)"
                    label="Volledige naam *"
                    :rules="[(val) => !!val || 'Naam is verplicht']"
                    filled
                    dense
                  >
                    <template v-slot:prepend>
                      <q-icon name="badge"/>
                    </template>
                  </q-input>
                </div>
                
                <div class="col-md-6 col-12">
                  <q-input
                    :model-value="flight.flpEmail1"
                    @update:model-value="val => $emit('updateField', 'flpEmail1', val)"
                    label="E-mailadres *"
                    :rules="[emailRule]"
                    type="email"
                    filled
                    dense
                  >
                    <template v-slot:prepend>
                      <q-icon name="email"/>
                    </template>
                  </q-input>
                </div>
                
                <div class="col-md-4 col-8">
                  <q-input
                    :model-value="flight.flpPhone1"
                    @update:model-value="val => $emit('updateField', 'flpPhone1', val)"
                    label="Telefoon *"
                    :rules="[phoneRule]"
                    mask="###############"
                    maxlength="15"
                    filled
                    dense
                  >
                    <template v-slot:prepend>
                      <q-icon name="phone"/>
                    </template>
                  </q-input>
                </div>
                
                <div class="col-md-2 col-4">
                  <q-input
                    :model-value="flight.flpHandicap1"
                    @update:model-value="val => $emit('updateField', 'flpHandicap1', val)"
                    label="Handicap"
                    :rules="[handicapRule]"
                    mask="##.#"
                    reverse-fill-mask
                    filled
                    dense
                  >
                    <template v-slot:prepend>
                      <q-icon name="golf_course"/>
                    </template>
                  </q-input>
                </div>
              </div>
            </q-card-section>
          </q-card>
          
          <!-- Additional Players -->
          <q-card v-if="flight.fltSize >= 2" class="q-mb-md">
            <q-card-section>
              <div class="text-h6 q-mb-md">
                <q-icon name="group" class="q-mr-sm text-primary"/>
                Medespelers ({{ flight.fltSize - 1 }})
              </div>
              <p class="text-body2 text-grey-6 q-mb-md">
                Voer hier de naam en handicap van je medespelers in:
              </p>
              
              <!-- Player 2 -->
              <div v-if="flight.fltSize >= 2" class="player-section">
                <div class="text-subtitle2 q-mb-sm">
                  <q-icon name="person_outline" class="q-mr-xs"/>
                  Speler 2
                </div>
                <div class="row q-col-gutter-md q-mb-md">
                  <div class="col-md-8 col-12">
                    <q-input
                      :model-value="flight.flpName2"
                      @update:model-value="val => $emit('updateField', 'flpName2', val)"
                      label="Volledige naam *"
                      :rules="[(val) => !!val || 'Naam is verplicht']"
                      filled
                      dense
                    >
                      <template v-slot:prepend>
                        <q-icon name="badge"/>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-4 col-12">
                    <q-input
                      :model-value="flight.flpHandicap2"
                      @update:model-value="val => $emit('updateField', 'flpHandicap2', val)"
                      label="Handicap"
                      :rules="[handicapRule]"
                      mask="##.#"
                      reverse-fill-mask
                      filled
                      dense
                    >
                      <template v-slot:prepend>
                        <q-icon name="golf_course"/>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
              
              <!-- Player 3 -->
              <div v-if="flight.fltSize >= 3" class="player-section">
                <div class="text-subtitle2 q-mb-sm">
                  <q-icon name="person_outline" class="q-mr-xs"/>
                  Speler 3
                </div>
                <div class="row q-col-gutter-md q-mb-md">
                  <div class="col-md-8 col-12">
                    <q-input
                      :model-value="flight.flpName3"
                      @update:model-value="val => $emit('updateField', 'flpName3', val)"
                      label="Volledige naam *"
                      :rules="[(val) => !!val || 'Naam is verplicht']"
                      filled
                      dense
                    >
                      <template v-slot:prepend>
                        <q-icon name="badge"/>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-4 col-12">
                    <q-input
                      :model-value="flight.flpHandicap3"
                      @update:model-value="val => $emit('updateField', 'flpHandicap3', val)"
                      label="Handicap"
                      :rules="[handicapRule]"
                      mask="##.#"
                      reverse-fill-mask
                      filled
                      dense
                    >
                      <template v-slot:prepend>
                        <q-icon name="golf_course"/>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
              
              <!-- Player 4 -->
              <div v-if="flight.fltSize >= 4" class="player-section">
                <div class="text-subtitle2 q-mb-sm">
                  <q-icon name="person_outline" class="q-mr-xs"/>
                  Speler 4
                </div>
                <div class="row q-col-gutter-md">
                  <div class="col-md-8 col-12">
                    <q-input
                      :model-value="flight.flpName4"
                      @update:model-value="val => $emit('updateField', 'flpName4', val)"
                      label="Volledige naam *"
                      :rules="[(val) => !!val || 'Naam is verplicht']"
                      filled
                      dense
                    >
                      <template v-slot:prepend>
                        <q-icon name="badge"/>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-4 col-12">
                    <q-input
                      :model-value="flight.flpHandicap4"
                      @update:model-value="val => $emit('updateField', 'flpHandicap4', val)"
                      label="Handicap"
                      :rules="[handicapRule]"
                      mask="##.#"
                      reverse-fill-mask
                      filled
                      dense
                    >
                      <template v-slot:prepend>
                        <q-icon name="golf_course"/>
                      </template>
                    </q-input>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
          
          <!-- Action Buttons -->
          <div class="row q-col-gutter-md q-mt-lg">
            <div class="col-12">
              <div class="row justify-end q-col-gutter-sm">
                <div class="col-auto">
                  <q-btn
                    color="grey-6"
                    label="Terug"
                    icon="arrow_back"
                    @click="$emit('onBack')"
                    unelevated
                    size="lg"
                  />
                </div>
                <div class="col-auto">
                  <q-btn
                    :disable="!valid"
                    :color="valid ? 'primary' : 'grey-4'"
                    :label="pay ? 'Betaal nu' : 'Reserveren'"
                    :icon="pay ? 'payment' : 'book_online'"
                    @click="$emit('handleSave')"
                    unelevated
                    size="lg"
                    :loading="loading"
                  >
                    <template v-if="pay" v-slot:loading>
                      <q-spinner-hourglass class="on-left"/>
                      Betaling voorbereiden...
                    </template>
                    <template v-else v-slot:loading>
                      <q-spinner-dots class="on-left"/>
                      Reserveren...
                    </template>
                  </q-btn>
                </div>
              </div>
            </div>
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "EnhancedBookingFormFixed",
  emits: ['onBack', 'handleSave', 'updateField'],
  props: {
    flight: Object,
    date: String,
    holes: Object,
    flightPrice: Number,
    maxFlightHandicap: Number,
    maxHandicap: Number,
    displayMaxHandicap: Boolean,
    hasWebsiteBookingText: Boolean,
    hasPayOption: Boolean,
    conditions: String,
    paymentOptions: Array,
    valid: Boolean,
    pay: Boolean,
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    dayjs() {
      return dayjs;
    },
    showPrice() {
      return this.$store.state.settings.publicItems.app_display_greenfee_pay == 1;
    },
    emailRule() {
      return (val) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(val) || "Ongeldig e-mailadres";
      };
    },
    phoneRule() {
      return (val) => {
        return val.length > 8 || "Telefoonnummer moet minimaal 9 cijfers bevatten";
      };
    },
    handicapRule() {
      return (val) => {
        if (val === '' || val === null || val === undefined) return true; // Optional field
        const num = parseFloat(val);
        const maxHcp = this.maxHandicap || 54;
        return (num >= -9.9 && num <= maxHcp) || 
               `Handicap moet tussen -9.9 en ${maxHcp} liggen`;
      };
    }
  },
  methods: {
    handleSubmit() {
      this.loading = true;
      this.$emit('handleSave');
    }
  }
};
</script>

<style scoped>
.enhanced-booking-form {
  max-width: 800px;
  margin: 0 auto;
}

.reservation-summary-card {
  background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
  color: #2e7d32;
  border: 1px solid #c8e6c9;
  border-radius: 16px;
}

.reservation-summary-card .q-icon {
  color: #4CAF50 !important;
}

.summary-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.q-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
}

.q-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.1);
  border-color: #c8e6c9;
}

/* Light input styling */
.q-field--filled .q-field__control {
  background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
}

.q-field--filled .q-field__control:before {
  border-bottom: 1px solid #e0e0e0;
}

.q-field--filled.q-field--focused .q-field__control:before {
  border-bottom: 2px solid #4CAF50;
}

/* Fresh button styling */
.q-btn {
  border-radius: 8px;
}

.q-btn.bg-primary {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%) !important;
}

/* Player sections styling */
.player-section {
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 8px;
  padding-left: 8px;
  padding-right: 8px;
}

.player-section:last-child {
  border-bottom: none;
}
</style>