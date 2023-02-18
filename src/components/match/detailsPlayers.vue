<template>
  <div v-if="match.players.length > 0">

    <div v-show="myPlayers.length > 0">
      <div class="row">
        <div class="col text-h6">Mijn deelnemers</div>
      </div>

      <q-separator/>

      <div class="row q-mt-sm q-mb-xs">
        <div class="col">
          Hieronder ziet u een overzicht van uw deelnemers. U kunt de inschrijving van deze deelnemers aanpassen.
        </div>
      </div>

      <div class="row q-pt-md">
        <div class="col">
          <q-list class="full-width" separator>
            <q-item
                clickable
                class="full-width shadow-1 q-mb-sm bg-green-1"
                v-ripple
                v-for="(player, index) in myPlayers"
                v-on:click="handleSubscribeGuest(player)"
                v-bind:key="index">

              <q-item-section>
                <q-item-label>
                  {{ player.relation.full_name2 }}
                </q-item-label>

                <q-item-label caption>
                  Hcp: {{ player.exactHandicapForMatch }}
                </q-item-label>
              </q-item-section>

              <q-item-section
                  v-if="match.StartlijstGereed == 1 && player.partyId > 0">

                <q-item-label class="text-right">
                  {{ $dayjs(player.match_party.match_flight.startingTime, "HH:mm:ss").format("HH:mm") }}
                </q-item-label>

                <q-item-label
                    class="text-right" caption>
                  Hole {{ player.match_party.match_flight.startingHoleNumber }}
                </q-item-label>
              </q-item-section>

              <q-item-section v-else-if="player.partyId == 0">
                <q-item-label class="text-right">
                  Reservelijst
                </q-item-label>
              </q-item-section>

              <q-item-section v-else>
                <q-item-label class="text-right">
                  Niet<br/>ingedeeld
                </q-item-label>
              </q-item-section>

            </q-item>
          </q-list>
        </div>
      </div>

    </div>

    <div class="row q-mt-md">
      <div class="col text-h6">Deelnemers</div>
    </div>

    <q-separator/>

    <div class="row q-pt-md">
      <div class="col">
        <q-list class="full-width" separator>
          <q-item
              clickable
              class="full-width shadow-1 q-mb-sm bg-blue-1"
              v-ripple
              v-for="(player, index) in players"
              v-on:click="handleSubscribeGuest(player)"
              v-bind:key="index">

            <q-item-section>
              <q-item-label>
                {{ player.relation.full_name2 }}
              </q-item-label>

              <q-item-label caption>
                Hcp: {{ player.exactHandicapForMatch }}
              </q-item-label>
            </q-item-section>

            <q-item-section
                v-if="match.StartlijstGereed == 1 && player.partyId > 0">

              <q-item-label class="text-right">
                {{ $dayjs(player.match_party.match_flight.startingTime, "HH:mm:ss").format("HH:mm") }}
              </q-item-label>

              <q-item-label
                  class="text-right" caption>
                Hole {{ player.match_party.match_flight.startingHoleNumber }}
              </q-item-label>
            </q-item-section>

            <q-item-section v-else>
              <q-item-label class="text-right">
                Niet<br/>ingedeeld
              </q-item-label>
            </q-item-section>

          </q-item>
        </q-list>
      </div>
    </div>

    <div v-show="reservePlayers.length > 0">
      <div class="row">
        <div class="col text-h6">Reservelijst</div>
      </div>

      <q-separator/>

      <div class="row q-pt-md">
        <div class="col">
          <q-list class="full-width" separator>
            <q-item
                clickable
                class="full-width shadow-1 q-mb-sm bg-orange-1"
                v-ripple
                v-for="(player, index) in reservePlayers"
                v-on:click="handleSubscribeGuest(player)"
                v-bind:key="index">

              <q-item-section>
                <q-item-label>
                  {{ player.relation.full_name2 }}
                </q-item-label>

                <q-item-label caption>
                  Hcp: {{ player.exactHandicapForMatch }}
                </q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-right">
                  Niet<br/>ingedeeld
                </q-item-label>
              </q-item-section>

            </q-item>
          </q-list>
        </div>
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
  computed: {
    myPlayers: function () {
      return this.match.players.filter(player =>
          this.match.InschrijvenInternet == 1 &&
          player.relation != null &&
          player.relNrDoor == this.currentUser.relNr);
//      return this.match.players.filter(player => player.relation != null && player.relNrDoor == this.currentUser.relNr);
    },
    players: function () {
//      return this.match.players.filter(player => player.relation != null && player.relNrDoor != this.currentUser.relNr && player.Status == 0);
      return this.match.players.filter(player =>
          (this.match.InschrijvenInternet == 0 || (player.relation != null && player.relNrDoor != this.currentUser.relNr))
          && player.Status == 0);
    },
    reservePlayers: function () {
//      return this.match.players.filter(player => player.relation != null && player.relNrDoor != this.currentUser.relNr && player.Status == 1);
      return []
      // this.match.players.filter(player =>
      //     (this.match.InschrijvenInternet == 0 || (player.relation != null && player.relNrDoor != this.currentUser.relNr))
      //     && player.Status == 1);
    }
  },
  methods: {
    handleSubscribeGuest: function (player) {

      if (this.match.StartlijstGereed == 1) {
        return;
      }

      if (player.relNr == this.currentUser.relNr) {
        this.$emit("handleSubscribe");
      } else if (
          player.relNrDoor == this.currentUser.relNr &&
          player.relNr != this.currentUser.relNr &&
          !player.relation.is_guest
      ) {
        this.$emit("handleSubscribeMember", player);
      } else if (
          player.relNrDoor == this.currentUser.relNr &&
          player.relNr != this.currentUser.relNr &&
          player.relation.is_guest
      ) {
        this.$emit("handleSubscribeGuest", player);
      }
    },
  },
};
</script>
