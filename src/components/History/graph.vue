<template>
  <div v-if="loaded" :style="{ marginTop: $q.platform.is.ios ? '60px' : '' }">
    <div class="text-center text-h6">
      Klik op een van de onderstaande knoppen om de details te bekijken.
    </div>
    <div class="row q-pt-md text-center">
      <div class="col q-pa-sm">Verl.</div>
      <div class="col q-pa-sm">Toek.</div>
      <div class="col q-pa-sm">Even.</div>
      <div class="col q-pa-sm">Tot.</div>
      <div class="col q-pa-sm">Ann.</div>
    </div>
    <q-separator class="q-mt-sm q-mb-sm" />
    <div class="row">
      <div class="col q-pa-sm">
        <q-btn
          :label="this.chartData.datasets[0]['data'][0]"
          class="q-mr-md"
          style="background-color: #36a2eb; width: 100%"
          @click="$emit('setTypeId', 1)"
        />
      </div>
      <div class="col q-pa-sm">
        <q-btn
          :label="this.chartData.datasets[0]['data'][1]"
          class="q-mr-md"
          style="background-color: #ffce56; width: 100%"
          @click="$emit('setTypeId', 2)"
        />
      </div>
      <div class="col q-pa-sm">
        <q-btn
          :label="this.chartData.datasets[0]['data'][2]"
          class="q-mr-md"
          style="background-color: #4bc0c0; width: 100%"
          @click="$emit('setTypeId', 3)"
        />
      </div>
      <div class="col q-pa-sm">
        <q-btn :label="total" class="q-mr-md" style="width: 100%" />
      </div>
      <div class="col q-pa-sm">
        <q-btn
          :label="this.chartData.datasets[0]['data'][3]"
          class="q-mr-md"
          style="background-color: #ff6384; width: 100%"
          @click="$emit('setTypeId', 4)"
        />
      </div>
    </div>
    <q-separator class="q-mt-sm q-mb-sm" />
    <div class="row">
      <div :span="24" class="col">
        <Bar
          id="my-chart-id"
          ref="myChart"
          :data="chartData"
          :height="300"
          :options="chartOptions"
        />
      </div>
    </div>
  </div>
  <div v-else class="text-center text-h5">Data wordt geladen</div>
</template>
<script>
import { Bar } from "vue-chartjs";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);
export default {
  components: { Bar },
  props: {
    chartData: Object,
    loaded: Boolean,
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };
  },
  computed: {
    total() {
      return (
        parseInt(this.chartData.datasets[0]["data"][0]) +
        parseInt(this.chartData.datasets[0]["data"][1]) +
        parseInt(this.chartData.datasets[0]["data"][2])
      );
    },
  },
};
</script>
