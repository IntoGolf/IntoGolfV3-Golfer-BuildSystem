import { setCssVar } from "quasar";

const mixin = {
  data: function () {
    return {
      settings: null,
    };
  },
  created() {
    this.$http.get("golfer/psettings").then((settings) => {
      this.settings = settings;
      setCssVar("primary", this.settings.app_primary_color);
      setCssVar("primary_font", this.settings.app_primary_font_color);
      setCssVar("secondary", this.settings.app_secondary_color);
      setCssVar("secondary_font", this.settings.app_secondary_font_color);
    });
  },
};

export default mixin;
