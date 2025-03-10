import {boot} from "quasar/wrappers";
import dayjs from "dayjs";

let customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

require("dayjs/locale/nl");
dayjs.locale("NL");

let isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

let isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrBefore);

let isToday = require("dayjs/plugin/isToday");
dayjs.extend(isToday);

export default boot(({app}) => {
  app.config.globalProperties.$dayjs = dayjs;

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      if (registrations.length > 0) {
        console.log("Service workers found, unregistering...");
        registrations.forEach((registration) => {
          registration.unregister();
        });
      } else {
        console.log("No service workers found.");
      }
    });
  }
});
