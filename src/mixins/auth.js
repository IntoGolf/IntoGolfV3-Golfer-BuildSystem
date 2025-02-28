const mixin = {
  computed: {
    settings() {
      let settings = false;
      if (!this.$store.getters["settings/isItemEmpty"]) {
        settings = this.$store.state.settings.item;
      } else if (!this.$store.getters["settings/isPublicEmpty"]) {
        settings = this.$store.state.settings.publicItems;
      }
      return settings;
    },
    currentUser() {
      return this.$store.state.currentUser.item;
    },
  },
};

export default mixin;
