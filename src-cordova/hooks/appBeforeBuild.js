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
  .replace(/\$VUE_APP_NAME\$/g, vue_app_name)
  .replace("$APP_ID$", app_id);

fs.writeFileSync(configPath, updatedConfigContent);

const sourcePathSplash = path.join(
  __dirname,
  "../../res/" + vue_app_name + "/splash.png"
);
const destinationPathSplash = path.join(__dirname, "../resources/splash.png");
fs.copyFile(sourcePathSplash, destinationPathSplash, (error) => {
  if (error) {
    console.error("An error occurred:", error);
  } else {
    console.log("File was successfully copied");
  }
});

const sourcePathIcon = path.join(
  __dirname,
  "../../res/" + vue_app_name + "/icon.png"
);
const { exec } = require("child_process");
const destinationPathIcon = path.join(__dirname, "../resources/icon.png");
fs.copyFile(sourcePathIcon, destinationPathIcon, (error) => {
  if (error) {
    console.error("An error occurred:", error);
  } else {
    console.log("File was successfully copied");
  }
});

exec("cordova-res ios", (error, stdout, stderr) => {
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});

exec("cordova-res android", (error, stdout, stderr) => {
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});

console.log("ok");
