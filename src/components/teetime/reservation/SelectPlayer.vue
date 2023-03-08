<template>

  <q-card
      class="q-mb-md">

    <q-card-section class="text-h6">

      Vrije plaats

    </q-card-section>

    <q-separator/>

    <q-card-section>

      <p>Deze plaats is nog vrij in uw flight. U kunt een speler toevoegen met wie u de afgelopen 6 maanden heeft gespeeld.</p>

      <q-select
          class="q-mb-sm"
          label="Selecteer een bekende"
          v-model="knownPlayer"
          @update:model-value="knownPlayerList"
          :options="knownPlayerList"
          option-label="flpName"
          option-value="flpName"
          outlined emit-value map-options clearable
          :disable="guest != '' || relation != ''"/>

      <p>U kunt ook zoeken in het ledenbestand van uw club.</p>

      <q-select
          class="q-mb-sm"
          label="Zoek in clubleden"
          v-model="relation"
          outlined use-input hide-selected fill-input clearable
          input-debounce="0"
          :options="relations"
          option-value="relNr"
          option-label="full_name"
          @filter="filterFn"
          emit-value map-options
          :disable="guest != '' || knownPlayer != ''">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">No results</q-item-section>
          </q-item>
        </template>
      </q-select>

      <p>Of u voert de naam in van de gast die u wenst uit te nodigen.</p>
      <q-input
          label="Voer de naam van uw gast in"
          v-model="guest"
          outlined clearable
          :disable="knownPlayer != '' || relation != ''"/>

    </q-card-section>

    <q-separator/>

    <q-card-section>

      <q-btn
          :disable="knownPlayer == '' && relation == '' && guest == ''"
          class="q-mr-md"
          color="primary"
          label="Opslaan"
          v-on:click="handleSave"/>

    </q-card-section>

  </q-card>

</template>

<script>

export default {
  props: {
    flight: Object,
    player: Object
  },
  data: function () {
    return {
      knownPlayerList:[],
      relations: [],
      knownPlayer: '',
      relation: '',
      guest: ''
    };
  },
  watch: {
    knownPlayer: function(newValue) {
      this.knownPlayer = newValue == null ? '' : newValue;
    },
    relation: function(newValue) {
      this.relation = newValue == null ? '' : newValue;
    },
    guest: function(newValue) {
      this.guest = newValue == null ? '' : newValue;
    }
  },
  computed: {},
  created() {
    this.handleLoad();
  },
  methods: {
    handleLoad: function () {
      let that = this;
      this.$http.get("golfer/knownPlayers")
          .then((res) => {
            that.knownPlayerList = res;
          })
    },

    handleSave: function () {
      let local_flight = {...this.flight};
      let index = local_flight.flight_players.findIndex(player => player.flpNr == this.player.flpNr);

      if (this.knownPlayer) {
        let player = this.knownPlayerList.find(player => player.flpName == this.knownPlayer);
        local_flight.flight_players[index].flpName = player.flpName;
        local_flight.flight_players[index].flpHandicap = player.flpHandicap;
        local_flight.flight_players[index].flpGsn = player.flpGsn;
        local_flight.flight_players[index].flpEmail = player.flpEmail;
        local_flight.flight_players[index].flpPhone = player.flpPhone;
        local_flight.flight_players[index].flpRelNr = player.flpRelNr;
        this.$emit('handleSave', local_flight, false, -1);
      } else if (this.guest) {
        local_flight.flight_players[index].flpName = this.guest;
        this.$emit('handleSave', local_flight, false, index);
      } else {
        console.log(this.relation);
        local_flight.flight_players[index].flpRelNr = this.relation;
        this.$emit('handleSave', local_flight, false, -1);
      }
    },
    async filterFn(val, update, abort) {
      if (val == undefined || val.length < 2) {
        return;
      }

      let that = this;
      await this.$http.get(`golfer/relation/0/search/${val}`)
          .then((response) => {
            update(() => {
              that.relations = response;
            });
          });
    },
  }
};
</script>
