<template>
  <q-card class="q-mb-md">
    <q-card-section class="text-h6">
      Speler {{ player.flpSide }}

      <q-btn
        class="float-right"
        color="accent"
        label="Annuleer"
        v-on:click="handleCancelPlayer"
      />
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-input
        :readonly="player.flpRelNr > 0"
        label="Naam speler"
        model-value="player.flpName"
        outlined
      />

      <q-input
        :readonly="player.flpRelNr > 0"
        label="Handicap"
        model-value="player.flpHandicap"
        outlined
      />

      <q-input
        :readonly="player.flpRelNr > 0"
        label="E-mailadres"
        model-value="player.flpEmail"
        outlined
      />

      <q-input
        :readonly="player.flpRelNr > 0"
        label="Telefoonnummer"
        model-value="player.flpPhone"
        outlined
      />

      <q-input
        :readonly="player.flpRelNr > 0"
        label="Golfservicenummer"
        model-value="player.flpGsn"
        outlined
      />
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-btn class="q-mr-md" color="primary" label="Opslaan" />

      <q-btn class="q-mr-md" color="primary" label="Annuleer" />
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: {
    player: Object,
  },
};
</script>
