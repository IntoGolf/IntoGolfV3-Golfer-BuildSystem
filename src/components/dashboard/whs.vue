<template>
  <q-card bordered class="full-width q-pa-md q-mb-md bg-blue-1" flat>
    <div class="row text-h6">
      <div class="col-9">Speelsterkte</div>
      <div class="col-3 text-right">{{ item.relHandicap }}</div>
    </div>
    <div class="row" style="color: gray">
      <div class="col-9">GSN: {{ item.relGsn }}</div>
      <div class="col-3 text-right">
        WHS
      </div>
    </div>
  </q-card>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "dashboardWhsStatus",
  computed: {
    ...mapGetters("currentUser", ["item"]),
  },
  methods: {},
};
</script>
