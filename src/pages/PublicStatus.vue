<template>
  <q-page class="q-pa-md">
    <q-card v-for="(row,key) in rows" :key="key" class="q-pa-md q-mb-md">
      <div class="row">
        <div class="col">
          <div class="text-h6 text-bold">{{ row.name }}</div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <span class="text-italic">{{ row.date }}</span>
        </div>
        <div class="col-6 text-right">
          {{ row.sunrise }} / {{ row.sunset }}
        </div>
      </div>
      <q-separator/>
      <div v-show="row.wintergreens" class="row q-mt-md">
        <div class="col">
          <div class="bg-red-4 text-white text-center text-bold  q-pa-sm">Wintergreens</div>
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col-6">
          <div class="text-bold">Baan open</div>
        </div>
        <div class="col">
          <div v-if="row.open" class="text-right">
            <q-icon color="green-6" name="check" size="sm"/>
          </div>
          <div v-else class="text-right">
            <q-icon color="red-6" name="close" size="sm"/>
          </div>
        </div>
      </div>
      <div v-show="key===0" class="row q-mt-md">
        <div class="col-6">
          <div class="text-bold">Drivingrange open</div>
        </div>
        <div class="col">
          <div v-if="row.drivingRangeOpen" class="text-right">
            <q-icon color="green-6" name="check" size="sm"/>
          </div>
          <div v-else class="text-right">
            <q-icon color="red-6" name="close" size="sm"/>
          </div>
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col-6">
          <div class="text-bold">Qualifying</div>
        </div>
        <div class="col">
          <div v-if="row.qualifying" class="text-right">
            <q-icon color="green-6" name="check" size="sm"/>
          </div>
          <div v-else class="text-right">
            <q-icon color="red-6" name="close" size="sm"/>
          </div>
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col-6">
          <div class="text-bold">Buggies</div>
        </div>
        <div class="col">
          <div v-if="row.buggies" class="text-right">
            <q-icon color="green-6" name="check" size="sm"/>
          </div>
          <div v-else class="text-right">
            <q-icon color="red-6" name="close" size="sm"/>
          </div>
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col-6">
          <div class="text-bold">Trollies</div>
        </div>
        <div class="col">
          <div v-if="row.trollies" class="text-right">
            <q-icon color="green-6" name="check" size="sm"/>
          </div>
          <div v-else class="text-right">
            <q-icon color="red-6" name="close" size="sm"/>
          </div>
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col-6">
          <div class="text-bold">Pinpositie(s)</div>
        </div>
        <div class="col text-right">
          {{ row.pinPosition }}
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col">
          <span>{{ row.notes }}</span>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>

export default {
  components: {},
  data: function () {
    return {
      rows: null,
    };
  },
  async created() {
    await this.handleLoadStatus();
  },
  methods: {
    async handleLoadStatus() {
      this.rows = await this.$http.get("public/status");
    }
  },
};
</script>
