<template>
  <div>
    <p>
      Voor deze wedstrijd kunt u een flight kiezen waarop u wenst in te
      schrijven:
    </p>
    <q-list bordered separator style="max-height: 400px; overflow-y: scroll">
      <q-item
        v-for="(flight, key) in localMatch.flights"
        :key="key"
        v-ripple
        :class="getItemColor(flight)"
        class="q-mb-sm"
        clickable
        @click="onSetFlight(flight)"
      >
        <q-item-section>
          <q-item-label>
            <b
              >Flight {{ flight.flightNr }} side {{ flight.positionInFlight }}
            </b>
          </q-item-label>
          <q-item-label caption>
            {{ flight.playerName }}
          </q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-right">
            {{ flight.startingTime }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<script>
export default {
  props: {
    match: Object,
    player: Object,
    aSubscription: Object,
    currentUser: Object,
  },
  data() {
    return {
      localPlayer: this.player,
      localMatch: this.match,
    };
  },
  methods: {
    getItemColor(flight) {
      if (this.localPlayer.details.partyId !== flight.partyId && !flight.free) {
        return "bg-blue-2";
      } else if (
        this.localPlayer.details.partyId === flight.partyId &&
        !flight.free
      ) {
        return "bg-orange-2";
      }
      return "bg-green-2";
    },
    onSetFlight(flight) {
      if (!flight.free && flight.partyId !== this.localPlayer.details.partyId) {
      } else if (
        this.localPlayer.details.partyId > 0 &&
        flight.partyId === this.localPlayer.details.partyId
      ) {
        flight.free = true;
        flight.playerName = "Vrije plaats";
        this.localPlayer.details.partyId = null;
      } else if (
        this.localPlayer.details.partyId > 0 &&
        flight.partyId !== this.localPlayer.details.partyId
      ) {
        let oldFlight = this.localMatch.flights.find(
          (item) => item.partyId === this.localPlayer.details.partyId
        );
        oldFlight.free = true;
        oldFlight.playerName = "Vrije plaats";
        flight.free = false;
        //flight.playerName = this.currentUser.full_name2;
        this.localPlayer.details.partyId = flight.partyId;
        this.localPlayer.details.positionInParty = flight.positionInParty;
      } else if (this.localPlayer.details.partyId === null) {
        flight.free = false;
        this.localPlayer.details.partyId = flight.partyId;
        this.localPlayer.details.positionInParty = flight.positionInParty;
        //flight.playerName = this.currentUser.full_name2;
      }
    },
  },
};
</script>
