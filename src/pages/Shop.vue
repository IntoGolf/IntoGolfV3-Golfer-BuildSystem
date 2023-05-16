<template>
  <q-page-container class="q-mt-md q-pa-md">
    <div class="row justify-between q-mt-md">
      <div class="text-h5">
        {{ showOrder ? "Uw winkel wagen" : "Artikelen" }}
      </div>

      <q-btn
        v-show="!showOrder"
        icon="shopping_cart"
        round
        type="default"
        v-on:click="showOrder = true"
      >
        <q-badge color="blue" floating
          >{{ this.order.items.length + this.order.upgradablePayMethod.length }}
        </q-badge>
      </q-btn>

      <q-btn
        v-show="showOrder"
        icon="arrow_back"
        round
        type="default"
        v-on:click="showOrder = false"
      />
    </div>

    <items
      v-if="!showOrder"
      :items="items"
      :upgradablePayMethod="upgradablePayMethod"
      v-on:handleAddToCart="handleAddToCart"
      v-on:handleAddUpgradeToCart="handleAddUpgradeToCart"
    />

    <cart v-else :order="order" v-on:handlePay="handlePay" />
  </q-page-container>
</template>

<script>
import Items from "components/webshop/items.vue";
import Cart from "components/webshop/cart.vue";
import authMixin from "../mixins/auth";

export default {
  mixins: [authMixin],
  components: { Cart, Items },
  data: function () {
    return {
      items: [],
      upgradablePayMethod: [],
      order: {
        items: [],
        upgradablePayMethod: [],
      },
      showOrder: false,
    };
  },
  mounted() {
    this.$http.get("golfer/items").then((res) => {
      this.items = res;
    });
    this.$http.get("golfer/paymethod").then((res) => {
      this.upgradablePayMethod = res;
    });
  },
  methods: {
    handleAddToCart: function (item) {
      this.order.items.push(item);
    },
    handlePay: function (lines) {
      let payload = {
        relNr: this.currentUser.relNr,
        lines: lines,
      };
      this.$http.post("golfer/order", payload).then((res) => {
        window.location.href = res.url;
      });
    },
    handleAddUpgradeToCart: function (payMethod, amount) {
      payMethod.amount = amount;
      this.order.upgradablePayMethod.push(payMethod);
    },
  },
};
</script>
