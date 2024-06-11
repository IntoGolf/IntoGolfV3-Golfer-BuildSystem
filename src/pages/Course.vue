<template>
  <q-page-container>
    <q-page class="q-pa-sm">
      <q-card
        v-for="(loop, index) in $store.state.courseStatus.items"
        :key="index"
        class="q-mb-sm"
      >
        <q-card-section class="text-h6">
          <div class="text-h6">{{ loop.course_loop.crlName }}</div>
          <div class="text-subtitle2 text-italic">
            laatst bijgewerkt
            {{ $dayjs(loop.clsLastUpdated).format("ddd DD MMM HH:mm ") }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-4 text-right">Qualifying</div>
            <div class="col-8">
              <q-icon
                :color="loop.clsNotQualifyingYN == 0 ? 'green' : 'red'"
                :name="loop.clsNotQualifyingYN == 0 ? 'done' : 'close'"
                :size="'sm'"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-4 text-right">Buggies</div>
            <div class="col-8">
              <q-icon
                :color="loop.clsNoBuggiesYN == 0 ? 'green' : 'red'"
                :name="loop.clsNoBuggiesYN == 0 ? 'done' : 'close'"
                :size="'sm'"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-4 text-right">Troleys</div>
            <div class="col-8">
              <q-icon
                :color="loop.clsNoTrolleysYN == 0 ? 'green' : 'red'"
                :name="loop.clsNoTrolleysYN == 0 ? 'done' : 'close'"
                :size="'sm'"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-4 text-right">Wintergreens</div>
            <div class="col-8">
              <q-icon
                :color="loop.clsWinterGreensYN == 1 ? 'green' : ''"
                :name="loop.clsWinterGreensYN == 1 ? 'done' : 'remove'"
                :size="'sm'"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-4 text-right">Wintertees</div>
            <div class="col-8">
              <q-icon
                :color="loop.clsWinterTeesYN == 1 ? 'green' : ''"
                :name="loop.clsWinterTeesYN == 1 ? 'done' : 'remove'"
                :size="'sm'"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-4 text-right">Opmerking</div>
            <div class="col-8">
              {{ loop.clsNote }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-page>
  </q-page-container>
</template>

<script>
export default {
  created: function () {
    this.$store.dispatch("courseStatus/fetch");
  },
};
</script>
