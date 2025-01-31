<template>
  <q-page class="q-pa-sm">
    <q-card
      v-for="(loop, index) in $store.state.courseStatus.items"
      :key="index"
      bordered
      class="q-mb-sm"
      flat
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
        <div v-show="index === 0" class="row q-col-gutter-md q-mb-sm">
          <div class="col-5 text-right">Drivingrange open</div>
          <div class="col-7">
            <q-icon
              :color="loop.clsDrivingRangeYN == 0 ? 'green' : 'red'"
              :name="loop.clsDrivingRangeYN == 0 ? 'done' : 'close'"
              :size="'sm'"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md q-mb-sm">
          <div class="col-5 text-right">Baan open</div>
          <div class="col-7">
            <q-icon
              :color="loop.clsOpenYN == 0 ? 'green' : 'red'"
              :name="loop.clsOpenYN == 0 ? 'done' : 'close'"
              :size="'sm'"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md q-mb-sm">
          <div class="col-5 text-right">Qualifying</div>
          <div class="col-7">
            <q-icon
              :color="loop.clsNotQualifyingYN == 0 ? 'green' : 'red'"
              :name="loop.clsNotQualifyingYN == 0 ? 'done' : 'close'"
              :size="'sm'"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md q-mb-sm">
          <div class="col-5 text-right">Buggies</div>
          <div class="col-7">
            <q-icon
              :color="loop.clsNoBuggiesYN == 0 ? 'green' : 'red'"
              :name="loop.clsNoBuggiesYN == 0 ? 'done' : 'close'"
              :size="'sm'"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md q-mb-sm">
          <div class="col-5 text-right">Trolleys</div>
          <div class="col-7">
            <q-icon
              :color="loop.clsNoTrolleysYN == 0 ? 'green' : 'red'"
              :name="loop.clsNoTrolleysYN == 0 ? 'done' : 'close'"
              :size="'sm'"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md q-mb-sm">
          <div class="col-5 text-right">Wintergreens</div>
          <div class="col-7">
            <q-icon
              :color="loop.clsWinterGreensYN == 1 ? 'green' : ''"
              :name="loop.clsWinterGreensYN == 1 ? 'done' : 'remove'"
              :size="'sm'"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md q-mb-sm">
          <div class="col-5 text-right">Wintertees</div>
          <div class="col-7">
            <q-icon
              :color="loop.clsWinterTeesYN == 1 ? 'green' : ''"
              :name="loop.clsWinterTeesYN == 1 ? 'done' : 'remove'"
              :size="'sm'"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md q-mb-sm">
          <div class="col-5 text-right">Pin positie</div>
          <div class="col-7">
            {{ loop.clsPinPosition }}
          </div>
        </div>

        <div class="row q-col-gutter-md q-mb-sm">
          <div class="col-5 text-right">Opmerking</div>
          <div class="col-7">
            {{ loop.clsNote }}
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  created: function () {
    this.$store.dispatch("courseStatus/fetch");
  },
};
</script>
