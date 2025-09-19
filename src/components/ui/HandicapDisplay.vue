<template>
  <q-card class="handicap-display-card">
    <q-card-section>
      <div class="handicap-header">
        <div class="handicap-value">
          <span class="current-handicap">{{ formattedHandicap }}</span>
          <span class="handicap-label">Current HCP</span>
        </div>
        <div class="handicap-trend">
          <q-icon 
            :name="trendIcon" 
            :color="trendColor" 
            size="md"
          />
          <span :class="`text-${trendColor}`">{{ trendValue }}</span>
        </div>
      </div>
      
      <!-- Progress indicator -->
      <div v-if="showProgress" class="handicap-progress q-mt-md">
        <div class="text-caption text-grey-6 q-mb-xs">
          Voortgang naar {{ targetHandicap }}
        </div>
        <q-linear-progress 
          :value="progressToTarget" 
          color="primary"
          size="8px"
          class="rounded-borders"
        />
      </div>
      
      <!-- Recent scores -->
      <div v-if="recentScores && recentScores.length > 0" class="recent-scores q-mt-md">
        <div class="text-subtitle2 q-mb-sm">Recente Scores</div>
        <div class="scores-grid">
          <div 
            v-for="score in displayScores" 
            :key="score.id"
            class="score-item"
          >
            <div class="score-date">{{ formatDate(score.date) }}</div>
            <q-chip 
              :color="getScoreColor(score.differential)" 
              text-color="white"
              size="sm"
            >
              {{ score.differential > 0 ? '+' : '' }}{{ score.differential }}
            </q-chip>
          </div>
        </div>
        
        <q-btn 
          v-if="recentScores.length > maxDisplayScores"
          flat 
          color="primary" 
          label="Toon meer" 
          size="sm"
          @click="$emit('show-all-scores')"
        />
      </div>

      <!-- Action buttons -->
      <div class="handicap-actions q-mt-md">
        <q-btn
          color="primary"
          icon="add"
          label="Score Invoeren"
          size="sm"
          @click="$emit('add-score')"
        />
        <q-btn
          flat
          color="primary"
          icon="trending_up"
          label="Analyse"
          size="sm"
          @click="$emit('view-analysis')"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'HandicapDisplay',
  props: {
    handicap: {
      type: Number,
      required: true
    },
    previousHandicap: {
      type: Number,
      default: null
    },
    targetHandicap: {
      type: Number,
      default: null
    },
    recentScores: {
      type: Array,
      default: () => []
    },
    showProgress: {
      type: Boolean,
      default: false
    },
    maxDisplayScores: {
      type: Number,
      default: 5
    }
  },
  computed: {
    formattedHandicap() {
      return this.handicap.toFixed(1);
    },
    trendIcon() {
      if (!this.previousHandicap) return 'trending_flat';
      
      if (this.handicap < this.previousHandicap) return 'trending_down';
      if (this.handicap > this.previousHandicap) return 'trending_up';
      return 'trending_flat';
    },
    trendColor() {
      if (!this.previousHandicap) return 'grey';
      
      if (this.handicap < this.previousHandicap) return 'green';
      if (this.handicap > this.previousHandicap) return 'red';
      return 'grey';
    },
    trendValue() {
      if (!this.previousHandicap) return '—';
      
      const diff = this.handicap - this.previousHandicap;
      return diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
    },
    progressToTarget() {
      if (!this.targetHandicap) return 0;
      
      const maxHandicap = Math.max(this.handicap, this.targetHandicap, 54);
      const progress = (maxHandicap - this.handicap) / (maxHandicap - this.targetHandicap);
      return Math.max(0, Math.min(1, progress));
    },
    displayScores() {
      return this.recentScores.slice(0, this.maxDisplayScores);
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('nl-NL', { 
        day: 'numeric', 
        month: 'short' 
      });
    },
    getScoreColor(differential) {
      if (differential <= -2) return 'green';
      if (differential <= 0) return 'light-green';
      if (differential <= 2) return 'orange';
      return 'red';
    }
  }
};
</script>

<style scoped>
.handicap-display-card {
  background: linear-gradient(135deg, #e3f2fd 0%, #f0f8ff 100%);
  border-left: 4px solid #2196f3;
}

.handicap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.handicap-value {
  text-align: left;
}

.current-handicap {
  font-size: 2.5em;
  font-weight: 700;
  color: #1976d2;
  display: block;
  line-height: 1;
}

.handicap-label {
  font-size: 0.9em;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.handicap-trend {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-direction: column;
  text-align: center;
}

.scores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  margin-bottom: 12px;
}

.score-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  font-size: 0.9em;
}

.score-date {
  color: #666;
  font-weight: 500;
}

.handicap-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.handicap-progress {
  .q-linear-progress {
    border-radius: 4px;
  }
}

@media (max-width: 600px) {
  .current-handicap {
    font-size: 2em;
  }
  
  .handicap-header {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .handicap-trend {
    flex-direction: row;
  }
  
  .scores-grid {
    grid-template-columns: 1fr;
  }
}
</style>