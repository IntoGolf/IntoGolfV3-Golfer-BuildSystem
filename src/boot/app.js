import { boot } from "quasar/wrappers";
import { createWatcher } from "next-vue-storage-watcher";

import dayjs from "dayjs";

let customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

require("dayjs/locale/nl");
dayjs.locale("NL");

let isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(isBetween);

export const lsWatcher = createWatcher({
  prefix: "gofler__",
  storage: "local",
});

export default boot(({ app }) => {
  app.use(lsWatcher);
  app.use(dayjs);
  app.config.globalProperties.$ls = lsWatcher;
  app.config.globalProperties.$dayjs = dayjs;
});
