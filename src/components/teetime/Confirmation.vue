<template>
  <div class="row">
    <div class="col-md-4 offset-md-4 col-xs-12">
      <q-card class="q-pa-md q-mt-sm q-mb-lg">
        <div class="row">
          <div class="col text-center text-h5">Boeking Gelukt!</div>
        </div>

        <q-separator class="q-mb-md" />

        <div :class="emotion" class="row">
          <div class="col q-mt-md text-center">
            Je boeking is gemaakt! Je ontvangt een e-mail ter bevestiging van je
            reservering. In deze e-mail vind je een link waarmee je je
            reservering kunt aanpassen.
          </div>
        </div>

        <div class="row">
          <div class="col q-mt-md text-center">
            Dankjewel voor het vertrouwen! Tot snel op de baan
          </div>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  computed: {},
  methods: {},
};
</script>
