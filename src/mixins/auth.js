import { setCssVar } from "quasar";

const mixin = {
  created() {
    if (this.settings) {
      setCssVar("primary", this.settings.app_primary_color);
      setCssVar("primary_font", this.settings.app_primary_font_color);
      setCssVar("secondary", this.settings.app_secondary_color);
      setCssVar("secondary_font", this.settings.app_secondary_font_color);
    }
  },
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
