<template>
  <q-page class="q-pa-sm">
    <div class="row q-mb-sm">
      <div class="col">
        <q-btn
          class="full-width"
          color="primary"
          icon="add"
          label="Nieuwe starttijd"
          v-on:click="handleOpenNew"
        />
      </div>
    </div>

    <div class="row">
      <div class="col">
        <q-list v-if="array.length > 0" separator>
          <q-item
            v-for="(item, index) in array"
            v-bind:key="index"
            v-ripple
            class="full-width bg-white shadow-1 q-mb-sm"
            clickable
            v-on:click="handleOpenFlight(item)"
          >
            <q-item-section>
              <q-item-label class="itg-text-overflow">
                <i class="far fa-calendar-alt mr-2"/>
                {{ $filters.unixToDate(item.fltDate, "dddd DD-MM") }}
                {{}} -
                {{ $filters.minuteToTime(item.fltTime1) }}
                <!-- Friends sharing indicator -->
                <q-icon
                  v-if="item.fltFriendsYN"
                  class="q-ml-sm"
                  color="primary"
                  name="people"
                  size="sm"
                >
                  <q-tooltip class="bg-primary">
                    Gedeeld met vrienden
                  </q-tooltip>
                </q-icon>
              </q-item-label>

              <q-item-label caption>
                <!--                {{ item.flight_players.length }} golfers-->
                <i class="far fa-golf-club mr-2"/>
                {{ item.loop1.crlName }}
                <span v-if="item.fltFriendsYN && item.flight_players[0].flpRelNr == relNr" class="text-primary q-ml-sm">
                  • Zichtbaar voor vrienden
                </span>
                <span v-else class="text-primary q-ml-sm">
                  • Starttijd van: {{ item.flight_players[0].flpName }}
                </span>
              </q-item-label>
            </q-item-section>

            <q-item-section avatar> ></q-item-section>
          </q-item>
        </q-list>

        <q-banner v-else class="bg-orange-3 text-grey-8 text-bold text-center">
          U heeft geen reserveringen openstaan
        </q-banner>

        <!-- Divider for friends' tee times -->
        <div v-if="!loadingFriends" class="q-mt-lg">
          <q-separator/>
          <div class="text-h6 text-center q-py-md text-grey-7">
            <q-icon class="q-mr-sm" name="people"/>
            Starttijden van vrienden
          </div>

          <!-- Friends' tee times list -->
          <q-list v-if="friendsTeeTimes.length > 0" separator>
            <q-item
              v-for="(item, index) in friendsTeeTimes"
              v-bind:key="'friend-' + index"
              v-ripple
              class="full-width bg-blue-1 shadow-1 q-mb-sm"
              clickable
              v-on:click="handleOpenFriendFlight(item)"
            >
              <q-item-section>
                <q-item-label class="itg-text-overflow">
                  <i class="far fa-calendar-alt mr-2"/>
                  {{ $filters.unixToDate(item.fltDate, "dddd DD-MM") }}
                  {{}} -
                  {{ $filters.minuteToTime(item.fltTime1) }}
                  <!-- Friends sharing indicator -->
                  <q-icon
                    class="q-ml-sm"
                    color="primary"
                    name="people"
                    size="sm"
                  >
                    <q-tooltip class="bg-primary">
                      Gedeeld door vriend
                    </q-tooltip>
                  </q-icon>
                </q-item-label>

                <q-item-label caption>
                  <i class="far fa-golf-club mr-2"/>
                  {{ item.loop1.crlName }}
                  <span class="text-primary q-ml-sm">
                    • Door {{ item.friend_name }}
                  </span>
                </q-item-label>
              </q-item-section>

              <q-item-section avatar> ></q-item-section>
            </q-item>
          </q-list>

          <!-- No friends with shared tee times -->
          <q-banner v-else class="bg-blue-1 text-grey-8 text-center">
            Geen gedeelde starttijden van vrienden
          </q-banner>
        </div>

        <!-- Loading friends tee times -->
        <div v-if="loadingFriends" class="q-mt-lg">
          <q-separator/>
          <div class="text-center q-pa-md">
            <q-spinner color="primary" size="2em"/>
            <div class="q-mt-sm text-grey-6">Laden vrienden starttijden...</div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  props: {
    array: Array,
  },
  data() {
    return {
      loading: false,
      friendsTeeTimes: [],
      loadingFriends: false,
    };
  },
  async mounted() {
    await this.loadFriendsSharedTimes();
  },
  computed: {
    relNr() {
      return this.$store.getters['currentUser/item'].relNr;
    }
  },
  methods: {
    handleOpenFlight: function (flight) {
      this.$emit("handleOpenFlight", flight);
    },
    handleOpenNew: function () {
      this.$emit("handleOpenBooking");
    },
    async loadFriendsSharedTimes() {
      this.loadingFriends = true;
      try {
        const response = await this.$http.get('golfer/flight/friends-shared');
        this.friendsTeeTimes = response || [];
      } catch (error) {
        console.error('Error loading friends shared times:', error);
        this.friendsTeeTimes = [];
      } finally {
        this.loadingFriends = false;
      }
    },
    handleOpenFriendFlight: function (flight) {
      // Show confirmation dialog to join friend's flight
      this.$q.dialog({
        title: 'Aansluiten bij starttijd',
        message: `Wilt u aansluiten bij de starttijd van ${flight.friend_name}?`,
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
        await this.joinFriendFlight(flight);
      });
    },
    async joinFriendFlight(flight) {
      this.loading = true;

      try {
        const data = {
          fltNr: flight.fltNr
        };

        await this.$http.post("golfer/booking/join", data);

        this.$q.notify({
          type: 'positive',
          message: 'Succesvol aangesloten bij starttijd',
          timeout: 2000
        });

        // Refresh the reservation list
        this.$emit('loadReservationList');

        // Small delay to ensure database is updated, then refresh friends list
        setTimeout(async () => {
          await this.loadFriendsSharedTimes();

          let selectedFlight = this.array.find((item) => item.fltNr === flight.fltNr);
          if (selectedFlight) {
            this.$emit("handleOpenFlight", selectedFlight);
          }
        }, 1000);
      } catch (error) {
        console.error('Error joining friend flight:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Fout bij aansluiten bij starttijd',
          timeout: 2000
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
