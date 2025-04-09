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

      <q-separator/>

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
            <q-icon name="person"/>
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
            <q-icon name="search"/>
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
            <q-icon name="add"/>
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
      <q-separator/>
      <q-list v-if="knownPlayers.length > 0" bordered separator>
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
            <q-icon name="person"/>
          </q-item-section>
        </q-item>
      </q-list>
      <div v-else class="q-pa-md">
        <div class="text-h6">Geen golfers gevonden!</div>
        <p>
          Er zijn nog geen golfers in je <i>"bekende spelers"</i> lijst. In deze
          lijst zie je golfers met wie je eerder een ronde hebt gespeeld.
        </p>
      </div>
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
      <q-separator/>
      <q-card-section>
        <q-input
          v-model="relationSearch"
          hint="Minimale lengte van naam is 2 karakters"
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
      <q-list v-if="relations.length > 0" bordered separator>
        <q-item
          v-for="(rel, key) in relations"
          :key="key"
          v-ripple
          :disable="rel.disabled.length > 0"
          clickable
          @click="relation = rel.relNr"
        >
          <q-item-section>
            <q-item-label>
              <b>{{ rel.full_name2 }}</b>
            </q-item-label>
            <q-item-label v-if="rel.disabled.length > 0" caption>
              {{ rel.disabled }}
            </q-item-label>
            <q-item-label v-else caption>
              handicap: {{ rel.relHandicap }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="person"/>
          </q-item-section>
        </q-item>
      </q-list>
      <div v-else-if="showEmptySearch" class="q-pa-md">
        <div class="text-h6">Geen golfers gevonden!</div>
        <p>Er zijn nog geen golfers gevonden met deze zoekcriteria.</p>
      </div>
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
      <q-separator/>
      <q-card-section>
        <p>Voer de gegevens in van de gast die u wenst uit te nodigen.</p>
        <div class="q-gutter-y-md column">
          <q-input
            v-model="guest.flpName"
            :rules="[(val) => (val && val.length > 0) || 'Geen geldige naam',]"
            clearable
            counter
            dense
            hint="Voer de naam van je gast in"
            label="Naam*"
            maxlength="32"
            outlined
          />
          <q-input
            v-model="guest.flpEmail"
            clearable
            dense
            hint="Voer het e-mailadres van je gast in"
            label="E-mail"
            lazy-rules
            outlined
          />
          <q-input
            v-model="guest.flpPhone"
            clearable
            counter
            dense
            hint="Telefoonnummer is niet verplicht"
            label="Telefoon"
            maxlength="12"
            outlined
          />
          <q-input
            v-model="guest.flpHandicap"
            :rules="[numberRule]"
            clearable
            dense
            hint="Voer de handicap van je gast in"
            label="Handicap*"
            lazy-rules
            outlined
          />
        </div>
      </q-card-section>
      <q-separator/>
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
      showEmptySearch: false,
      emailRule: (val) =>
        /.+@.+\..+/.test(val) || "Voer een geldig e-mailadres in",
      numberRule: (val) => {
        const num = parseFloat(val.replace(",", "."));
        return (
          (!isNaN(num) && num >= -9.9 && num <= 54) ||
          "Voer een geldig nummer in tussen -9,9 en 54"
        );
      },
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
    typePlayer() {
      this.relations = [];
      this.showEmptySearch = false;
      this.relationSearch = "";
      this.guest = {
        flpName: "",
        flpEmail: "",
        flpPhone: "",
        flpHandicap: "",
      };
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
      return this.flight.flight_players
        .filter((player) => player.flpName !== "" && player.flpCarNr === null)
        .map((player) => player.flpName);
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
      let local_flight = {...this.flight};
      let player;
      let newPlayer = false;
      if (this.player.flpNr === null) {
        player = this.player;
        newPlayer = true;
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
          if (newPlayer) {
            let key = local_flight.flight_players.findIndex(
              (item) => item.flpName === ""
            );
            if (key > 0) {
              player.flpNr = local_flight.flight_players[key].flpNr;
              local_flight.flight_players[key] = player;
            } else if (
              local_flight.freeSlots > 0
            ) {
              local_flight.flight_players.push(player);
            }
          }
          this.$emit("handleSave", local_flight);
        });
    },
    async handleSearch() {
      this.relations = [];
      if (this.relationSearch.length < 2) {
        return;
      }
      let data = {
        params: {fltNr: this.flight.fltNr, search: this.relationSearch},
      };
      this.relations = await this.$http.get(`golfer/relation`, data);
      this.showEmptySearch = this.relations.length === 0;
    },
  },
};
</script>
