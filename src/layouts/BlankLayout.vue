<template>
  <router-view class="q-background" />
</template>

<script>
import { defineComponent } from "vue";
import { setCssVar } from "quasar";
import authMixin from "../mixins/auth";

export default defineComponent({
  mixins: [authMixin],
  name: "BlankLayout",
  mounted() {
    if (this.currentUser) {
      setCssVar("primary", this.settings.app_primary_color);
      setCssVar("primary_font", this.settings.app_primary_font_color);
      setCssVar("secondary", this.settings.app_secondary_color);
      setCssVar("secondary_font", this.settings.app_secondary_font_color);
    }
  },
});
</script>
