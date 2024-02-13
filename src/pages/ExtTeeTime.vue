<template>
  <q-page-container>
    <q-page class="q-pa-sm">
      <div class="iframe-container">
        <iframe
          :src="store.getters['settings/item'].EXT_TEETIMES"
          allowfullscreen
          class="embedded-iframe"
          frameborder="0"
          height="800"
          width="600"
        />
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import store from "src/store";

export default {
  computed: {
    store() {
      return store;
    },
  },
  data() {
    return {};
  },
};
</script>

<style>
.iframe-container {
  width: 100%;
  max-width: 800px;
}

.embedded-iframe {
  width: 100%;
  height: 800px;
}
</style>
