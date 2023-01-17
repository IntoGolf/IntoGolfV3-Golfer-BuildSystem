<template>

  <div>

    <item v-for="(item,key) in items"
          :key="key"
          :item="item"
          v-on:handleAddToCart="$emit('handleAddToCart', item)"/>

    <upgradable-pay-method
        v-for="(payMethod,key) in upgradablePayMethod"
          :key="key"
          :payMethod="payMethod"
          v-on:handleAddUpgradeToCart="handleAddUpgradeToCart"/>

  </div>

</template>

<script>

import Item from "components/webshop/item.vue";
import UpgradablePayMethod from "components/webshop/upgradablePayMethod.vue";

export default {
  components: {UpgradablePayMethod, Item},
  props: {
    items: Array,
    upgradablePayMethod: Array
  },
  methods: {
    handleAddUpgradeToCart: function(payMethod, amount) {
      this.$emit('handleAddUpgradeToCart',payMethod, amount)
    }
  }
};

</script>
