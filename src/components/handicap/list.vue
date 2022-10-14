<template>

  <div class="q-mt-md">

    <q-list separator>

      <list-item
          v-for="(card, index) in handicapList"
          v-bind:key="index"
          :card="card"
          v-on:handleOpen="handleOpen"/>

    </q-list>

    <main
        v-if="!handicapList"
        class="text-h6 text-center">

      Uw handicapoverzicht wordt opgehaald bij de NGF

    </main>

    <q-banner
        v-else-if="handicapList.length == 0"
        class="bg-orange-3 text-grey-8 text-bold text-center">

      U heeft nog geen scorekaarten

    </q-banner>

  </div>

</template>

<script>

import listItem from "./listItem";

export default {
  components: {
    listItem
  },
  props: {
    handicapList: Array
  },
  methods: {
    handleOpen: function (card) {
      this.$emit("handleOpen", card);
    }
  },
};
</script>
