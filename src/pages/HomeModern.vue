<template>
  <div class="golf-dashboard">
    <!-- Hero Section -->
    <div class="dashboard-hero">
      <div class="hero-content">
        <h1 class="hero-title">
          Goedemorgen, {{ userName }}
        </h1>
        <p class="hero-subtitle">
          Perfecte dag voor golf • {{ currentDate }} • {{ weather.condition }}
        </p>
        <div class="hero-actions">
          <q-btn
            v-if="usrHasTeeTimes"
            class="btn-golf-primary"
            icon="schedule"
            label="Boek Starttijd"
            @click="$router.push('/teetimes')"
          />
          <q-btn
            v-if="usrHasHandicap"
            class="btn-golf-outline"
            icon="trending_down"
            label="Score Invoeren"
            @click="$router.push('/handicap')"
          />
        </div>
      </div>
    </div>

    <q-page class="q-pa-md">
      <!-- Weather Card -->
      <div class="golf-card-modern weather-card q-mb-md" v-if="showWeather">
        <div class="card-header">
          <div class="card-icon">
            <q-icon :name="weather.icon" />
          </div>
          <div class="card-title">Weer Conditie</div>
          <div class="card-subtitle">{{ weather.location }}</div>
        </div>
        <div class="card-content">
          <div class="weather-display">
            <div>
              <div class="temp-large">{{ weather.temperature }}°</div>
              <div class="text-subtitle2">{{ weather.condition }}</div>
            </div>
            <q-icon :name="weather.icon" class="weather-icon" />
          </div>
          <div class="weather-details">
            <div class="detail-item">
              <div class="detail-value">{{ weather.windSpeed }}</div>
              <div class="detail-label">Wind km/h</div>
            </div>
            <div class="detail-item">
              <div class="detail-value">{{ weather.humidity }}%</div>
              <div class="detail-label">Vochtigheid</div>
            </div>
            <div class="detail-item">
              <div class="detail-value">{{ weather.visibility }}</div>
              <div class="detail-label">Zicht</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="stats-grid q-mb-md">
        <div class="stat-card" v-if="usrHasHandicap">
          <div class="stat-value">{{ currentUser.relHandicap || '0.0' }}</div>
          <div class="stat-label">Huidige HCP</div>
          <div class="stat-change positive">-0.3 deze maand</div>
        </div>
        <div class="stat-card" v-if="usrHasTeeTimes">
          <div class="stat-value">{{ bookingsArray.length }}</div>
          <div class="stat-label">Reserveringen</div>
          <div class="stat-change">Deze week</div>
        </div>
        <div class="stat-card" v-if="usrHasMatch">
          <div class="stat-value">3</div>
          <div class="stat-label">Wedstrijden</div>
          <div class="stat-change">Komende maand</div>
        </div>
      </div>

      <!-- Main Dashboard Grid -->
      <div class="row q-col-gutter-md">
        <!-- Left Column -->
        <div class="col-md-8 col-sm-12">
          <!-- Course Status -->
          <div class="golf-card-modern q-mb-md" v-if="setHasCourseStatus">
            <div class="card-header">
              <div class="card-icon">
                <q-icon name="golf_course" />
              </div>
              <div class="card-title">Baan Status</div>
              <div class="card-subtitle">Laatste update: {{ lastUpdate }}</div>
            </div>
            <div class="card-content">
              <div class="course-visual">
                <div class="holes-grid">
                  <div 
                    v-for="hole in holes" 
                    :key="hole.number"
                    class="hole-dot"
                    :class="hole.status"
                    @click="onHoleClick(hole)"
                  >
                    {{ hole.number }}
                  </div>
                </div>
                <div class="course-legend">
                  <div class="legend-item">
                    <div class="legend-dot" style="background: #4caf50;"></div>
                    <span>Open</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-dot" style="background: #ff9800;"></div>
                    <span>Druk</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-dot" style="background: #f44336;"></div>
                    <span>Gesloten</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Upcoming Bookings -->
          <div class="golf-card-modern booking-card q-mb-md" v-if="usrHasTeeTimes && bookingsArray.length > 0">
            <div class="card-header">
              <div class="card-icon">
                <q-icon name="schedule" />
              </div>
              <div class="card-title">Aankomende Reserveringen</div>
              <div class="card-subtitle">{{ bookingsArray.length }} geplande rondes</div>
            </div>
            <div class="card-content">
              <div 
                v-for="booking in bookingsArray.slice(0, 3)" 
                :key="booking.id"
                class="booking-item"
              >
                <div class="booking-time">
                  <div class="time-display">{{ formatTime(booking.time) }}</div>
                  <div class="date-display">{{ formatDate(booking.date) }}</div>
                </div>
                <div class="booking-details">
                  <div class="course-name">{{ booking.course || 'Hoofdbaan' }}</div>
                  <div class="booking-info">{{ booking.players }} spelers • {{ booking.holes }} holes</div>
                </div>
                <div class="booking-status">
                  <div class="status-chip confirmed">Bevestigd</div>
                </div>
              </div>
            </div>
            <div class="card-footer" v-if="bookingsArray.length > 3">
              <q-btn 
                flat 
                color="primary" 
                label="Bekijk alle reserveringen"
                @click="$router.push('/reservations')"
              />
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="col-md-4 col-sm-12">
          <!-- Handicap Display -->
          <div class="golf-card-modern handicap-card q-mb-md" v-if="usrHasHandicap">
            <div class="card-header">
              <div class="card-icon">
                <q-icon name="trending_down" />
              </div>
              <div class="card-title">Handicap Voortgang</div>
              <div class="card-subtitle">WHS Systeem</div>
            </div>
            <div class="card-content">
              <div class="handicap-display">
                <div class="handicap-number">{{ currentUser.relHandicap || '0.0' }}</div>
                <div class="handicap-trend improving">
                  <q-icon name="trending_down" />
                  <span>-0.3 deze maand</span>
                </div>
              </div>
              <q-linear-progress 
                value="0.7" 
                color="purple" 
                size="8px"
                class="q-mt-md"
              />
              <div class="text-caption text-center q-mt-xs">
                Voortgang naar single digit
              </div>
            </div>
            <div class="card-footer">
              <q-btn 
                flat 
                color="primary" 
                label="Score invoeren"
                icon="add"
                @click="$router.push('/handicap')"
              />
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="golf-card-modern q-mb-md">
            <div class="card-header">
              <div class="card-icon">
                <q-icon name="flash_on" />
              </div>
              <div class="card-title">Snelle Acties</div>
              <div class="card-subtitle">Veelgebruikte functies</div>
            </div>
            <div class="card-content">
              <div class="quick-actions-modern">
                <div class="action-button" @click="$router.push('/teetimes')" v-if="usrHasTeeTimes">
                  <div class="action-icon">
                    <q-icon name="schedule" />
                  </div>
                  <div class="action-label">Boek Tijd</div>
                </div>
                <div class="action-button" @click="$router.push('/match')" v-if="usrHasMatch">
                  <div class="action-icon">
                    <q-icon name="emoji_events" />
                  </div>
                  <div class="action-label">Wedstrijden</div>
                </div>
                <div class="action-button" @click="$router.push('/lessons')" v-if="usrHasLessons">
                  <div class="action-icon">
                    <q-icon name="school" />
                  </div>
                  <div class="action-label">Lessen</div>
                </div>
                <div class="action-button" @click="$router.push('/profile')">
                  <div class="action-icon">
                    <q-icon name="account_circle" />
                  </div>
                  <div class="action-label">Profiel</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Messages/Bills combined -->
          <div class="golf-card-modern" v-if="hasNotifications">
            <div class="card-header">
              <div class="card-icon">
                <q-icon name="notifications" />
              </div>
              <div class="card-title">Meldingen</div>
              <div class="card-subtitle">{{ totalNotifications }} nieuwe items</div>
            </div>
            <div class="card-content">
              <div v-if="hasBills" class="notification-item">
                <q-icon name="receipt" color="orange" />
                <div class="notification-content">
                  <div class="notification-title">Nieuwe rekening</div>
                  <div class="notification-subtitle">€ {{ latestBillAmount }}</div>
                </div>
                <q-btn flat round icon="chevron_right" size="sm" />
              </div>
              <div v-if="hasMessages" class="notification-item">
                <q-icon name="message" color="blue" />
                <div class="notification-content">
                  <div class="notification-title">{{ messagesCount }} nieuwe berichten</div>
                  <div class="notification-subtitle">Van secretariaat</div>
                </div>
                <q-btn flat round icon="chevron_right" size="sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import messages from "../components/dashboard/messages.vue";
import bookings from "../components/dashboard/bookings.vue";
import lessons from "../components/dashboard/lessons.vue";
import Match from "../components/dashboard/match.vue";
import Bills from "../components/dashboard/bills.vue";
import authMixin from "src/mixins/auth";
import {mapGetters} from "vuex";
import DashboardCourseStatus from "components/dashboard/status.vue";
import DashboardWhsStatus from "components/dashboard/whs.vue";

export default {
  mixins: [authMixin],
  components: {
    // DashboardWhsStatus,
    // DashboardCourseStatus,
    // Match,
    // messages,
    // bookings,
    // lessons,
    // Bills,
  },
  computed: {
    userName() {
      if (this.currentUser) {
        return this.currentUser.relCallName || this.currentUser.relFirstName || 'Golfer';
      }
      return 'Golfer';
    },
    currentDate() {
      return new Date().toLocaleDateString('nl-NL', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    },
    showWeather() {
      return true;
    },
    hasBills() {
      return this.billsArray && this.billsArray.length > 0;
    },
    billsCount() {
      return this.billsArray ? this.billsArray.length : 0;
    },
    hasMessages() {
      return this.messagesArray && this.messagesArray.length > 0;
    },
    messagesCount() {
      return this.messagesArray ? this.messagesArray.length : 0;
    },
    hasNotifications() {
      return this.hasBills || this.hasMessages;
    },
    totalNotifications() {
      return this.billsCount + this.messagesCount;
    },
    latestBillAmount() {
      if (this.billsArray && this.billsArray.length > 0) {
        return this.billsArray[0].amount || '0.00';
      }
      return '0.00';
    },
    lastUpdate() {
      return new Date().toLocaleTimeString('nl-NL', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    },
    ...mapGetters("settings", ["setHasMessages", "setHasCourseStatus"]),
    ...mapGetters("currentUser", [
      "usrHasLessons", 
      "usrHasTeeTimes", 
      "usrHasHandicap",
      "usrHasMatch",
      "item as currentUser"
    ]),
  },
  data() {
    return {
      bookingsArray: [],
      billsArray: [],
      messagesArray: [],
      weather: {
        temperature: 22,
        condition: 'Zonnig',
        icon: 'wb_sunny',
        windSpeed: 8,
        humidity: 65,
        visibility: 'Goed',
        location: 'Golf Club'
      },
      holes: [
        { number: 1, status: 'open' },
        { number: 2, status: 'open' },
        { number: 3, status: 'busy' },
        { number: 4, status: 'open' },
        { number: 5, status: 'closed' },
        { number: 6, status: 'open' },
        { number: 7, status: 'open' },
        { number: 8, status: 'open' },
        { number: 9, status: 'busy' }
      ]
    };
  },
  async mounted() {
    await this.$store.dispatch("settings/fetchSettings");
    await this.getBookings();
    await this.getBills();
    await this.getMessages();
  },
  methods: {
    async getBookings() {
      try {
        if (this.usrHasTeeTimes) {
          this.bookingsArray = await this.$http.get("golfer/bookings") || [];
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        // Mock data for demo
        this.bookingsArray = [
          {
            id: 1,
            time: '14:30',
            date: '2024-03-20',
            course: 'Hoofdbaan',
            players: 4,
            holes: 18
          },
          {
            id: 2,
            time: '09:00',
            date: '2024-03-22',
            course: 'Kort parcours',
            players: 2,
            holes: 9
          }
        ];
      }
    },
    async getBills() {
      try {
        if (this.usrHasTeeTimes) {
          this.billsArray = await this.$http.get("golfer/bills") || [];
        }
      } catch (error) {
        console.error('Error fetching bills:', error);
        this.billsArray = [];
      }
    },
    async getMessages() {
      try {
        if (this.setHasMessages) {
          this.messagesArray = await this.$http.get("golfer/messages") || [];
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        this.messagesArray = [];
      }
    },
    formatTime(time) {
      return time || '00:00';
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('nl-NL', { 
        day: 'numeric', 
        month: 'short' 
      });
    },
    onHoleClick(hole) {
      this.$q.notify({
        message: `Hole ${hole.number} is ${hole.status}`,
        color: hole.status === 'open' ? 'green' : hole.status === 'busy' ? 'orange' : 'red'
      });
    }
  },
};
</script>

<style scoped>
.notification-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-content {
  flex: 1;
  margin-left: 0.75rem;
}

.notification-title {
  font-weight: 500;
  color: #1a1a1a;
}

.notification-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 0.25rem;
}
</style>