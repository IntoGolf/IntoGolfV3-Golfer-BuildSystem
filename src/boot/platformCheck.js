import { boot } from "quasar/wrappers";
import { VueReCaptcha } from "vue-recaptcha-v3";
import { Platform } from "quasar";

const captcha = process.env.VUE_APP_GOOGLE_RECAPTCHA;

export default boot(({ app }) => {
  if (!Platform.is.ios && !Platform.is.android) {
    app.use(VueReCaptcha, { siteKey: captcha });
  }
});
