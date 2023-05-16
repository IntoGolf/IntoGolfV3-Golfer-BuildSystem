import dayjs from "dayjs";

/**
 *  global filters
 */

require("dayjs/locale/nl");

const unixToDate = function (timestamp, formatString = "DD-MM-YYYY") {
  const unixTimestamp = (timestamp - 719528) * 86400;
  dayjs.locale("NL");
  return dayjs.unix(unixTimestamp).format(formatString);
};

const dateToUnix = function (value, formatString = "DD-MM-YYYY") {
  return Math.round(dayjs(value, formatString).unix() / 86400 + 719528);
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
  let array = time.split(":");
  return parseInt(array[0]) * 60 + parseInt(array[1]);
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
    dateToUnix,
    minuteToTime,
    timeToMinute,
    diffTime,
    capitalizeFirstLetter,
    money,
  };
};
