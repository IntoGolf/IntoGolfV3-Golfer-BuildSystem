<template>
  <div v-if="match.players.length > 0">
    <div v-show="myPlayers.length > 0">
      <div class="row">
        <div class="col text-h6">
          {{ isTeam ? "Mijn team" : "Mijn deelnemers" }}
        </div>
      </div>

      <q-separator/>

      <div class="row q-mt-sm q-mb-xs">
        <div class="col">
          Hieronder ziet u een overzicht van uw deelnemers. U kunt de
          inschrijving van deze deelnemers aanpassen.
        </div>
      </div>

      <div v-if="match.StartlijstGereed === 1">
        <div v-for="(flight, fKey) in myFlights"
             :key="fKey"
             class="row shadow-1 bg-green-1 q-mb-md">

          <div class="col q-pa-none">

            <div class="row text-bold q-pa-sm">
              <div class="col-6 ">
                Start {{ flight.startingTime }}
              </div>
              <div class="col-6 text-right">
                hole {{ flight.startingHoleNumber }}
              </div>
            </div>

            <q-separator class="q-ml-none q-mr-none" inset size="2px"/>

            <div v-for="(party, pKey) in flight.parties"
                 :key="pKey"
                 class="row">
              <div class="col">

                <div v-for="(player, key) in party.players"
                     :key="key"
                     class="row">
                  <div class="col-9 q-pa-sm">
                    {{ player.name }}
                  </div>
                  <div class="col-3 q-pa-sm text-right">
                    <span :style="{
                  backgroundColor: getBackgroundColor(player),
                  color: getColor(player),
                  borderRadius: '4px'
                }" class="q-pa-xs">
                      {{ player.exactHandicapForMatch }}
                    </span>
                  </div>
                </div>
                <q-separator class="q-ml-sm q-mr-sm"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-for="(player, index) in myPlayers"
             :key="index"
             class="row shadow-1 bg-green-1 q-mb-sm"
             v-on:click="handleSubscribeGuest(player)">

          <div class="col">

            <div v-if="showFlightHeader(index)" class="row q-pa-sm">
              <div class="col-6">
                Start: {{
                  $dayjs(
                    player.match_party.match_flight.startingTime,
                    "HH:mm:ss"
                  ).format("HH:mm")
                }}
              </div>
              <div class="col-6 text-right">
                Hole
                {{ player.match_party.match_flight.startingHoleNumber }}
              </div>
            </div>

            <q-separator v-show="showFlightHeader(index)"/>

            <div class="row q-pa-sm">
              <div class="col-9">
                {{ player.relation.full_name2 }}
                <span v-show="player.Description" class="text-italic"><br>{{ player.Description }} &nbsp;</span>
              </div>
              <div class="col-3 text-right">
                <span :style="{
                  backgroundColor: getBackgroundColor(player),
                  color: getColor(player),
                  borderRadius: '4px'
                }" class="q-pa-xs">
                  {{ player.exactHandicapForMatch }}
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>


    </div>

    <div class="row q-mt-md">
      <div class="col text-h6">Deelnemers</div>
    </div>

    <q-separator/>

    <div v-if="match.StartlijstGereed === 1">

      <div v-for="(flight, fKey) in match.flights"
           :key="fKey"
           class="row shadow-1 bg-blue-1 q-mb-md">

        <div class="col q-pa-none">

          <div class="row text-bold q-pa-sm">
            <div class="col-6 ">
              Start {{ flight.startingTime }}
            </div>
            <div class="col-6 text-right">
              hole {{ flight.startingHoleNumber }}
            </div>
          </div>

          <q-separator class="q-ml-none q-mr-none" inset size="2px"/>

          <div v-for="(party, pKey) in flight.parties"
               :key="pKey"
               class="row bg-blue-1">
            <div class="col">

              <div v-for="(player, key) in party.players"
                   :key="key"
                   class="row bg-blue-1 ">
                <div class="col-9 q-pa-sm">
                  {{ player.name }}
                </div>
                <div class="col-3 q-pa-sm text-right">
                  <span :style="{
                  backgroundColor: getBackgroundColor(player),
                  color: getColor(player),
                  borderRadius: '4px'
                }" class="q-pa-xs">
                    {{ player.exactHandicapForMatch }}
                  </span>
                </div>
              </div>
              <q-separator class="q-ml-sm q-mr-sm"/>

            </div>
          </div>
        </div>
      </div>


    </div>

    <div v-else>
      <div v-for="(player, index) in players"
           :key="index"
           :class="getPlayerClass(index)"
           class="row shadow-1 bg-blue-1 q-mb-sm"
           v-on:click="handleSubscribeGuest(player)">

        <div class="col">

          <div v-if="showFlightHeader(index)" class="row q-pa-sm">
            <div class="col-6">
              Start: {{
                $dayjs(
                  player.match_party.match_flight.startingTime,
                  "HH:mm:ss"
                ).format("HH:mm")
              }}
            </div>
            <div class="col-6 text-right">
              Hole
              {{ player.match_party.match_flight.startingHoleNumber }}
            </div>
          </div>

          <q-separator v-show="showFlightHeader(index)"/>

          <div class="row q-pa-sm">
            <div class="col-9">
              {{ player.relation.full_name2 }}
              <span v-show="player.Description" class="text-italic"><br>{{ player.Description }} &nbsp;</span>
            </div>
            <div class="col-3 text-right">
              <span :style="{
                  backgroundColor: getBackgroundColor(player),
                  color: getColor(player),
                  borderRadius: '4px'
                }" class="q-pa-xs">
                {{ player.exactHandicapForMatch }}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>

    <div v-show="reservePlayers.length > 0">
      <div class="row">
        <div class="col text-h6">Reservelijst</div>
      </div>

      <q-separator/>

      <div class="row q-pt-md">
        <div class="col">
          <q-list class="full-width">
            <q-item
              v-for="(player, index) in reservePlayers"
              v-bind:key="index"
              v-ripple
              class="full-width shadow-1 q-mb-sm bg-orange-1"
              clickable
              v-on:click="handleSubscribeGuest(player)"
            >
              <q-item-section>
                <q-item-label>
                  {{ player.relation.full_name2 }}
                </q-item-label>

                <q-item-label caption>
                  {{ player.Description }}
                </q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-right">
                  {{ player.exactHandicapForMatch }} /
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
import authMixin from "../../mixins/auth";

export default {
  mixins: [authMixin],
  props: ["match"],
  data() {
    return {};
  },
  computed: {
    myFlights: function () {
      const relNrArray = this.myPlayers.map((player) => player.relNr);
      return this.match.flights.filter((flight) => {
        return flight.parties.some((party) => {
          return party.players.some((player) => relNrArray.includes(player.relNr));
        });
      });
    },
    myPlayers: function () {
      return this.match.players.filter(
        (player) =>
          this.match.InschrijvenInternet === 1 &&
          player.relation !== null &&
          player.relNrDoor === this.currentUser.relNr
      );
    },
    players: function () {
      let result = this.match.players.filter(
        (player) =>
          (this.match.InschrijvenInternet === 0 ||
            (player.relation !== null &&
              player.relNrDoor !== this.currentUser.relNr)) &&
          player.Status === 0
      );

      if (this.match.StartlijstGereed === 1) {
        result = this.match.players.filter((player) => player.partyId > 0);

        result.sort(function (a, b) {
          return (
            a.match_party.match_flight.flightNumber -
            b.match_party.match_flight.flightNumber
          );
        });
      } else {
        result.sort((a, b) =>
          a.relation.full_name2.localeCompare(b.relation.full_name2)
        );
      }

      return result;
    },
    reservePlayers: function () {
      return this.match.players.filter(
        (player) =>
          this.match.StartlijstGereed !== 1 &&
          player.relation !== null &&
          player.relNrDoor !== this.currentUser.relNr &&
          player.Status === 1
      );
    },
    isTeam: function () {
      return this.match.teamSize > 1 && this.match.teammatch === 1;
    },
  },
  methods: {
    getTee(teeId) {
      const tee = this.match.baan_lus.tees.find((item) => item.color === teeId);
      if (tee !== undefined) {
        return tee;
      }
      return null;
    },
    getBackgroundColor(player) {
      const tee = this.getTee(player.startingTeeId);
      if (tee !== null) {
        return tee.backgroundColor;
      }
      return "";
    },
    getColor(player) {
      const tee = this.getTee(player.startingTeeId);
      if (tee !== null) {
        return tee.fontColor;
      }
      return "";
    },
    hasTeamMembers: function (relNr) {
      if (!this.isTeam) {
        return false;
      }
      let team = this.match.players.filter(
        (player) => player.relNrDoor === this.currentUser.relNr
      );
      return relNr === this.currentUser.relNr && team.length > 1;
    },
    showFlightHeader(index) {
      if (this.match.StartlijstGereed !== 1 || this.players.length - 1 === index) {
        return false;
      }

      const player0 = this.players[index];

      if (player0.match_party === undefined ||
        player0.match_party.match_flight === undefined ||
        player0.match_party.match_flight.flightNumber === undefined) {
        return false;
      }

      return true;
    },
    getPlayerClass(index) {
      if (this.players.length - 1 === index) {
        return '';
      }
      const player0 = this.players[index];
      const player1 = this.players[index + 1];

      if (player0.match_party === undefined ||
        player0.match_party.match_flight === undefined ||
        player0.match_party.match_flight.flightNumber === undefined ||
        player1.match_party === undefined ||
        player1.match_party.match_flight === undefined ||
        player1.match_party.match_flight.flightNumber === undefined) {
        return '';
      }

      if (player0.match_party.match_flight.flightNumber === player1.match_party.match_flight.flightNumber &&
        player0.match_party.match_flight.partyNumber === player1.match_party.match_flight.partyNumber) {
        return '';
      }

      return 'q-mb-sm';
    },
    handleSubscribeGuest: function (player) {
      if (this.hasTeamMembers(player.relNr)) {
        return;
      }

      if (this.match.InschrijvenInternet === 0) {
        return;
      }

      if (this.match.StartlijstGereed === 1) {
        return;
      }

      if (this.match.UitslagenGereed === 1) {
        return;
      }

      if (
        this.$dayjs(this.match.subscriptionDeadline).isBefore(this.$dayjs())
      ) {
        return;
      }

      if (player.relNr === this.currentUser.relNr) {
        this.$emit("handleSubscribe");
      } else if (
        player.relNrDoor === this.currentUser.relNr &&
        player.relNr !== this.currentUser.relNr &&
        !player.relation.is_guest
      ) {
        this.$emit("handleSubscribeMember", player);
      } else if (
        player.relNrDoor === this.currentUser.relNr &&
        player.relNr !== this.currentUser.relNr &&
        player.relation.is_guest
      ) {
        this.$emit("handleSubscribeGuest", player);
      }
    },
  },
};
</script>

<style>

</style>
