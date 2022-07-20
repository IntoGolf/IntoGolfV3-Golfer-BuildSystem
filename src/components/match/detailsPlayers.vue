<template>
  <div v-if="match.players.length > 0">
    <div class="row">
      <div class="col text-h6">Deelnemers</div>
    </div>

    <q-separator />

    <div class="row q-pt-md">
      <div class="col">
        <q-list class="full-width" separator>
          <q-item
            clickable
            class="full-width shadow-1 q-mb-sm"
            :class="
              player.relNrDoor == currentUser.relNr &&
              player.relNr != currentUser.relNr
                ? 'bg-green-1'
                : 'bg-blue-1'
            "
            v-ripple
            v-for="(player, index) in match.players"
            v-on:click="handleSubscribeGuest(match)"
            v-bind:key="index"
          >
            <q-item-section>
              <q-item-label>
                {{ player.relation.full_name2 }}
              </q-item-label>

              <q-item-label caption>
                Hcp: {{ player.exactHandicapForMatch }}
              </q-item-label>
            </q-item-section>

            <q-item-section v-if="player.partyId > 0">
              <q-item-label class="text-right">
                {{ $dayjs(player.match_party.match_flight.startingTime, "HH:mm:ss").format("HH:mm") }}
              </q-item-label>

              <q-item-label class="text-right" caption>
                Hole {{ player.match_party.match_flight.startingHoleNumber }}
              </q-item-label>
            </q-item-section>

            <q-item-section v-else>
              <q-item-label class="text-right">
                Niet<br />ingedeeld
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["match", "currentUser"],
  data() {
    return {};
  },
  methods: {
    handleSubscribeGuest: function (player) {
      if (
        player.relNrDoor == this.currentUser.relNr &&
        player.relNr != this.currentUser.relNr &&
        player.relation.relGrpNr1 > 1
      ) {
        this.$emit("handleSubscribeMember", player);
      } else if (
        player.relNrDoor == this.currentUser.relNr &&
        player.relNr != this.currentUser.relNr &&
        player.relation.relGrpNr1 == null
      ) {
        this.$emit("handleSubscribeGuest", player);
      }
    },
  },
};
</script>
