<template>
  <q-page>
    <div class="q-mb-sm" style="font-size: 14px; font-weight: bold">
      Nieuw clubje
    </div>
    <q-input v-model="form.cirName" label="Naam" />
    <div class="row justify-end">
      <q-btn
        v-show="form.cirNr > 0"
        class="q-mt-sm q-mr-sm"
        color="primary"
        label="Delete"
        v-on:click="$store.dispatch('circles/delete')"
      />
      <q-btn
        class="q-mt-sm q-mr-sm"
        color="primary"
        label="Sluiten"
        v-on:click="$store.dispatch('circles/close')"
      />
      <q-btn
        :disable="!form.cirName"
        class="q-mt-sm"
        color="primary"
        label="Opslaan"
        v-on:click="$store.dispatch('circles/setCircle', form)"
      />
    </div>

    <q-separator class="q-mt-md q-mb-md" />
    <div class="q-mb-sm" style="font-size: 14px; font-weight: bold">
      U kunt vrienden uitnodigen voor uw clubjes. Geef een e-mailadres op en wij
      controleren of uw vriend in ons relatiebestand aanwezig is.
    </div>
    <q-input label="E-mailadres" />

    <q-btn
      class="q-mt-sm"
      color="primary"
      label="Uitnodigen"
      v-on:click="handleInvite"
    />

    <q-list bordered class="q-mt-md" separator>
      <q-item
        v-for="(item, key) in form.circle_relations"
        :key="key"
        v-ripple
        clickable
      >
        <q-item-section>{{ item.relation.full_name }}</q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
export default {
  data: function () {
    return {
      form: null,
    };
  },
  created: function () {
    this.form = this.$store.state.circles.circle;
  },
  methods: {
    handleInvite() {},
  },
};
</script>
