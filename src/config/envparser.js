const DotEnv = require("dotenv");
const path = require("path");
const fs = require("fs");

let parsedEnvCommon = DotEnv.config({ path: ".env" }).parsed;

argsEnv = {};
//if (process.env.ENVIRONMENT && process.env.ENVIRONMENT !== "live") {
if (process.env.ENVIRONMENT) {
  console.log("use env file: .env." + process.env.ENVIRONMENT);
  argsEnv = DotEnv.config({
    path: "env/.env." + process.env.ENVIRONMENT,
  }).parsed;
}
// } else if (process.env.ENVIRONMENT && process.env.ENVIRONMENT === "live") {
//   console.log("use env live file: dist/.env");
//   argsEnv = DotEnv.config({ path: "dist/.env" }).parsed;
// }

let parsedEnv = DotEnv.config().parsed;

/**
 * Load secure secrets for the current environment
 * Secrets are stored in .secrets/ directory and excluded from git
 */
function loadSecureSecrets() {
  const secrets = {};
  const environment = process.env.ENVIRONMENT || 'development';
  const secretsFile = path.join(process.cwd(), '.secrets', `${environment}.env`);
  
  if (fs.existsSync(secretsFile)) {
    console.log(`🔐 Loading secure secrets for: ${environment}`);
    const secretsEnv = DotEnv.config({ path: secretsFile }).parsed;
    Object.assign(secrets, secretsEnv);
  } else {
    console.warn(`⚠️  No secure secrets found for environment: ${environment}`);
    console.warn(`   Expected file: ${secretsFile}`);
    console.warn(`   Run: node scripts/secrets-manager.js generate ${environment}`);
  }
  
  return secrets;
}

module.exports = function () {
  const secureSecrets = loadSecureSecrets();
  return Object.assign(parsedEnvCommon, argsEnv, parsedEnv, secureSecrets);
};
