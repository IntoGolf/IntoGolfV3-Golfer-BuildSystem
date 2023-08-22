<template>
  <div class="row">
    <div class="col-8 text-h5">Boek een les</div>
    <div class="col-4 text-right">
      <q-btn-group>
        <q-btn color="primary" label="<" size="sm" v-on:click="setDay(-1)" />
        <q-btn color="primary" label=">" size="sm" v-on:click="setDay(1)" />
      </q-btn-group>
    </div>
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
