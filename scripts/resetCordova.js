const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const cordovaPath = path.resolve(__dirname, "../");
console.log(cordovaPath);

// Remove and add Cordova platforms before the build
try {
  console.log("Removing iOS platform...");
  execSync("cordova platform rm ios", { cwd: cordovaPath, stdio: "inherit" });
  console.log("iOS platform removed.");
} catch (error) {
  console.error("An error occurred while resetting Cordova platforms:", error);
}

try {
  console.log("Removing Android platform...");
  execSync("cordova platform rm android", {
    cwd: cordovaPath,
    stdio: "inherit",
  });
  console.log("Android platform removed.");
} catch (error) {
  console.error("An error occurred while resetting Cordova platforms:", error);
}

try {
  // Add iOS platform
  console.log("Adding iOS platform...");
  execSync("cordova platform add ios", {
    cwd: cordovaPath,
    stdio: "inherit",
  });
  console.log("iOS platform added.");
} catch (error) {
  console.error("An error occurred while resetting Cordova platforms:", error);
}

try {
  // Add Android platform
  console.log("Adding Android platform...");
  execSync("cordova platform add android", {
    cwd: cordovaPath,
    stdio: "inherit",
  });
  console.log("Android platform added.");
} catch (error) {
  console.error("An error occurred while resetting Cordova platforms:", error);
}
