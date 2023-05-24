<template>
  <q-card style="width: 1024px; margin-left: auto; margin-right: auto">
    <div class="row q-mt-lg">
      <div class="col">
        <div class="row q-mb-md q-pa-lg">
          <div class="col">
            <div class="row">
              <div class="col text-h4">Startlijst {{ matchName }}</div>
            </div>
            <q-separator class="q-mt-sm" />
            <div class="row q-mt-md">
              <div class="col-2 text-bold">Datum</div>
              <div class="col-10">: {{ startDatum }}</div>
            </div>
            <div class="row q-mt-md">
              <div class="col-2 text-bold">Wedstrijdleiding</div>
              <div class="col-10">: {{ wedstrijdleiding1 }}</div>
            </div>
            <div class="row q-mt-md">
              <div class="col-2 text-bold">Wedstrijdleiding</div>
              <div class="col-10">: {{ wedstrijdleiding2 }}</div>
            </div>
            <div class="row q-mt-md">
              <div class="col-2 text-bold">Aantal deelnemers</div>
              <div class="col-10">: {{ deelnemers }}</div>
            </div>
            <div class="row q-mt-md">
              <div class="col-2 text-bold">Longest</div>
              <div class="col-10">: {{ longest }}</div>
            </div>
            <div class="row q-mt-md">
              <div class="col-2 text-bold">Neary</div>
              <div class="col-10">: {{ neary }}</div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <q-table
              :columns="columns"
              :rows="list"
              :rows-per-page-options="[0]"
              row-key="full_name2"
            />
          </div>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script>
import publicMixin from "../mixins/public";
import toolMixin from "../mixins/toolMixin";

export default {
  mixins: [publicMixin, toolMixin],
  data() {
    return {
      list: [],
      columns: [
        {
          name: "relMemberCode",
          align: "left",
          label: "RelatieCode",
          field: "relMemberCode",
          sortable: true,
        },
        {
          name: "full_name2",
          align: "left",
          label: "Speler",
          field: "full_name2",
          sortable: true,
        },
        {
          name: "exactHandicapForMatch",
          align: "left",
          label: "Speelsterkte",
          field: "exactHandicapForMatch",
          sortable: true,
        },
        {
          name: "startingHoleNumber",
          align: "left",
          label: "Hole",
          field: "startingHoleNumber",
          sortable: true,
        },
        {
          name: "startingTime",
          align: "left",
          label: "Tijd",
          field: "startingTime",
          sortable: true,
        },
        {
          name: "flightNumber",
          align: "left",
          label: "Flight",
          field: "flightNumber",
          sortable: true,
        },
      ],
    };
  },
  computed: {
    matchName: function () {
      if (this.list.length === 0) {
        return "";
      }
      return this.list[0].name;
    },
    startDatum: function () {
      if (this.list.length === 0) {
        return "";
      }
      return (
        this.$dayjs(this.list[0].playingDate).format("dddd DD MMMM") +
        " " +
        this.$dayjs(this.list[0].matchStartingTime, "HH:mm:ss").format("HH:mm")
      );
    },
    wedstrijdleiding1: function () {
      if (this.list.length === 0) {
        return "";
      }
      return this.list[0].commissioner1Name;
    },
    wedstrijdleiding2: function () {
      if (this.list.length === 0) {
        return "";
      }
      return this.list[0].commissioner2Name;
    },
    deelnemers: function () {
      if (this.list.length === 0) {
        return "";
      }
      return this.list[0].maximumNumberOfPlayers;
    },
    longest: function () {
      if (this.list.length === 0) {
        return "";
      }
      return this.list[0].Longest === 0
        ? "nvt"
        : "Hole " + this.list[0].Longest;
    },
    neary: function () {
      if (this.list.length === 0) {
        return "";
      }
      return this.list[0].Neary === 0 ? "nvt" : "Hole " + this.list[0].Neary;
    },
  },
  created() {
    let key = this.getUrlParameter("key");
    console.log(key);
    this.$http.get("golfer/startlist?key=" + key).then((res) => {
      this.list = res.data;
    });
  },
};
</script>
