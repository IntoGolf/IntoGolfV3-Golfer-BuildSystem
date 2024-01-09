<template>
  <div>
    <q-card>
      <q-card-section class="text-h6">
        Verhuurartikelen
        <q-btn
          class="float-right"
          flat
          icon="arrow_back"
          v-on:click="handleClose"
        />
      </q-card-section>

      <q-separator />

      <q-list bordered separator>
        <q-item
          v-for="(item, key) in list"
          :key="key"
          v-ripple
          clickable
          v-on:click="handleAdd(item)"
        >
          <q-item-section>
            <q-item-label>
              <b>{{ item.uitName }}</b>
            </q-item-label>
            <q-item-label caption>
              aantal beschikbaar {{ item.available }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="add" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </div>
</template>

<script>
export default {
  props: {
    flight: Object,
  },
  data: function () {
    return {
      list: [],
    };
  },
  created() {
    this.handleLoad();
  },
  methods: {
    handleClose() {
      this.$emit("handleCloseEditPlayer");
    },
    async handleLoad() {
      this.list = await this.$http.get(
        "golfer/flight/rent?fltNr=" + this.flight.fltNr
      );
    },
    async handleAdd(item) {
      this.$q
        .dialog({
          title: "Bevestiging toevoegen huurartikel",
          message:
            'Je staat op het punt huurartikel "' +
            item.uitName +
            '" toe te voegen aan je reservering. Weet je zeker dat je wilt doorgaan?',
          cancel: true,
        })
        .onOk(() => {
          this.setAdd(item);
        });
    },
    async setAdd(item) {
      let data = {
        fltNr: this.flight.fltNr,
        numberOfItems: 1,
        rent: {
          uitNr: item.uitNr,
        },
        rentPrice: {
          uipNr: item.uni_res_item_prices[0].uipNr,
          uipPrice: item.uni_res_item_prices[0].uipPrice,
        },
      };
      const res = await this.$http.post("golfer/flight/rent", data);
      this.$emit("handleRefresh");
    },
  },
};
</script>
