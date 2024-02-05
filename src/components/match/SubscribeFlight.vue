<template>
  <q-list bordered separator>
    <q-item
      v-for="(flight, key) in match.flights"
      :key="key"
      v-ripple
      :class="
        flight.free && player.details.partyId !== flight.partyId
          ? 'bg-green-2'
          : 'bg-orange-2'
      "
      class="q-mb-sm"
      clickable
      @click="$emit('handleSetParty', flight)"
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
</template>
<script>
export default {
  props: {
    match: Object,
    player: Object,
    aSubscription: Object,
  },
  mounted() {
    console.log("a");
    console.log(this.player);
  },
};
</script>
