const DotEnv = require("dotenv");
let parsedEnvCommon = DotEnv.config({ path: ".env" }).parsed;

argsEnv = {};
//if (process.env.ENVIRONMENT && process.env.ENVIRONMENT !== "live") {
console.log("go johnny go");
if (process.env.ENVIRONMENT) {
  console.log("use env file: .env." + process.env.ENVIRONMENT);
  argsEnv = DotEnv.config({ path: ".env." + process.env.ENVIRONMENT }).parsed;
}
// } else if (process.env.ENVIRONMENT && process.env.ENVIRONMENT === "live") {
//   console.log("use env live file: dist/.env");
//   argsEnv = DotEnv.config({ path: "dist/.env" }).parsed;
// }

let parsedEnv = DotEnv.config().parsed;

module.exports = function () {
  return Object.assign(parsedEnvCommon, argsEnv, parsedEnv);
};
