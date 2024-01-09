<template>
  <q-avatar>
    <q-img
      :src="base64Image"
      height="40px"
      style="border-radius: 50%"
      width="40px"
    />
  </q-avatar>
</template>

<script>
export default {
  props: {
    player: Object,
  },
  data: function () {
    return {
      base64Image: null,
    };
  },
  async mounted() {
    await this.loadImage();
  },
  methods: {
    async loadImage() {
      let name = this.player.avatar;
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
