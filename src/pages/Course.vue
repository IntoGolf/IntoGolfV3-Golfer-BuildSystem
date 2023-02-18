<template>

  <q-page-container>

    <q-page class="q-pa-md">

      <q-card
          class="q-mb-sm"
          v-for="(loop, index) in list"
          :key="index">

        <q-card-section class="text-h6">
          {{ loop.course_loop.crlName }}
        </q-card-section>

        <q-separator/>

        <q-card-section>

          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-4 text-right">Qualifying</div>
            <div class="col-8">
              <q-icon
                  :size="'sm'"
                  :color="loop.clsNotQualifyingYN == 1 ? 'green' : 'red'"
                  :name="loop.clsNotQualifyingYN == 1 ? 'done' : 'close'"/>
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-4 text-right">Buggies</div>
            <div class="col-8">
              <q-icon
                  :size="'sm'"
                  :color="loop.clsNoBuggiesYN == 1 ? 'green' : 'red'"
                  :name="loop.clsNoBuggiesYN == 1 ? 'done' : 'close'"/>
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-4 text-right">Trollies</div>
            <div class="col-8">
              <q-icon
                  :size="'sm'"
                  :color="loop.clsNoTrolleysYN == 1 ? 'green' : 'red'"
                  :name="loop.clsNoTrolleysYN == 1 ? 'done' : 'close'"/>
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-4 text-right">Wintergreens</div>
            <div class="col-8">
              <q-icon
                  :size="'sm'"
                  :color="loop.clsWinterGreensYN == 1 ? 'green' : 'red'"
                  :name="loop.clsWinterGreensYN == 1 ? 'done' : 'close'"/>
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-sm">
            <div class="col-4 text-right">Wintertees</div>
            <div class="col-8">
              <q-icon
                  :size="'sm'"
                  :color="loop.clsWinterTeesYN == 1 ? 'green' : 'red'"
                  :name="loop.clsWinterTeesYN == 1 ? 'done' : 'close'"/>
            </div>
          </div>

        </q-card-section>

      </q-card>

    </q-page>

  </q-page-container>

</template>

<script>

export default {
  components: {},
  data() {
    return {
      list: []
    };
  },
  created: function () {
    this.handleLoad();
  },
  methods: {
    handleLoad() {
      this.$http.get("golfer/courseStatus").then((res) => {
        this.list = res;
        console.log(this.list);
      });
    },
  },
};
</script>
