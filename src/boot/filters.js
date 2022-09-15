import { boot } from "quasar/wrappers";
import dayjs from "dayjs";

/**
 *  global filters
 */

// Vue.filter('money', function (number, decimal = 1) {
//   return '€' + (number * decimal)
//     .toFixed(2)
//     .replace(/\d(?=(\d{3})+\.)/g, '$&,')
//     .replace('.', ',');
// });
//
// Vue.filter('date', function (str, format = 'dddd D MMMM YYYY') {
//   return dayjs(str)
//     .format(format);
// });
//
// Vue.filter('time', function (str) {
//   return str.substr(0, 5);
// });
//
// Vue.filter('toText', function (str) {
//   return str.replace('^', ' ');
// });
//

require("dayjs/locale/nl");

const unixToDate = function (timestamp, formatString = "DD-MM-YYYY") {
  const unixTimestamp = (timestamp - 719528) * 86400;
  dayjs.locale("NL");
  return dayjs.unix(unixTimestamp).format(formatString);
};

const diffTime = function (datetime) {
  return dayjs(datetime).fromNow(true);
};

const capitalizeFirstLetter = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const minuteToTime = function (minute) {
  let hrs = parseInt(minute / 60);
  let min = parseInt(minute - hrs * 60);

  min = min < 10 ? "0" + min : min;
  return hrs + ":" + min;
};

const timeToMinute = function (time) {
  let array = time.split(':');
  return (parseInt(array[0]) * 60) + parseInt(array[1]);
};

const money = function (number, decimal = 1) {
  return (
    "€" +
    (number * decimal)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")
      .replace(".", ",")
  );
};
export default ({ app }) => {
  app.config.globalProperties.$filters = {
    unixToDate,
    minuteToTime,
    timeToMinute,
    diffTime,
    capitalizeFirstLetter,
    money,
  };
};
