<template>
  <div class="message-dashboard bg-white box-border rounded box-show mt-3">
    <div
      class="d-flex message-title border-bottom golfer-border justify-content-between"
    >
      <h2 class="text-black text-weight m-0">Messages</h2>
      <p class="m-0 color-primary golfer-cursor">View all</p>
    </div>

    <transition name="el-fade-in-linear">
      <div class="message-request message-box" v-show="slideVisible">
        <p class="text-weight mb-2">John Doe sent you a friend request!</p>
        <div class="d-flex justify-content-between">
          <button type="button" class="btn btn-outline-success">Accept</button>
          <button
            type="button"
            class="btn btn-outline-danger"
            @click="slideVisible = false"
          >
            Deny
          </button>
        </div>
      </div>
    </transition>

    <div
      class="d-flex justify-content-between align-items-center message-box message-text"
    >
      <p class="m-0 text-weight text-black">
        Thomas Fulloway added himself to your reservation
      </p>
      <i
        class="far fa-chevron-right icon d-inline-block p-2 color-primary golfer-cursor"
      ></i>
    </div>

    <div
      class="d-flex justify-content-between align-items-center message-box message-text"
    >
      <p class="m-0 text-black pr-2">Frank Boehm invited you to his teetime</p>
      <i
        class="far fa-chevron-right icon d-inline-block p-2 color-primary golfer-cursor"
      ></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      slideVisible: true,
    };
  },
};
</script>

<style lang="scss">
@import "../css/_variables";

.message-dashboard {
  .message-title {
    padding: 1.2rem 1rem;

    h2 {
      font-size: 1rem;
    }

    p {
      font-size: 0.9rem;
    }
  }

  .message-request {
    button {
      font-size: 0.9rem;
      width: 7.8rem;
      height: 1.3rem;
      padding: 0;
    }
  }

  .message-box {
    font-size: 0.9rem;
    padding: 1rem;
    border-bottom: 1px solid $border;
  }
}
</style>
