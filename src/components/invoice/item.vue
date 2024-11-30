<template>
  <div class="q-mt-md"></div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  methods: {
    handleClose: function (card) {
      this.$emit("handleClose");
    },
  },
};
</script>
