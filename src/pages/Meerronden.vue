<template>
  <meerronde-list
    v-if="match === null"
    v-on:handleOpenMatch="handleOpenMatch"
  />
  <meerronde-details
    v-else
    :prop_match="match"
    v-on:handleCloseMatch="handleCloseMatch"
  />
</template>

<script>
import meerrondeList from "../components/meerronde/list.vue";
import meerrondeDetails from "../components/meerronde/details.vue";

export default {
  components: {
    meerrondeList,
    meerrondeDetails,
  },
  data() {
    return {
      match: null,
    };
  },
  watch: {
    $route() {
      window.location.reload();
    }
  },
  methods: {
    handleOpenMatch(match) {
      this.match = match;
    },
    handleCloseMatch() {
      this.match = null;
    },
  },
};
</script>
