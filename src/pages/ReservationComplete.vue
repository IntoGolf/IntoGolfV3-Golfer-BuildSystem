<template>
  <div class="reservation">
    <div class="container-fluid">
      <div class="row mb-5">
        <div
          class="step-reservation-success text-center m-auto box-border rounded bg-white p-4 col-lg-6 col-sm-8 col-10"
        >
          <div class="rounded-circle container-icon d-inline-block">
            <i class="icon text-success far fa-check mr-2"></i>
          </div>
          <h1 class="mt-4 mb-2 text-success">Reservation completed!</h1>
          <p class="mb-4 px-5 color-sub-title">
            Your reservation is payed and therefore completed. You and your
            fellow players will receive an email with all the details about how
            you can manage the reservation.
          </p>
          <p class="mb-4 color-sub-title px-5">
            If you want to create an account and save this reservation to your
            account, please create an account.
          </p>
          <button
            type="button"
            v-if="!isLogin()"
            @click="goSignUp"
            class="mt-5 btn btn-primary btn-block"
          >
            <i class="far fa-user-edit mr-2"></i>
            Create a new account
          </button>
          <button
            type="button"
            v-else
            @click="goHome"
            class="mt-5 btn btn-primary btn-block"
          >
            <i class="far fa-home mr-2"></i>
            Back to home
          </button>
          <div
            class="divider-line w-100 py-2 d-flex align-items-center color-sub-title"
          >
            <span class="d-inline-block rectangle"></span>
            <span class="d-inline-block flex-fill">Or</span>
            <span class="d-inline-block rectangle"></span>
          </div>
          <div class="d-flex justify-content-between">
            <!-- Button code -->
            <div
              v-if="!this.$q.platform.is.mobile"
              title="Add to Calendar"
              class="addeventatc btn btn-outline-primary btn-block other-btn"
            >
              <i class="far fa-calendar-plus mr-2"></i>Add to Calendar
              <span class="start">{{ calenderBookingInfo.start }}</span>
              <span class="end">{{ calenderBookingInfo.end }}</span>
              <span class="timezone">{{ calenderBookingInfo.timezone }}</span>
              <span class="title">{{ calenderBookingInfo.title }}</span>
              <span class="description">{{
                calenderBookingInfo.description
              }}</span>
              <span class="location">{{ calenderBookingInfo.location }}</span>
            </div>
            <!--              <button type="button" class="btn btn-outline-primary btn-block other-btn"><i class="far fa-calendar-plus mr-2"></i>Add-->
            <!--                to calendar-->
            <!--              </button>-->
            <button
              :class="{ 'other-btn': !this.$q.platform.is.mobile }"
              type="button"
              @click="onSendEmail"
              class="btn btn-outline-primary btn-block mt-0"
            >
              <i class="far fa-envelope mr-2"></i>Share via email
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import isLogin from "../mixins/auth";

export default {
  mixins: [isLogin],
  data: function () {
    return {
      calenderBookingInfo: {},
    };
  },
  created() {
    this.generateBookingInfo(this.$ls.getItem("bookingTeetime"));
    // https://www.addevent.com/documentation/add-to-calendar-button
    // console.log(window.addeventatc);
    setTimeout(function () {
      window.addeventatc.refresh();
    }, 200);
  },
  methods: {
    generateBookingInfo(bookingInfo) {
      this.calenderBookingInfo = {
        start:
          this.$dayjs(bookingInfo.date).format("DD-MM-YYYY") +
          " " +
          this.filters.minuteToTime(bookingInfo.time),
        end:
          this.$dayjs(bookingInfo.date).format("DD-MM-YYYY") +
          " " +
          this.filters.minuteToTime(bookingInfo.time),
        timezone: "Europe/Amsterdam",
        title: "Golf Booking",
        description: `Course: ${bookingInfo.course}; Players: ${bookingInfo.players}; Holes: ${bookingInfo.holes}`,
        location: `Course: ${bookingInfo.course};`,
      };
    },
    goSignUp() {
      this.$router.push("sign-up");
    },
    goHome() {
      this.$router.push("/");
    },
    onSendEmail() {
      let flightInfo = this.$ls.getItem("flightInfo");
      if (flightInfo) {
        this.$confirm("Are you sure send email", "Confirm", {
          confirmButtonText: "Ok",
          cancelButtonText: "Cancel",
          type: "warning",
        })
          .then(() => {
            this.$http.post("golfer/flight/send-email", {
                fltNr: flightInfo.flight.fltNr,
              })
              .then(function () {
                this.$message({
                  type: "success",
                  message: "Send email success",
                });
              });
          })
          .catch(() => {});
      } else {
        this.$message({
          type: "error",
          message: "Reservation is completed! please booking a new one",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../css/_variables";

.reservation {
  header {
    padding: 2.4rem 0;

    .logo-img {
      width: 2.5rem;
      height: 2.5rem;
    }
  }

  .step-reservation-success {
    box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.05);
  }

  .container-icon {
    border-radius: 50%;
    width: 80px;
    height: 80px;
    background: #ccf7e5;

    .icon {
      font-size: 50px;
      margin-top: 19px;
      margin-left: 10px;
    }
  }

  .other-btn {
    width: 48%;
  }

  .divider-line {
    .rectangle {
      width: 37%;
      height: 1px;
      background-color: #d2ddef;
      vertical-align: center;
    }
  }
}
</style>
