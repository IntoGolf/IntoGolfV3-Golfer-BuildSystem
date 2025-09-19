/**
 * Dynamic Capacitor Configuration
 *
 * This file generates capacitor.config.json based on environment variables
 * It prevents hardcoded sensitive information like keystore passwords
 */

const envParser = require('./src/config/envparser.js');

// Load environment variables and secrets
const env = envParser();

// Validate required environment variables
function validateRequiredEnvVars() {
  const required = [
    'APP_ID',
    'APP_DISPLAY_NAME',
    'APP_VERSION'
  ];

  const missing = required.filter(key => !env[key]);
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    process.exit(1);
  }
}

// Generate the capacitor configuration
function generateCapacitorConfig() {
  validateRequiredEnvVars();

  const config = {
    appId: env.APP_ID,
    appName: env.APP_DISPLAY_NAME,
    version: env.APP_VERSION,
    webDir: "dist/spa",
    ios: {
      scheme: env.APP_DISPLAY_NAME.replace(/\s+/g, '_'),
      buildOptions: {
        developmentTeam: env.IOS_DEVELOPMENT_TEAM || "IntoGolf B.V.",
        codeSignIdentity: env.IOS_CODE_SIGN_IDENTITY || "IntoGolf B.V.",
        provisioningProfile: env.IOS_PROVISIONING_PROFILE || "IntoGolf B.V.",
        deviceFamily: env.IOS_DEVICE_FAMILY || "1",
        device: env.IOS_DEVICE || "iPhone"
      }
    },
    server: {
      hostname: "localhost",
      iosScheme: "capacitor",
      androidScheme: "http"
    }
  };

  // Add Android configuration only if we have keystore secrets
  if (env.KEYSTORE_PASSWORD && env.KEY_PASSWORD && env.KEY_ALIAS) {
    const clientName = env.VUE_APP_NAME || process.env.ENVIRONMENT || 'default';
    config.android = {
      buildOptions: {
        keystorePath: `../../.secrets/${clientName}.keystore`,
        keystorePassword: env.KEYSTORE_PASSWORD,
        keystoreAlias: env.KEY_ALIAS,
        keystoreAliasPassword: env.KEY_PASSWORD,
        releaseType: env.ANDROID_RELEASE_TYPE || "AAB"
      }
    };
    console.log(`🔐 Android keystore configured for: ${clientName}`);
  } else {
    console.warn('⚠️  Android keystore not configured - missing secrets');
    console.warn('   Run: node scripts/secrets-manager.js generate <environment>');
  }

  return config;
}

module.exports = generateCapacitorConfig;
