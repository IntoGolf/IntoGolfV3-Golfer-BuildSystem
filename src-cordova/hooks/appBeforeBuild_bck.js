const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const cordovaPath = path.resolve(__dirname, "..", "src-cordova");
try {
  console.log("Removing iOS platform...");
  execSync("cordova platform rm ios", { cwd: cordovaPath, stdio: "inherit" });
} catch (error) {
  console.error("An error occurred while resetting Cordova platforms");
}

try {
  console.log("Add iOS platform...");
  execSync("cordova platform add ios", { cwd: cordovaPath, stdio: "inherit" });
} catch (error) {
  console.error("An error occurred while resetting Cordova platforms");
}
