<template>
  <q-page-container>
    <List
      v-if="page === LIST"
      :array="array"
      v-on:handleClose="handleClose"
      v-on:handleOpenBooking="handleOpenBooking"
      v-on:handleOpenFlight="handleOpenFlight"
      v-on:loadReservationList="loadReservationList"
    />

    <Reservation
      v-if="page === RESERVATION"
      :flight="flight"
      v-on:handleClose="handleClose"
    />

    <Booking
      v-if="page === BOOKING"
      v-on:handleClose="handleClose"
      v-on:handleOpenFlight="handleOpenFlight"
      v-on:loadReservationList="loadReservationList"
    />
  </q-page-container>
</template>

<script>
import Reservation from "../components/teetime/Reservation";
import Booking from "../components/teetime/Booking";
import List from "../components/teetime/List";

export default {
  components: {
    Reservation,
    Booking,
    List,
  },
  data() {
    return {
      LIST: "list",
      RESERVATION: "reservation",
      BOOKING: "booking",
      array: [],

      page: null,
      loading: false,

      back_icon: "fa-home",
      back_link: "/",
      title: "Reserveringen",
      callBack: undefined,

      flight: null,
    };
  },
  created: function () {
    this.loadReservationList();
  },
  methods: {
    async loadReservationList() {
      this.loading = true;
      await this.$http.get("golfer/bookings").then((res) => {
        this.loading = false;
        this.array = res;

        if (this.$store.state.settings.fltNr > 0) {
          let flight = this.array.find(
            (item) => item.fltNr === this.$store.state.settings.fltNr
          );
          if (flight !== undefined) {
            this.handleOpenFlight(flight);
          }
        } else {
          this.page = this.LIST;
        }
      });
    },
    handleOpenFlight: function (flight) {
      this.$store.commit("settings/CLEAR_FLIGHT");
      this.back_icon = "fa-arrow-left";
      this.back_link = "/reservations";
      this.title = "Reservering";
      this.callBack = function () {
        this.$emit("handleClose");
      };

      flight.flight_players.forEach(function (player) {
        player.flpType = null;
        if (player.flpRelNr) {
          player.flpType = 2;
        } else if (player.flpName !== null) {
          player.flpType = 1;
        }
      });

      this.flight = flight;
      this.page = this.RESERVATION;
    },
    handleOpenBooking: function () {
      this.back_icon = "fa-arrow-left";
      this.back_link = "/reservations";
      this.title = "Boeking";
      this.callBack = function () {
        this.$emit("handleClose");
      };

      this.page = this.BOOKING;
    },
    handleClose: function () {
      this.back_icon = "fa-home";
      this.back_link = "/";
      this.title = "Reserveringen";
      this.callBack = undefined;

      this.flight = null;

      this.page = this.LIST;
      this.loadReservationList();
    },
  },
};
</script>
