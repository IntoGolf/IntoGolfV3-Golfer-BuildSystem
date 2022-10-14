<template>
  <div class="fixed-top bg-white">
    <div class="container">
      <div class="row q-pa-xs">
        <div class="col-3 text-left p-0" />

        <div class="col-6 text-center">{{ $route.meta.title }}</div>

        <div class="col-3 text-right"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["page"],
  data() {
    return {};
  },
  methods: {
    handleNewScorecard: function (value) {
      this.$emit("handleNewScorecard", value);
    },

    onCancelScorecard: function () {
      this.$emit("handleCloseScorecard", true);
    },
  },
};
</script>
