<template>
  <q-layout id="q-app">
    <router-view />
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import publicMixin from "src/mixins/public";

export default defineComponent({
  mixins: [publicMixin],
  name: "App",
  created() {},
});
</script>
