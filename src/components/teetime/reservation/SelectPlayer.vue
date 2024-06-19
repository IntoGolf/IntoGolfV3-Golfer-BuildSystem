<template>
  <div>
    <q-card v-if="typePlayer === 0">
      <q-card-section class="text-h6">
        Voeg een speler toe
        <q-btn
          class="float-right"
          flat
          icon="arrow_back"
          v-on:click="handleClose"
        />
      </q-card-section>

      <q-separator />

      <q-list bordered separator>
        <q-item
          v-show="$store.state.settings.item.app_only_book_members !== 1"
          v-ripple
          clickable
          @click="typePlayer = 1"
        >
          <q-item-section>
            <q-item-label>
              <b>Bekende speler</b>
            </q-item-label>
            <q-item-label caption>
              spelers met wie je eerder hebt gespeeld
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="person" />
          </q-item-section>
        </q-item>
        <q-item v-ripple clickable @click="typePlayer = 2">
          <q-item-section>
            <q-item-label>
              <b>Locatie relaties</b>
            </q-item-label>
            <q-item-label caption>
              personen die hun gegevens hebben gedeeld
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="search" />
          </q-item-section>
        </q-item>
        <q-item
          v-show="$store.state.settings.item.app_only_book_members !== 1"
          v-ripple
          clickable
          @click="typePlayer = 3"
        >
          <q-item-section>
            <q-item-label>
              <b>Gast</b>
            </q-item-label>
            <q-item-label caption> voer een speler in als gast</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="add" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <q-card v-if="typePlayer === 1">
      <q-card-section class="text-h6">
        Spelers
        <q-btn
          class="float-right"
          flat
          icon="arrow_back"
          v-on:click="typePlayer = 0"
        />
      </q-card-section>
      <q-separator />
      <q-list bordered separator>
        <q-item
          v-for="(player, key) in knownPlayers"
          :key="key"
          v-ripple
          clickable
          @click="knownPlayer = player.flpName"
        >
          <q-item-section>
            <q-item-label>
              <b>{{ player.flpName }}</b>
            </q-item-label>
            <q-item-label caption>
              {{ player.flpEmail }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="person" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
    <q-card v-else-if="typePlayer === 2">
      <q-card-section class="text-h6">
        Relatie
        <q-btn
          class="float-right"
          flat
          icon="arrow_back"
          v-on:click="typePlayer = 0"
        />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-input
          v-model="relationSearch"
          label="Zoek in clubleden"
          @keyup.enter="handleSearch"
        >
          <template v-slot:append>
            <q-icon
              class="cursor-pointer"
              name="search"
              @click="handleSearch"
            />
          </template>
        </q-input>
      </q-card-section>
      <q-list bordered separator>
        <q-item
          v-for="(rel, key) in relations"
          :key="key"
          v-ripple
          clickable
          @click="relation = rel.relNr"
        >
          <q-item-section>
            <q-item-label>
              <b>{{ rel.full_name2 }}</b>
            </q-item-label>
            <q-item-label caption>
              handicap: {{ rel.relHandicap }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="person" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
    <q-card v-else-if="typePlayer === 3">
      <q-card-section class="text-h6">
        Gast
        <q-btn
          class="float-right"
          flat
          icon="arrow_back"
          v-on:click="typePlayer = 0"
        />
      </q-card-section>
      <q-separator />
      <q-card-section>
        <p>Voer de gegevens in van de gast die u wenst uit te nodigen.</p>
        <div class="q-gutter-y-md column">
          <q-input
            v-model="guest.flpName"
            clearable
            dense
            label="Naam*"
            outlined
          />
          <q-input
            v-model="guest.flpEmail"
            clearable
            dense
            label="E-mail"
            outlined
          />
          <q-input
            v-model="guest.flpPhone"
            clearable
            dense
            label="Telefoon"
            outlined
          />
          <q-input
            v-model="guest.flpHandicap"
            clearable
            dense
            label="Handicap*"
            outlined
          />
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-btn
          :disable="!validGuest"
          class="q-mr-md"
          color="primary"
          icon="save"
          label="Opslaan"
          v-on:click="handleSave"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  props: {
    flight: Object,
    player: Object,
  },
  data: function () {
    return {
      knownPlayerList: [],
      list: [],
      relations: [],
      knownPlayer: "",
      relation: "",
      relationSearch: "",
      guest: {
        flpName: "",
        flpEmail: "",
        flpPhone: "",
        flpHandicap: "",
      },
      filterVal: "",
      typePlayer: 0,
    };
  },
  watch: {
    knownPlayer: function (newValue) {
      this.knownPlayer = newValue === null ? "" : newValue;
      if (this.knownPlayer !== "") {
        this.handleSave();
      }
    },
    relation: function (newValue) {
      this.relation = newValue === null ? "" : newValue;
      if (this.knownPlayer !== null) {
        this.handleSave();
      }
    },
    guest: function (newValue) {
      this.guest = newValue === null ? "" : newValue;
    },
  },
  created() {
    this.handleLoad();
  },
  computed: {
    handicapGuestValid() {
      const stringValue = this.guest.flpHandicap.replace(",", ".");
      const value = parseFloat(stringValue);
      if (!isNaN(value) && value >= -9.9 && value <= 54.0) {
        const decimalCount = (stringValue.split(".")[1] || "").length;
        return decimalCount <= 1;
      } else {
        return false;
      }
    },
    validGuest() {
      return this.guest.flpName.length > 2 && this.handicapGuestValid;
    },
    currentPlayers() {
      return this.flight.flight_players.map((player) => player.flpName);
    },
    knownPlayers() {
      let currentPlayers = this.currentPlayers;
      return this.knownPlayerList.filter(
        (player) => !currentPlayers.includes(player.flpName)
      );
    },
  },
  methods: {
    handleClose() {
      this.$emit("handleCloseEditPlayer");
    },
    handleLoad: function () {
      let that = this;
      this.$http
        .get("golfer/knownPlayers?fltNr=" + this.flight.fltNr)
        .then((res) => {
          that.knownPlayerList = that.list = res;
        });
    },

    handleSave: function () {
      let local_flight = { ...this.flight };
      let player;
      if (this.player.flpNr === null) {
        player = this.player;
        local_flight.flight_players.push(player);
      } else {
        player = local_flight.flight_players.find(
          (item) => item.flpNr === this.player.flpNr
        );
      }

      if (this.knownPlayer) {
        let selectedPlayer = this.knownPlayerList.find(
          (item) => item.flpName === this.knownPlayer
        );
        player.flpName = selectedPlayer.flpName;
        player.flpHandicap = selectedPlayer.flpHandicap;
        player.flpGsn = selectedPlayer.flpGsn;
        player.flpEmail = selectedPlayer.flpEmail;
        player.flpPhone = selectedPlayer.flpPhone;
        player.flpRelNr = selectedPlayer.flpRelNr;
      } else if (this.guest.flpName.length > 0) {
        player.flpName = this.guest.flpName;
        player.flpEmail = this.guest.flpEmail;
        player.flpPhone = this.guest.flpPhone;
        player.flpHandicap = this.guest.flpHandicap;
      } else {
        let rel = this.relations.find((item) => item.relNr === this.relation);
        player.flpName = rel.full_name2;
        player.flpRelNr = this.relation;
        player.flpHandicap = this.relation.relHandicap;
      }

      if (player.flpHandicap > local_flight.crlMaxHandicap) {
        return this.$q.notify("Handicap niet toereikend");
      }

      this.$q
        .dialog({
          title: "Bevestiging toevoegen speler",
          message:
            'Je staat op het punt "' +
            player.flpName +
            '" toe te voegen aan je reservering. Weet je zeker dat je wilt doorgaan?',
          cancel: true,
        })
        .onOk(() => {
          this.$emit("handleSave", local_flight);
        });
    },
    async handleSearch() {
      if (this.relationSearch.length < 2) {
        return;
      }

      let fltNr = this.flight.fltNr;
      await this.$http
        .get(`golfer/relation?search=${this.relationSearch}&fltNr=${fltNr}`)
        .then((response) => {
          this.relations = response;
        });
    },
  },
};
</script>
