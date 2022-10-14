<template>

    <q-btn-group spread>

      <q-btn
          color="secondary"
          label="Binnenland"
          icon="add"
          @click="handleNew(1)"/>

      <q-btn
          color="secondary"
          label="Buitenland"
          icon="add"
          @click="handleNew(2)"/>

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
