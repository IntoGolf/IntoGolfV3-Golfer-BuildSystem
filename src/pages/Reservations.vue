<template>
  <q-page-container>

<!--    <top-bar-->
<!--      v-bind:title="title"-->
<!--      v-bind:back_icon="back_icon"-->
<!--      v-bind:back_link="back_link"-->
<!--      v-bind:callBack="callBack"-->
<!--      v-on:handleClose="handleClose"-->
<!--    />-->

    <List
      v-if="page == LIST"
      v-on:handleClose="handleClose"
      v-on:handleOpenFlight="handleOpenFlight"
      v-on:handleOpenBooking="handleOpenBooking"
    />

    <Reservation
      v-if="page == RESERVATION"
      :flight="flight"
      v-on:handleClose="handleClose"
    />

    <Booking
      v-if="page == BOOKING"
      v-on:handleClose="handleClose"
      v-on:handleOpenFlight="handleOpenFlight"
    />
  </q-page-container>
</template>

<script>
// import TopBar from "../components/TopBar";
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
    this.page = this.LIST;
  },
  methods: {
    handleOpenFlight: function (flight) {
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
        } else if (player.flpName != null) {
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
    },
  },
};
</script>
