import { setCssVar } from "quasar";

const mixin = {
  created() {
    setCssVar("primary", this.settings.app_primary_color);
    setCssVar("primary_font", this.settings.app_primary_font_color);
    setCssVar("secondary", this.settings.app_secondary_color);
    setCssVar("secondary_font", this.settings.app_secondary_font_color);
  },
  computed: {
    settings() {
      return this.$ls.getItem("settings").value;
    },
    currentUser() {
      return this.$ls.getItem("currentUser").value;
    },
    Authorization() {
      return this.$ls.getItem("Authorization").value;
    },
    currentUserPref() {
      return this.$ls.getItem("currentUserPref").value;
    },
  },
};

export default mixin;
