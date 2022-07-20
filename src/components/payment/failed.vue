<template>
  <div class="reservation">
    <div class="container-fluid">
      <div class="align-items-center">
        <div
          class="step-reservation-success text-center mb-4 border rounded bg-white px-4 py-5"
        >
          <div class="">
            <div class="rounded-circle container-icon d-inline-block">
              <i class="icon text-danger far fa-times mr-2"></i>
            </div>
            <h3 class="mt-4 mb-2 text-danger">Reservation failed!</h3>
            <p class="mb-4 px-5 color-sub-title">
              Your reservation is payed failed
            </p>
            <button
              type="button"
              @click="goBackBooking"
              class="mt-5 btn btn-primary btn-block"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {};
  },
  created() {},
  methods: {
    goBackBooking() {
      this.$router.push("/booking");
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

  //.step-reservation-success {
  //  margin: 0 auto;
  //  box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.05);
  //  border-color: $border;
  //  width: 36rem;
  //  height: 35rem;
  //  padding-top: 40px;
  //}

  .container-icon {
    border-radius: 50%;
    width: 80px;
    height: 80px;
    background: #f391a3;

    .icon {
      font-size: 50px;
      margin-top: 19px;
      margin-left: 10px;
      color: #e63757;
    }
  }

  .other-btn {
    width: 48%;
  }
}
</style>
