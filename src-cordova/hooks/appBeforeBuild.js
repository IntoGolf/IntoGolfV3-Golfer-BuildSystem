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
console.log("ok");
