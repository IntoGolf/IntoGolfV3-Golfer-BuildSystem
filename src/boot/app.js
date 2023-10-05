import { boot } from "quasar/wrappers";
import dayjs from "dayjs";

// document.addEventListener(
//   "deviceready",
//   function () {
//     cordova.plugins.firebase.messaging
//       .requestPermission({ forceShow: true })
//       .then(function () {
//         alert("a");
//       })
//       .catch(function (error) {
//         alert("b");
//       });
//     // Ensure Cordova plugins are ready
//     cordova.plugins.firebase.messaging.onMessage(function (payload) {
//       alert("c");
//     });
//
//     cordova.plugins.firebase.messaging.onNotificationClick(function (payload) {
//       alert("d");
//     });
//   },
//   false
// );

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
  app.use(dayjs);
  app.config.globalProperties.$dayjs = dayjs;
});
