<template>

  <q-card
      class="q-mb-md">

    <q-card-section class="text-h6">

      Speler {{ player.flpSide }}

      <q-btn
          v-on:click="handleCancelPlayer"
          color="accent"
          class="float-right"
          label="Annuleer"/>

    </q-card-section>

    <q-separator/>

    <q-card-section>

      <q-input
          :readonly="player.flpRelNr > 0"
          label="Naam speler"
          outlined
          model-value="player.flpName"/>

      <q-input
          :readonly="player.flpRelNr > 0"
          label="Handicap"
          outlined
          model-value="player.flpHandicap"/>

      <q-input
          :readonly="player.flpRelNr > 0"
          label="E-mailadres"
          outlined
          model-value="player.flpEmail"/>

      <q-input
          :readonly="player.flpRelNr > 0"
          label="Telefoonnummer"
          outlined
          model-value="player.flpPhone"/>

      <q-input
          :readonly="player.flpRelNr > 0"
          label="Golfservicenummer"
          outlined
          model-value="player.flpGsn"/>

    </q-card-section>

    <q-separator/>

    <q-card-section>

      <q-btn
          class="q-mr-md"
          color="primary"
          label="Opslaan"/>

      <q-btn
          class="q-mr-md"
          color="primary"
          label="Annuleer"/>

    </q-card-section>

  </q-card>


</template>

<script>
export default {
  props: {
    player: Object
  },
  data: function () {
    return {};
  },
  computed: {},
  created() {
  },
  methods: {}
};
</script>
