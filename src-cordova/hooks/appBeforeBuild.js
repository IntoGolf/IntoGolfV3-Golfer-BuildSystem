const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Get the environment from an environment variable or command-line argument
const app_id = process.env.APP_ID || "none";
const app_version = process.env.APP_VERSION || "0.1";
const vue_app_name = process.env.VUE_APP_NAME || "none";
const configPath = path.join(__dirname, "..", "config.xml");
const configFilePath = path.join(__dirname, "..", "config_template.xml");
const configContent = fs.readFileSync(configFilePath, "utf8");
const updatedConfigContent = configContent
  .replace("$APP_VERSION$", app_version)
  .replace(/\$APP_NAME\$/g, vue_app_name)
  .replace("$APP_ID$", app_id);

fs.writeFileSync(configPath, updatedConfigContent);

const sourcePathSplash = path.join(
  __dirname,
  "../../res/" + vue_app_name + "/splash.png"
);
const destinationPathSplash = path.join(__dirname, "../resources/splash.png");
console.log(sourcePathSplash);
console.log(destinationPathSplash);

try {
  fs.copyFileSync(sourcePathSplash, destinationPathSplash);
  console.log("File was successfully copied");
} catch (error) {
  console.error("An error occurred:", error);
}

const sourcePathIcon = path.join(
  __dirname,
  "../../res/" + vue_app_name + "/icon.png"
);
const destinationPathIcon = path.join(__dirname, "../resources/icon.png");
console.log(sourcePathIcon);
console.log(destinationPathIcon);
try {
  fs.copyFileSync(sourcePathIcon, destinationPathIcon);
  console.log("File was successfully copied");
} catch (error) {
  console.error("An error occurred:", error);
}

try {
  const iosOutput = execSync("cordova-res ios --skip-config", {
    encoding: "utf8",
  });
  console.log(`stdout: ${iosOutput}`);
} catch (error) {
  console.error(`stderr: ${error}`);
}

try {
  const androidOutput = execSync("cordova-res android --skip-config", {
    encoding: "utf8",
  });
  console.log(`stdout: ${androidOutput}`);
} catch (error) {
  console.error(`stderr: ${error}`);
}
