<template>
  <div>
    <q-card v-if="order.items.length > 0" class="q-mt-md">
      <q-markup-table>
        <thead>
          <tr>
            <th class="text-left">Artikel</th>
            <th class="text-center">Aantal</th>
            <th class="text-right">Totaal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, key) in lines" :key="key">
            <th class="text-left">{{ item.itmName }}</th>
            <!--        <th class="text-right">{{ $filters.money(item.itmPrice) }}</th>-->
            <th class="text-center">
              <div class="row items-center">
                <q-btn
                  class="q-pa-xs"
                  label="+"
                  size="sm"
                  v-on:click="onAddItem(item, 1)"
                />
                <div class="q-ml-sm q-mr-sm">{{ item.quantity }}</div>
                <q-btn
                  class="q-pa-xs"
                  label="-"
                  size="sm"
                  v-on:click="onAddItem(item, -1)"
                />
              </div>
            </th>
            <th class="text-right">{{ $filters.money(item.total) }}</th>
          </tr>
        </tbody>
        <tbody>
          <tr v-for="(payMethod, key) in order.upgradablePayMethod" :key="key">
            <th class="text-left">{{ payMethod.pmtName }}</th>
            <!--        <th class="text-right">{{ $filters.money(item.itmPrice) }}</th>-->
            <th class="text-center">
              <div class="row items-center">
                <q-btn
                  class="q-pa-xs"
                  label="+"
                  size="sm"
                  v-on:click="onAddItem(payMethod, 1)"
                />
                <div class="q-ml-sm q-mr-sm">{{ 1 }}</div>
                <q-btn
                  class="q-pa-xs"
                  label="-"
                  size="sm"
                  v-on:click="onAddItem(payMethod, -1)"
                />
              </div>
            </th>
            <th class="text-right">{{ $filters.money(payMethod.amount) }}</th>
          </tr>
        </tbody>
      </q-markup-table>

      <q-separator />

      <q-card-section>
        <div class="row">
          Betaling wordt uitgevoerd via Mollie. De betaalmethode die gebruikt
          wordt is iDeal. Selecteer uw bank en klik op betalen. U wordt daarna
          doorverwezen naar Mollie. Wanneer de betaling is afgerond kunt u terug
          keren naar deze app.
        </div>

        <q-select
          v-model="banque"
          :option-label="'name'"
          :option-value="'id'"
          :options="banqueArray"
          class="q-mb-md"
          label="Selecteer bank"
        />

        <q-btn
          :disable="banque === null || order.items.length === 0"
          v-on:click="$emit('handlePay', lines)"
        >
          Betalen
        </q-btn>
      </q-card-section>
    </q-card>
    <q-card v-else class="q-mt-md text-h6 text-center q-pt-lg q-pb-lg">
      Uw winkelmandje is leeg
    </q-card>
  </div>
</template>

<script>
export default {
  props: {
    order: Object,
  },
  data: function () {
    return {
      localOrder: this.order,
      banque: null,
      banqueArray: [],
    };
  },
  computed: {
    lines: function () {
      let lines = [];

      const array = [
        ...new Map(
          this.localOrder.items.map((item) => [item["itmNr"], item])
        ).values(),
      ];

      array.forEach((item) => {
        let total = this.localOrder.items
          .filter((_item) => _item.itmNr === item.itmNr)
          .map((_item) => _item.itmPrice)
          .reduce(function (a, b) {
            return parseFloat(a) + parseFloat(b);
          });

        let line = {
          itmNr: 0,
          itmName: "",
          itmPrice: 0,
          quantity: 0,
          itmTotal: 0,
        };
        line.itmNr = item.itmNr;
        line.itmName = item.itmName;
        line.itmPrice = item.itmPrice;
        line.quantity = this.localOrder.items.filter(
          (_item) => _item.itmNr === item.itmNr
        ).length;
        line.total = total;

        lines.push(line);
      });

      return lines;
    },
  },
  methods: {
    onAddItem: function (item, count) {
      let index = this.localOrder.items.findIndex(
        (_item) => _item.itmNr === _item.itmNr
      );
      if (count > 0) {
        let newItem = { ...this.localOrder.items[index] };
        this.localOrder.items.push(newItem);
      } else {
        this.localOrder.items.splice(index, 1);
      }
    },
  },
  mounted() {
    this.$http.get("golfer/mollie").then((res) => {
      this.banqueArray = res;
    });
  },
};
</script>
