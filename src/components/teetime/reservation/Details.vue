<template>
  <q-banner
    v-if="
      $store.getters['settings/item'].app_display_booking_at_risk &&
      flight.booking_at_risk
    "
    class="text-white bg-red q-mb-md text-center"
    dense
  >
    Let op, u heeft tot {{ expire }} om uw boeking af te ronden?
  </q-banner>

  <q-card class="q-mb-md">
    <q-card-section class="text-h6">
      Uw starttijd

      <q-btn
        class="float-right"
        flat
        icon="arrow_back"
        v-on:click="$emit('handleClose')"
      />
    </q-card-section>

    <q-separator />

    <details-booking :flight="flight" />

    <q-item-label header>Deelnemers</q-item-label>

    <detail-players
      :flight="flight"
      v-on:handleRefresh="$emit('handleRefresh')"
      v-on:handleSave="handleSave"
    />

    <template
      v-if="
        $store.getters['settings/item'].app_display_rent &&
        flight.UniReservations.length > 0
      "
    >
      <q-item-label header>Verhuur</q-item-label>
      <rent :flight="flight" v-on:handleRefresh="$emit('handleRefresh')" />
    </template>
  </q-card>

  <q-card class="q-mb-md">
    <q-list bordered separator>
      <q-item
        v-if="freeSlots > 0 && isMyBooking && !inThePast"
        v-ripple
        clickable
        v-on:click="handleAddPlayer"
      >
        <q-item-section side>
          <q-icon name="person_add" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <b>Voeg speler toe</b>
          </q-item-label>
          <q-item-label caption>
            nog {{ freeSlots }} plaatsen beschikbaar
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-if="
          $store.getters['settings/item'].app_display_rent &&
          isMyBooking &&
          !inThePast
        "
        v-ripple
        clickable
        v-on:click="handleAddRent"
      >
        <q-item-section side>
          <q-icon name="add" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <b>Voeg verhuur toe</b>
          </q-item-label>
          <q-item-label caption> reserveer een handicap of buggy</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-if="
          $store.getters['settings/item'].app_display_chat &&
          isMyBooking &&
          !inThePast
        "
        v-ripple
        clickable
        v-on:click="showShareDialog"
      >
        <q-item-section side>
          <q-icon name="ios_share" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <b>Deel uw flight</b>
          </q-item-label>
          <q-item-label caption> deel je flight via chats</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-if="1 == 2 && !inThePast"
        v-ripple
        clickable
        v-on:click="getIcs"
      >
        <q-item-section side>
          <q-icon name="event" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <b>Voeg toe aan je agenda</b>
          </q-item-label>
          <q-item-label caption>via een ics link</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-if="showPay && canCancel && isMyBooking && !paid"
        v-ripple
        clickable
        v-on:click="onPay"
      >
        <q-item-section side>
          <q-icon name="payments" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <b>Betaal</b>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-if="
          !inThePast &&
          $store.state.currentUser.item.tile_teetimes_y_n &&
          $store.state.settings.item.teetime !== null &&
          $store.state.settings.item.teetime !== undefined &&
          $store.state.settings.item.teetime.flpFltNr === local_flight.fltNr &&
          ($store.state.settings.item.teetime.flpPrice === 0 ||
            $store.state.settings.item.teetime.flpPrice === null)
        "
        v-ripple
        clickable
        v-on:click="onCheckIn"
      >
        <q-item-section side>
          <q-icon
            :style="{ color: checkedIn ? 'green' : '' }"
            name="check_circle"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <b>Checkin</b>
          </q-item-label>
          <q-item-label v-if="checkedIn" caption
            >u bent ingechecked
          </q-item-label>
          <q-item-label v-else caption
            >check uzelf in voor deze flight
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        v-if="
          showSecondNine &&
          canCancel &&
          isMyBooking &&
          !paid &&
          !checkedIn &&
          flight.fltCrlNr2 === null
        "
        v-ripple
        clickable
        v-on:click="showDialogSecNine"
      >
        <q-item-section side>
          <q-icon name="counter_9" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <b>Boek 2de negen</b>
          </q-item-label>
        </q-item-section>
      </q-item>

      <details-menu-cancel-flight
        :canCancel="canCancel && !checkedIn"
        :cancelHours="cancelHours"
        :flight="flight"
        :isMyBooking="isMyBooking"
        :paid="paid"
        v-on:handleSave="handleSave"
      />

      <details-menu-cancel-player
        :canCancel="canCancel && !checkedIn"
        :cancelHours="cancelHours"
        :flight="flight"
        :isMyBooking="isMyBooking"
        :paid="paid"
        v-on:handleClose="$emit('handleClose')"
        v-on:handleSave="handleSave"
      />
    </q-list>

    <comp-dialog18-holes
      :dialogVisible="dialogVisible && !checkedIn"
      :flight="flight"
      v-on:handleClose="handleClose18"
    />
  </q-card>
</template>

<script>
import compDialog18Holes from "components/teetime/reservation/Dialog18Holes";
import authMixin from "../../../mixins/auth";
import Rent from "components/teetime/reservation/rent.vue";
import DetailsBooking from "components/teetime/reservation/DetailsBooking.vue";
import DetailPlayers from "components/teetime/reservation/detailPlayers.vue";
import DetailsMenuCancelFlight from "components/teetime/reservation/DetailsMenuCancelFlight.vue";
import DetailsMenuCancelPlayer from "components/teetime/reservation/DetailsMenuCancelPlayer.vue";

export default {
  mixins: [authMixin],
  components: {
    DetailsMenuCancelPlayer,
    DetailsMenuCancelFlight,
    DetailPlayers,
    DetailsBooking,
    Rent,
    compDialog18Holes,
  },
  props: {
    flight: Object,
  },
  data: function () {
    return {
      dialogVisible: false,
      showPay: 0,
      showSecondNine: 0,
      chatList: [],
      circleShare: null,
    };
  },
  mounted() {
    this.showPay = this.settings.app_display_greenfee_pay === "1";
    this.showSecondNine = this.settings.app_display_second_nine_select;
    this.getChats();
  },
  computed: {
    local_flight() {
      return this.flight;
    },
    playerArray: function () {
      return this.local_flight.flight_players.filter(
        (item) =>
          item.flpSide !== this.firstNr &&
          item.flpCarNr === null &&
          (this.isMyBooking || item.flpName !== null)
      );
    },
    players() {
      return this.playerArray.filter((item) => item.flpName !== "");
    },
    checkedIn() {
      return this.player.flpScorecard > 0;
    },
    freeSlots() {
      if (this.$store.state.settings.item.app_only_book_members === 1) {
        return (
          this.flight.startTime.sttMaxPlayers -
          this.playerArray.filter((item) => item.flpName !== "").length
        );
      }
      return (
        this.flight.startTime.sttMaxPlayers -
        this.playerArray.filter((item) => item.flpName !== "").length
      );
    },
    inThePast: function () {
      return this.$dayjs(
        this.$filters.unixToDate(this.local_flight.fltDate),
        "DD-MM-YYYY"
      )
        .add(this.local_flight.fltTime1, "minutes")
        .isBefore(this.$dayjs());
    },
    expire: function () {
      return this.$dayjs(this.flight.fltExpire).format("HH:mm");
    },
    cancelHours: function () {
      if (
        this.settings.planner_cancel_hours &&
        parseInt(this.settings.planner_cancel_hours) > 0
      ) {
        return parseInt(this.settings.planner_cancel_hours);
      }
      return 24;
    },
    canCancel: function () {
      return this.$dayjs(
        this.$filters.unixToDate(this.local_flight.fltDate),
        "DD-MM-YYYY"
      )
        .add(this.local_flight.fltTime1, "minutes")
        .isAfter(this.$dayjs().add(this.cancelHours * 60, "minutes"));
    },
    isMyBooking: function () {
      return (
        this.local_flight.flight_players[0].flpRelNr === this.currentUser.relNr
      );
    },
    player: function () {
      return this.local_flight.flight_players.find(
        (player) => player.flpRelNr === this.currentUser.relNr
      );
    },
    paid: function () {
      return (
        this.local_flight.flight_players.filter(
          (player) => player.flpBilNr > 0 || player.flpScorecard > 0
        ).length > 0
      );
    },
    chatCheckArray() {
      return this.chatList.map(function (item) {
        return {
          value: item.chtNr,
          label: item.chtName,
        };
      });
    },
  },
  methods: {
    handleCancel: function () {
      this.local_flight.fltCarNr = 1;
      this.$q
        .dialog({
          title: "Starttijd annuleren",
          message: "Wilt u doorgaan?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.$emit("handleSave", this.local_flight, true);
        });
    },
    handleSave: function (flight) {
      this.$emit("handleSave", flight);
    },
    onCheckIn() {
      if (!this.checkedIn) {
        this.$emit("handleCheckIn");
      }
    },
    onPay: function () {
      this.$http
        .get("golfer/pay", {
          params: {
            fltNr: this.flight.fltNr,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            window.location.href = res.url;
          }
        });
    },
    getIcs() {
      this.$q
        .dialog({
          title: "Voeg toe aan agenda",
          cancel: true,
          message:
            "Na het klikken op ok, kan uw browser het ICS-bestand automatisch openen of opslaan. " +
            "Als het bestand wordt opgeslagen, open het dan handmatig om het aan uw agenda toe te voegen",
        })
        .onOk((selectedChats) => {
          const res = this.getIcsFile();
          if (res) {
            const blob = new Blob([res], { type: "text/calendar" });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = "event.ics";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        });
    },
    async getIcsFile() {
      let data = { fltNr: this.local_flight.fltNr };
      return await this.$http.get("golfer/flight/ics", { params: data });
    },
    showShareDialog() {
      this.$q
        .dialog({
          title: "Selecteer Chat's",
          message: "Kies de chats waar u uw boeking wilt delen",
          cancel: true,
          options: {
            type: "checkbox", // Use checkboxes for multiple selection
            model: [], // An array to hold selected values
            items: this.chatCheckArray, // Array of chats
          },
        })
        .onOk((selectedChats) => {
          this.shareBooking(selectedChats);
        });
    },
    async getChats() {
      if (this.$store.getters["settings/item"].app_display_chat) {
        const res = await this.$http.get("chat/list?flat=true");
        this.chatList = res.data;
      }
    },
    shareBooking(selectedChats) {
      let data = {
        fltNr: this.local_flight.fltNr,
        cirArray: selectedChats,
      };
      this.$http.post("golfer/booking/share", data);
    },
    handleClose18: function (flight) {
      if (flight !== undefined) {
        this.local_flight = flight;
      }
      this.dialogVisible = false;
    },
    handleAddPlayer() {
      let player;
      if (this.$store.state.settings.item.app_only_book_members === 1) {
        const flpSide = this.flight.flight_players.reduce(
          (max, obj) => (obj.flpSide > max ? obj.flpSide : max),
          this.flight.flight_players[0].flpSide
        );

        player = {
          flpNr: null,
          flpFltNr: this.flight.fltNr,
          flpBilNr: null,
          flpCarNr: null,
          flpEmail: "",
          flpGrfNr: null,
          flpGsn: null,
          flpHandicap: null,
          flpIntro: null,
          flpName: "",
          flpPhone: "",
          flpPrice: null,
          flpRelNr: null,
          flpScorecard: null,
          flpSide: flpSide + 1,
        };
      } else {
        player = this.playerArray.find(
          (item) => item.flpRelNr === null && item.flpName === ""
        );
      }

      this.$emit("handleAddPlayer", player);
    },
    showDialogSecNine() {
      this.dialogVisible = true;
    },
    handleAddRent() {
      this.$emit("handleAddRent");
    },
  },
};
</script>
