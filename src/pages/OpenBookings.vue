<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">
        Open Bookings
      </div>
      <q-btn
        flat
        round
        dense
        icon="refresh"
        @click="loadOpenBookings"
        :loading="loading"
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
          v-ripple
          class="full-width bg-white shadow-1 q-mb-sm"
          clickable
          @click="handleJoinFlight(flight)"
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
              <span class="text-green q-ml-sm">
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
            <q-icon name="chevron_right" color="grey-5" size="24px"/>
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
import { getCurrentInstance, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'

export default {
  name: 'OpenBookings',
  setup() {
    const $q = useQuasar()
    const { proxy } = getCurrentInstance()

    const loading = ref(false)
    const openBookings = ref([])

    const loadOpenBookings = async () => {
      loading.value = true
      try {
        const response = await proxy.$axios.get('golfer/open-bookings')
        openBookings.value = response || []
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

    const handleJoinFlight = (flight) => {
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

    return {
      loading,
      openBookings,
      loadOpenBookings,
      handleJoinFlight
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