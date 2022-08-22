<template>

  <div class="q-page q-pa-md">

    <q-card class="bg-green-6 text-white q-mb-md">

      <q-card-section class="text-h6">
        Algemeen
      </q-card-section>

      <q-separator inset/>

      <q-card-section>

        <div class="row">
          <div class="col text-bold">Slot</div>
          <div class="col-8 text-right">
            {{
              $dayjs($filters.unixToDate(local_flight.fltDate) + ' ' + $filters.minuteToTime(local_flight.fltTime1), 'DD-MM-YYYY H:mm').format('dddd D MMM HH:mm')
            }}
          </div>
        </div>

        <div class="row">
          <div class="col text-bold">Lus(sen)</div>
          <div class="col-8 text-right">{{ local_flight.loop1.crlName }}</div>
        </div>

        <div class="row">
          <div class="col text-bold">Boeker</div>
          <div class="col-8 text-right">
            {{ local_flight.flight_players[0].flpName }}
          </div>
        </div>

      </q-card-section>

      <q-separator inset v-if="myBooking"/>

      <q-card-section>

        <div v-if="myBooking" class="row q-gutter-md">
          <div class="col">
            <q-btn v-on:click="handleCancelFlight" outline class="full-width">Annuleer</q-btn>
          </div>
          <div class="col">
            <q-btn v-on:click="handleSaveFlight" outline class="full-width">Opslaan</q-btn>
          </div>
        </div>

      </q-card-section>

    </q-card>

    <q-card
        class="my-card bg-teal-1 q-pa-md q-mb-md"
        v-for="item in myBookingsArray"
        :key="item.key"
    >
      <div class="row">
        <div class="col text-h6">
          Speler {{ item.flpSide }}
        </div>
        <div
            class="col-2 text-right"
            v-if="
            item.flpNr != null &&
            item.flpName != null &&
            item.flpCarNr == null &&
            (myBooking || item.flpRelNr == currentUser.relNr)
          "
        >
          <q-icon
              class="fal fa-trash"
              v-on:click="handleCancelPlayer(item)"
          ></q-icon>
        </div>
      </div>

      <q-separator/>

      <q-select
          v-if="item.flpNr == 0 || item.flpName == null"
          label="Soort speler"
          v-model="item.flpTypeNw"
          :options="playerTypeArray"
          emit-value
          map-options
      ></q-select>

      <q-select
          v-if="item.flpTypeNw > 1"
          v-model="item.flpRelNr"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          label="Zoek relatie"
          :options="relations"
          option-value="relNr"
          option-label="full_name"
          @filter="filterFn"
          emit-value
          map-options
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results</q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-input v-if="item.flpTypeNw == 1" v-model="item.flpName" label="Naam"/>

      <q-input
          v-if="item.flpTypeNw == 1"
          v-model="item.flpEmail"
          label="E-mailadres"
      />

      <q-input
          v-if="item.flpName != null && item.flpTypeNw == undefined"
          :disable="item.flpRelNr > 0 || !myBooking"
          v-model="item.flpName"
          label="Naam"
      />

      <q-input
          v-if="
          item.flpType == 1 &&
          item.flpName != null &&
          item.flpTypeNw == undefined &&
          myBooking
        "
          v-model="item.flpEmail"
          label="E-mailadres"
      />
    </q-card>
  </div>
</template>

<script>
export default {
  props: {
    flight: Object,
  },
  data: function () {
    return {
      loading: false,
      relations: [],
      local_flight: this.flight,
      playerTypeArray: [
        {value: 1, label: "Gast"},
        {value: 2, label: "Relatie"},
        // {value: 3, label: 'Vriend'}
      ],
      currentUser: this.$ls.getItem("currentUser"),
    };
  },
  computed: {
    myBookingsArray: function () {
      return this.local_flight.flight_players.filter(
          (item) => item.flpCarNr == null && (this.myBooking || item.flpName != null)
      );
    },
    myBooking: function () {
      return this.flight.flight_players[0].flpRelNr == this.currentUser.relNr;
    },
  },
  methods: {
    handleSaveFlight: function (close) {
      let that = this;
      this.loading = false;
      this.$http.post(`golfer/flight/create`, this.local_flight).then((res) => {
        that.local_flight = res.data.flight;

        if (res.data.errors.length > 0) {
          that.$q
              .dialog({
                title: "Probleem gevonden!",
                message: res.data.errors[0],
                cancel: false,
                persistent: true,
              })
              .onOk(() => {
              });
        } else {
          that.$q
              .dialog({
                title: "Bevestiging",
                message:
                    "Uw wijzigingen zijn opgeslagen, wilt u de flight sluiten?",
                cancel: true,
                persistent: true,
              })
              .onOk(() => {
                that.$emit("handleClose");
              });
        }
      });
    },

    handleCancelFlight: function () {
      let that = this;

      this.$q
          .dialog({
            title: "Starttijd annuleren",
            message: "Uw starttijd wordt geannuleerd, wilt u doorgaan?",
            cancel: true,
            persistent: true,
          })
          .onOk(() => {
            this.loading = false;
            this.local_flight.fltCarNr = 1;
            this.$http
                .post(`golfer/flight/create`, this.local_flight)
                .then((res) => {
                  that.$emit("handleClose");
                });
          });
    },

    handleCancelPlayer: function (player) {
      let that = this;

      this.$q
          .dialog({
            title: "Speler annuleren",
            message: "U annuleert de deelname van deze speler, wilt u doorgaan?",
            cancel: true,
            persistent: true,
          })
          .onOk(() => {
            player.flpCarNr = 1;

            let name = player.flpName;

            let newPlayer = {
              flpNr: null,
              flpSide: player.flpSide,
              flpRelNr: null,
              flpName: null,
              flpEmail: "",
              flpHandicap: "",
              flpCarNr: null,
            };

            this.local_flight.flight_players.splice(
                player.flpSide - 1,
                0,
                newPlayer
            );

            that.$message.success("De deelname van " + name + " is geannuleerd");

            this.handleSaveFlight(false);
          });
    },

    async filterFn(val, update, abort) {
      if (val == undefined || val.length < 2) {
        return;
      }

      let that = this;
      await this.$http
          .get(`golfer/relation/0/search/${val}`)
          .then((response) => {
            update(() => {
              that.relations = response;
            });
          });
    },
  },
};
</script>
