<template>
  <q-btn-group spread>
    <q-btn
      color="primary"
      icon="add"
      label="Binnenland"
      @click="handleNew(1)"
    />

    <q-btn
      color="secondary"
      icon="add"
      label="Buitenland"
      @click="handleNew(2)"
    />
  </q-btn-group>
</template>

<script>
export default {
  methods: {
    handleNew: function (type) {
      this.$emit("handleNew", type);
    },
  },
};
</script>
