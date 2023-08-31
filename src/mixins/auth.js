const mixin = {
  created() {
    //setCssVar("primary", env.COLOR_PRIMARY);
    // setCssVar("header", "#9c27b0");
    // setCssVar("primary", "red");
    // setCssVar("primary_font", this.settings.app_primary_font_color);
    // setCssVar("secondary", this.settings.app_secondary_color);
    // setCssVar("secondary_font", this.settings.app_secondary_font_color);
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
