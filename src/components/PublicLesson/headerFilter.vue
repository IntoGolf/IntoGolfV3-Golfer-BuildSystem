<template>
  <div class="row">
    <div class="col-4 text-right"></div>
  </div>
</template>

<script>
export default {
  props: {
    date: String,
  },
  data: function () {
    return {
      localDate: this.date,
    };
  },
  watch: {
    date: function (newDate) {
      this.localDate = newDate;
    },
  },
  methods: {
    setDay: function (value) {
      this.localDate = this.$dayjs(this.localDate)
        .add(value, "days")
        .format("YYYY-MM-DD");
      this.$emit("updateDate", this.localDate);
    },
  },
};
</script>
