<template>
  <q-card class="course-status-widget">
    <q-card-section>
      <div class="row items-center q-mb-md">
        <q-icon name="golf_course" size="md" color="green" />
        <span class="text-h6 q-ml-sm">{{ courseName || 'Baan Status' }}</span>
        <q-chip 
          :color="statusColor" 
          text-color="white" 
          class="q-ml-auto"
        >
          {{ statusLabel }}
        </q-chip>
      </div>
      
      <!-- Weather section -->
      <div v-if="showWeather" class="weather-section q-mb-md">
        <div class="row items-center">
          <q-icon :name="weatherIcon" size="sm" :color="weatherIconColor" />
          <span class="q-ml-sm text-weight-medium">{{ temperature }}°C</span>
          <span class="text-grey-6 q-ml-auto">{{ weatherCondition }}</span>
        </div>
        <div class="weather-details q-mt-xs">
          <span class="text-caption text-grey-6">
            Wind: {{ windSpeed }} km/h | Zicht: {{ visibility }}
          </span>
        </div>
      </div>
      
      <!-- Holes status grid -->
      <div v-if="holes && holes.length > 0" class="holes-section">
        <div class="text-subtitle2 q-mb-sm">Holes Status</div>
        <div class="holes-status-grid">
          <div 
            v-for="hole in holes" 
            :key="hole.number"
            class="hole-indicator"
            :class="getHoleStatusClass(hole.status)"
            @click="onHoleClick(hole)"
          >
            <span>{{ hole.number }}</span>
            <q-tooltip v-if="hole.note">{{ hole.note }}</q-tooltip>
          </div>
        </div>
      </div>

      <!-- Course conditions -->
      <div v-if="conditions && conditions.length > 0" class="conditions-section q-mt-md">
        <div class="text-subtitle2 q-mb-sm">Baancondities</div>
        <div class="conditions-list">
          <q-chip
            v-for="condition in conditions"
            :key="condition.id"
            :color="getConditionColor(condition.type)"
            text-color="white"
            size="sm"
            class="q-mr-xs q-mb-xs"
          >
            {{ condition.label }}
          </q-chip>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'CourseStatusWidget',
  props: {
    courseName: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'open', // open, busy, closed, maintenance
      validator: (value) => ['open', 'busy', 'closed', 'maintenance'].includes(value)
    },
    showWeather: {
      type: Boolean,
      default: true
    },
    weather: {
      type: Object,
      default: () => ({
        temperature: 22,
        condition: 'Zonnig',
        icon: 'wb_sunny',
        windSpeed: 5,
        visibility: 'Goed'
      })
    },
    holes: {
      type: Array,
      default: () => []
    },
    conditions: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    statusColor() {
      const colors = {
        open: 'green',
        busy: 'orange', 
        closed: 'red',
        maintenance: 'amber'
      };
      return colors[this.status] || 'grey';
    },
    statusLabel() {
      const labels = {
        open: 'Open',
        busy: 'Druk',
        closed: 'Gesloten',
        maintenance: 'Onderhoud'
      };
      return labels[this.status] || 'Onbekend';
    },
    weatherIcon() {
      return this.weather.icon || 'wb_sunny';
    },
    weatherIconColor() {
      const iconColors = {
        'wb_sunny': 'orange',
        'wb_cloudy': 'grey',
        'grain': 'blue',
        'ac_unit': 'light-blue'
      };
      return iconColors[this.weatherIcon] || 'grey';
    },
    temperature() {
      return this.weather.temperature || 0;
    },
    weatherCondition() {
      return this.weather.condition || '';
    },
    windSpeed() {
      return this.weather.windSpeed || 0;
    },
    visibility() {
      return this.weather.visibility || 'Onbekend';
    }
  },
  methods: {
    getHoleStatusClass(status) {
      return {
        'open': status === 'open',
        'maintenance': status === 'maintenance', 
        'closed': status === 'closed'
      };
    },
    getConditionColor(type) {
      const colors = {
        'good': 'green',
        'fair': 'orange',
        'poor': 'red',
        'wet': 'blue',
        'dry': 'amber'
      };
      return colors[type] || 'grey';
    },
    onHoleClick(hole) {
      this.$emit('hole-selected', hole);
    }
  }
};
</script>

<style scoped>
.course-status-widget {
  background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
  border-left: 4px solid #4caf50;
}

.weather-section {
  padding: 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
}

.weather-details {
  font-size: 0.85em;
}

.conditions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>