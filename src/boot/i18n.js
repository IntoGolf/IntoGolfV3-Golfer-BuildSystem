import { createI18n } from "vue-i18n";

const messages = {
  en: {
    ...require("../lang/en").message,
  },
  nl: {
    ...require("../lang/nl").message,
  },
};
export default ({ app }) => {
  // Create I18n instance
  const i18n = createI18n({
    legacy: false,
    locale: "nl",
    fallbackLocale: "en",
    messages,
  });

  // Tell app to use the I18n instance
  app.use(i18n);
};
