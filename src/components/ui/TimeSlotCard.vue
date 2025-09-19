<template>
  <q-card 
    :class="timeSlotClass"
    class="time-slot-card"
    @click="onSelectTime"
  >
    <q-card-section class="text-center q-pa-sm">
      <div class="time-display">{{ formattedTime }}</div>
      <div class="players-indicator">
        <q-icon name="people" size="xs" />
        {{ availableSpots }}/{{ maxSpots }}
      </div>
      <q-linear-progress 
        :value="bookingProgress" 
        :color="progressColor"
        class="q-mt-xs"
        size="4px"
      />
      <div v-if="price" class="price-display q-mt-xs">
        € {{ price }}
      </div>
    </q-card-section>
    
    <!-- Status overlay for unavailable slots -->
    <div v-if="status === 'full'" class="status-overlay">
      <q-icon name="block" size="md" />
      <div class="text-caption">Vol</div>
    </div>
  </q-card>
</template>

<script>
export default {
  name: 'TimeSlotCard',
  props: {
    time: {
      type: String,
      required: true
    },
    availableSpots: {
      type: Number,
      default: 0
    },
    maxSpots: {
      type: Number,
      default: 4
    },
    status: {
      type: String,
      default: 'available', // available, busy, full
      validator: (value) => ['available', 'busy', 'full'].includes(value)
    },
    price: {
      type: Number,
      default: null
    }
  },
  computed: {
    formattedTime() {
      // Format time string for display
      return this.time;
    },
    bookingProgress() {
      return (this.maxSpots - this.availableSpots) / this.maxSpots;
    },
    progressColor() {
      if (this.status === 'available') return 'green';
      if (this.status === 'busy') return 'orange';
      return 'red';
    },
    timeSlotClass() {
      return {
        'time-slot-card': true,
        'available': this.status === 'available',
        'busy': this.status === 'busy',
        'full': this.status === 'full'
      };
    }
  },
  methods: {
    onSelectTime() {
      if (this.status !== 'full') {
        this.$emit('select-time', {
          time: this.time,
          availableSpots: this.availableSpots,
          maxSpots: this.maxSpots,
          status: this.status,
          price: this.price
        });
      }
    }
  }
};
</script>

<style scoped>
.status-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 12px;
}

.price-display {
  font-size: 0.9em;
  font-weight: 600;
  color: #2e7d32;
}
</style>