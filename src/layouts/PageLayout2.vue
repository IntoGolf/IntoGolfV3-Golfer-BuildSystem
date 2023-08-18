<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-secondary" flat>
      <q-toolbar>
        <q-btn
          dense
          flat
          icon="home"
          round
          v-on:click="this.$router.push('/')"
        />

        <q-toolbar-title class="text-center">
          {{ this.$route.meta.title }}
        </q-toolbar-title>

        <q-btn
          dense
          flat
          icon="account_circle"
          round
          v-on:click="$router.push('/profile')"
        />
      </q-toolbar>
    </q-header>

    <router-view class="web-width" />
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageLayout",
});
</script>
