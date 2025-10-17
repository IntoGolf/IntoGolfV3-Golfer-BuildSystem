<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">
        Open Bookings
      </div>
      <q-btn
        :loading="loading"
        dense
        flat
        icon="refresh"
        round
        @click="loadOpenBookings"
      />
    </div>

    <!-- Info text -->
    <div class="text-body2 text-grey-6 q-mb-md">
      Starttijden die open staan voor andere spelers om bij aan te sluiten
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center q-pa-md">
      <q-spinner color="primary" size="2em"/>
    </div>

    <!-- Open booking flights list -->
    <div v-else-if="openBookings.length > 0">
      <q-list separator>
        <q-item
          v-for="(flight, index) in openBookings"
          :key="index"
          v-ripple="!cannotJoin(flight)"
          :class="[
            'full-width shadow-1 q-mb-sm',
            isMyBooking(flight) ? 'bg-orange-1 text-orange-8' :
            isAlreadyOnFlight(flight) ? 'bg-blue-1 text-blue-8' : 'bg-white'
          ]"
          :clickable="!cannotJoin(flight)"
          @click="!cannotJoin(flight) && handleJoinFlight(flight)"
        >
          <q-item-section>
            <q-item-label class="itg-text-overflow">
              <i class="far fa-calendar-alt mr-2"/>
              {{ $filters.unixToDate(flight.fltDate, "dddd DD-MM") }}
              - {{ $filters.minuteToTime(flight.fltTime1) }}
              <!-- Open booking indicator -->
              <q-icon
                class="q-ml-sm"
                color="green"
                name="lock_open"
                size="sm"
              >
                <q-tooltip class="bg-green">
                  Open voor aansluiting
                </q-tooltip>
              </q-icon>
            </q-item-label>

            <q-item-label caption>
              <i class="far fa-golf-club mr-2"/>
              {{ flight.loop1.crlName }}
              <span v-if="isMyBooking(flight)" class="text-orange q-ml-sm">
                • Mijn boeking
              </span>
              <span v-else-if="isAlreadyOnFlight(flight)" class="text-blue q-ml-sm">
                • U staat al op deze starttijd
              </span>
              <span v-else class="text-green q-ml-sm">
                • Geboekt door: {{ flight.booker_name }}
              </span>
            </q-item-label>

            <q-item-label caption class="q-mt-xs">
              <i class="far fa-users mr-2"/>
              {{ flight.current_players }} van {{ flight.fltSize }} spelers
              <span v-if="flight.available_spots > 0" class="text-positive q-ml-sm">
                • {{ flight.available_spots }} plekken vrij
              </span>
            </q-item-label>
          </q-item-section>

          <q-item-section avatar>
            <q-icon
              v-if="!cannotJoin(flight)"
              color="grey-5"
              name="chevron_right"
              size="24px"
            />
            <q-icon
              v-else-if="isMyBooking(flight)"
              color="orange"
              name="person"
              size="24px"
            />
            <q-icon
              v-else-if="isAlreadyOnFlight(flight)"
              color="blue"
              name="check_circle"
              size="24px"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- No open bookings state -->
    <div v-else class="text-center q-pa-md text-grey-6">
      <q-icon class="q-mb-md" name="lock_open" size="4em"/>
      <div>Geen open bookings beschikbaar</div>
      <div class="text-caption q-mb-md">Er zijn momenteel geen starttijden open voor aansluiting</div>
    </div>
  </q-page>
</template>

<script>
import {getCurrentInstance, onMounted, ref, watch} from 'vue'
import {useQuasar} from 'quasar'

export default {
  name: 'OpenBookings',
  setup() {
    const $q = useQuasar()
    const {proxy} = getCurrentInstance()

    const loading = ref(false)
    const openBookings = ref([])
    const userBookings = ref([])

    // Get current user from store
    const currentUser = proxy.$store.getters['currentUser/item']

    const loadUserBookings = async () => {
      try {
        const response = await proxy.$axios.get('golfer/bookings')
        userBookings.value = response || []
      } catch (error) {
        console.error('Error loading user bookings:', error)
      }
    }

    const loadOpenBookings = async () => {
      loading.value = true
      try {
        // Load both open bookings and user's own bookings
        const [openBookingsResponse] = await Promise.all([
          proxy.$axios.get('golfer/open-bookings'),
          loadUserBookings()
        ])
        openBookings.value = openBookingsResponse || []

        // Debug: log the structure to understand what data we have
        if (openBookings.value.length > 0) {
          console.log('Open booking sample:', openBookings.value[0])
          console.log('Available fields:', Object.keys(openBookings.value[0]))
        }

        // Debug: log user bookings
        if (userBookings.value.length > 0) {
          console.log('User bookings sample:', userBookings.value[0])
          console.log('User bookings count:', userBookings.value.length)
        }

        // Debug: log current user
        console.log('Current user:', currentUser)
      } catch (error) {
        console.error('Error loading open bookings:', error)
        $q.notify({
          type: 'negative',
          message: 'Fout bij laden van open bookings'
        })
      } finally {
        loading.value = false
      }
    }

    const isMyBooking = (flight) => {
      if (!currentUser) {
        return false
      }

      if (userBookings.value && userBookings.value.length > 0) {
        const isMyFlight = userBookings.value.some(userBooking => {
          // Match by flight number if available
          if (flight.fltNr && userBooking.fltNr) {
            return flight.fltNr === userBooking.fltNr && userBooking.flight_players[0].flpRelNr === currentUser.relNr
          }
        })
        return isMyFlight
      }
      return false
    }

    const isAlreadyOnFlight = (flight) => {
      if (!currentUser) return false

      // Method 1: Check if flight has flight_players array (detailed data)
      return userBookings.value.some(uFlight => uFlight.fltNr === flight.fltNr)

      // Method 2: For open bookings API, check if this matches any user booking
      // If user is on a flight, it shouldn't appear in open bookings, but let's be safe
      //return isMyBooking(flight) // If it's my booking, I'm definitely on it
    }

    const cannotJoin = (flight) => {
      // User cannot join if they are the booker OR already on the flight
      return isMyBooking(flight) || isAlreadyOnFlight(flight)
    }

    const handleJoinFlight = (flight) => {
      // Check if user cannot join
      if (isMyBooking(flight)) {
        $q.notify({
          type: 'warning',
          message: 'Dit is uw eigen boeking - u kunt zich niet aansluiten bij uw eigen starttijd'
        })
        return
      }

      if (isAlreadyOnFlight(flight)) {
        $q.notify({
          type: 'info',
          message: 'U staat al op deze starttijd'
        })
        return
      }

      // Check if there are available spots
      if (flight.available_spots <= 0) {
        $q.notify({
          type: 'negative',
          message: 'Deze starttijd is vol'
        })
        return
      }

      // Show confirmation dialog
      $q.dialog({
        title: 'Aansluiten bij starttijd',
        message: `Wilt u aansluiten bij de open booking van ${flight.booker_name}?`,
        persistent: true,
        ok: {
          label: 'Ja, aansluiten',
          color: 'primary'
        },
        cancel: {
          label: 'Annuleren',
          color: 'grey'
        }
      }).onOk(async () => {
        await joinOpenBooking(flight)
      })
    }

    const joinOpenBooking = async (flight) => {
      loading.value = true

      try {
        const data = {
          fltNr: flight.fltNr
        }

        await proxy.$axios.post("golfer/booking/join", data)

        $q.notify({
          type: 'positive',
          message: 'Succesvol aangesloten bij open booking',
          timeout: 2000
        })

        // Refresh the list to update availability
        await loadOpenBookings()

      } catch (error) {
        console.error('Error joining open booking:', error)
        $q.notify({
          type: 'negative',
          message: 'Fout bij aansluiten bij open booking',
          timeout: 2000
        })
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadOpenBookings()
    })

    // Watch for changes in user bookings that might affect open bookings
    watch(() => proxy.$store.state.currentUser.item, () => {
      if (proxy.$store.state.currentUser.item) {
        loadOpenBookings()
      }
    }, { deep: true })

    return {
      loading,
      openBookings,
      userBookings,
      loadOpenBookings,
      handleJoinFlight,
      isMyBooking,
      isAlreadyOnFlight,
      cannotJoin
    }
  }
}
</script>

<style scoped>
.itg-text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
