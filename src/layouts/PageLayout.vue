<template>
  <q-layout view="lHh Lpr lFf">

    <q-header flat class="bg-secondary">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="home"
          v-on:click="this.$router.push('/')"
        />

        <q-toolbar-title class="text-center">
          {{ this.$route.meta.title }}
        </q-toolbar-title>

        <q-btn
          flat
          dense
          round
          icon="account_circle"
          v-on:click="$router.push('/profile')"
        />
      </q-toolbar>
    </q-header>

      <router-view />

  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "PageLayout",
});
</script>
