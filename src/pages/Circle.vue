<template>
  <q-page-container>
    <circle-form v-if="$store.state.circles.circle !== null" />
    <circle-list v-else v-on:handleNew="handleNew" />
  </q-page-container>
</template>

<script>
import CircleList from "components/circles/circleList.vue";
import CircleForm from "components/circles/circleForm.vue";

export default {
  components: { CircleForm, CircleList },
  data: function () {
    return {
      form: {
        cirNr: null,
        cirName: "",
        circle_relations: [],
        circle_messages: [],
      },
    };
  },
  created: function () {
    this.$store.dispatch("circles/fetchCircles");
  },
  methods: {
    async handleSave() {
      const result = await this.$store.dispatch(
        "circles/setCircle",
        this.circle
      );
    },
    handleNew() {
      this.$store.dispatch("circles/set", { ...this.form });
    },
  },
};
</script>
