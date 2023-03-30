import { boot } from "quasar/wrappers";
import { createWatcher } from "next-vue-storage-watcher";

import dayjs from "dayjs";

let customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

require("dayjs/locale/nl");
dayjs.locale("NL");

let isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(isBetween);

let isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)

let isToday = require('dayjs/plugin/isToday')
dayjs.extend(isToday)


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
