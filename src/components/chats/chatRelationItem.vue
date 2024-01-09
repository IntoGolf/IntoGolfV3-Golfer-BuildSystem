<template>
  <q-item v-ripple clickable>
    <q-item-section avatar>
      <q-img
        :src="base64Image"
        height="40px"
        style="border-radius: 50%"
        width="40px"
      />
    </q-item-section>
    <q-item-section>
      <div class="row">
        <div :class="isAdmin ? 'col-8' : 'col-12'">
          <b>{{ relation.full_name2 }}</b>
        </div>
        <div class="col-4 text-right">
          {{ isAdminText }}
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          {{ relation.relEmail }}
        </div>
      </div>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  props: {
    relation: Object,
    item: Object,
  },
  data: function () {
    return {
      image: "",
      base64Image: "",
    };
  },
  computed: {
    isAdmin() {
      return this.item.crrAdmin === 1;
    },
    isAdminText() {
      return this.isAdmin ? "beheerder" : "";
    },
  },
  async mounted() {
    await this.loadImage();
  },
  methods: {
    async loadImage() {
      let name = this.relation.relImage;
      name = name === "" ? "empty" : name;

      const url = "golfer/image/" + name;
      const response = await this.$http({
        method: "get",
        url: url,
      });

      this.base64Image = `data:image/jpeg;base64,${response}`;
    },
  },
};
</script>
