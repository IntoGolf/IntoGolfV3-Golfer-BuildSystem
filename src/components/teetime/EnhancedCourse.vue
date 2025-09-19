<template>
  <div class="enhanced-course-container">
    <div v-if="times.length === 0" class="text-center q-pa-lg text-grey-5">
      <q-icon name="schedule" size="40px" class="q-mb-sm"/>
      <div class="text-body2">Geen tijden beschikbaar</div>
    </div>
    
    <div v-else class="time-slots-container">
      <q-card
        v-for="(time, index) in times"
        :key="index"
        class="enhanced-time-card q-mb-sm cursor-pointer"
        :class="getTimeCardClass(time)"
        @click="selectTime(time)"
      >
        <q-card-section class="q-pa-md">
          <div class="row items-center">
            <!-- Time Display -->
            <div class="col-auto">
              <div class="time-display">
                <div class="text-h6 text-weight-bold">
                  {{ $filters.minuteToTime(time.sttTimeFrom) }}
                </div>
                <div class="text-caption text-grey-6">
                  {{ formatHoles(time) }}
                </div>
              </div>
            </div>
            
            <!-- Players Info -->
            <div class="col q-ml-md">
              <div class="row items-center">
                <q-icon 
                  name="people" 
                  :color="getPlayersIconColor(time)" 
                  class="q-mr-xs"
                  size="18px"
                />
                <span class="text-body2" :class="getPlayersTextClass(time)">
                  {{ getPlayersText(time) }}
                </span>
              </div>
              
              <!-- Player names if available -->
              <div v-if="time.players && time.players.length > 0" class="q-mt-xs">
                <div class="text-caption text-grey-6">
                  Met: {{ time.players.map(p => p.name).join(', ') }}
                </div>
              </div>
            </div>
            
            <!-- Price Display -->
            <div 
              v-if="shouldShowPrice && getPrice(time) > 0" 
              class="col-auto text-right"
            >
              <div class="price-display">
                <div class="text-weight-bold text-primary">
                  {{ $filters.money(getPrice(time)) }}
                </div>
                <div class="text-caption text-grey-6">
                  per persoon
                </div>
              </div>
            </div>
            
            <!-- Spacer for hover indicator -->
            <div class="col-auto q-ml-sm" style="width: 20px;">
            </div>
          </div>
          
          <!-- Additional info bar for popular times -->
          <div v-if="isPopularTime(time)" class="q-mt-sm">
            <q-chip 
              color="orange" 
              text-color="white" 
              size="sm" 
              icon="star"
              dense
            >
              Populair tijdstip
            </q-chip>
          </div>
        </q-card-section>
        
        <!-- Subtle hover indicator -->
        <div class="hover-indicator">
          <q-icon name="keyboard_arrow_right" size="20px"/>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "EnhancedCourse",
  props: {
    course: Object,
    holes: {
      type: Object,
      default: () => ({ value: 9, label: '9 Holes' })
    },
    size: {
      type: Number,
      default: 1
    },
    per: {
      type: Object, 
      default: () => ({ value: 1, label: 'Hele dag' })
    },
  },
  computed: {
    shouldShowPrice() {
      return this.$store.state.settings.publicItems.app_display_greenfee_pay == 1;
    },
    
    from() {
      let time = 240;
      if (this.per.value === 3) time = 720;
      else if (this.per.value === 4) time = 1080;
      return time;
    },
    
    to() {
      let time = 1439;
      if (this.per.value === 2) time = 720;
      else if (this.per.value === 3) time = 1080;
      return time;
    },
    
    times() {
      if (!this.course.times) return [];
      
      return Object.values(this.course.times).filter(time => {
        // Basic availability check
        const isValidHoles = (this.holes.value === 9) || 
                            (this.holes.value === 18 && time.sttCrlNrNext > 0);
        const hasCapacity = time.sttMaxPlayers >= this.size;
        const isInTimeRange = time.sttTimeFrom >= this.from && time.sttTimeFrom < this.to;
        
        return isValidHoles && hasCapacity && isInTimeRange;
      }).sort((a, b) => a.sttTimeFrom - b.sttTimeFrom);
    }
  },
  
  methods: {
    selectTime(time) {
      this.$emit("setTimeObject", {
        time: time,
        price: this.getPrice(time),
        course: this.course
      });
    },
    
    getPrice(time) {
      if (!this.shouldShowPrice) return 0;
      
      const priceArray = this.holes.value === 18 ? 
        time.greenFeePrice18 : 
        time.greenFeePrice9;
        
      if (priceArray && priceArray.length > 0) {
        return priceArray[0].price * this.size;
      }
      return 0;
    },
    
    formatHoles(time) {
      return `${this.holes.value} holes`;
    },
    
    getPlayersText(time) {
      const available = time.sttMaxPlayers - (time.playerCount || 0);
      
      if (available === time.sttMaxPlayers) {
        return `${time.sttMaxPlayers} plaatsen`;
      } else if (available > 0) {
        return `${available} van ${time.sttMaxPlayers} beschikbaar`;
      } else {
        return "Vol";
      }
    },
    
    getPlayersIconColor(time) {
      const available = time.sttMaxPlayers - (time.playerCount || 0);
      const percentage = available / time.sttMaxPlayers;
      
      if (percentage > 0.5) return "green";
      if (percentage > 0) return "orange";
      return "red";
    },
    
    getPlayersTextClass(time) {
      const available = time.sttMaxPlayers - (time.playerCount || 0);
      const percentage = available / time.sttMaxPlayers;
      
      if (percentage > 0.5) return "text-green";
      if (percentage > 0) return "text-orange";
      return "text-red";
    },
    
    getTimeCardClass(time) {
      const available = time.sttMaxPlayers - (time.playerCount || 0);
      
      if (available === 0) {
        return "time-card-full";
      } else if (available <= 1) {
        return "time-card-almost-full";
      } else {
        return "time-card-available";
      }
    },
    
    isPopularTime(time) {
      const hour = Math.floor(time.sttTimeFrom / 60);
      // Popular times: 9-11 AM and 2-4 PM
      return (hour >= 9 && hour <= 11) || (hour >= 14 && hour <= 16);
    }
  }
};
</script>

<style scoped>
.enhanced-course-container {
  position: relative;
}

.time-slots-container {
  max-height: 600px;
  overflow-y: auto;
}

.enhanced-time-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e3f2fd;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}

.enhanced-time-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.2);
  border-color: #4CAF50;
  background: linear-gradient(135deg, #f1f8e9 0%, #e8f5e8 100%) !important;
}

.enhanced-time-card.time-card-available {
  background: linear-gradient(135deg, #ffffff 0%, #f1f8e9 100%);
  border-color: #c8e6c9;
}

.enhanced-time-card.time-card-almost-full {
  background: linear-gradient(135deg, #fffde7 0%, #fff9c4 100%);
  border-color: #f9a825;
}

.enhanced-time-card.time-card-full {
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%);
  border-color: #f06292;
  opacity: 0.8;
  cursor: not-allowed;
}

.time-display .text-h6 {
  line-height: 1.2;
  font-family: 'Roboto', sans-serif;
  color: #2e7d32;
  font-weight: 600;
}

.price-display {
  text-align: right;
  min-width: 80px;
}

.hover-indicator {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  opacity: 0;
  transition: all 0.3s ease;
  color: #4CAF50;
}

.enhanced-time-card:hover .hover-indicator {
  opacity: 1;
  transform: translateY(-50%) translateX(-4px);
}

.enhanced-time-card.time-card-full:hover .hover-indicator {
  opacity: 0;
}

/* Custom scrollbar for better UX */
.time-slots-container::-webkit-scrollbar {
  width: 6px;
}

.time-slots-container::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

.time-slots-container::-webkit-scrollbar-thumb {
  background: #81C784;
  border-radius: 3px;
}

.time-slots-container::-webkit-scrollbar-thumb:hover {
  background: #66BB6A;
}

/* Light, fresh icons */
.q-icon {
  color: #4CAF50 !important;
}
</style>