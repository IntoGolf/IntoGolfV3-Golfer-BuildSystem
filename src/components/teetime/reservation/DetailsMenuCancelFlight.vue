<template>
  <q-item
    v-if="canCancel && !paid && isMyBooking"
    v-ripple
    clickable
    v-on:click="handleCancel"
  >
    <q-item-section side>
      <q-icon name="delete" />
    </q-item-section>
    <q-item-section>
      <q-item-label>
        <b>Annuleer flight</b>
      </q-item-label>
      <q-item-label caption> tot {{ cancelHours }} uur voor start</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  props: {
    flight: Object,
    cancelHours: Number,
    canCancel: Boolean,
    paid: Boolean,
    isMyBooking: Boolean,
  },
  methods: {
    handleCancel: function () {
      let local_flight = { ...this.flight };
      local_flight.fltCarNr = 1;
      this.$q
        .dialog({
          title: "Starttijd annuleren",
          message: "Wilt u doorgaan?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.$emit("handleSave", local_flight, true);
        });
    },
  },
};
</script>
