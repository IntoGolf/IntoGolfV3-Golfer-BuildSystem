import { boot } from "quasar/wrappers";
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

export default boot(({ app }) => {
  app.config.globalProperties.$dayjs = dayjs;

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                if (navigator.serviceWorker.controller) {
                  // Notify user of the new version
                  if (
                    confirm(
                      "A new version is available. Would you like to update?"
                    )
                  ) {
                    window.location.reload();
                  }
                }
              }
            };
          };
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    });
  }
});
