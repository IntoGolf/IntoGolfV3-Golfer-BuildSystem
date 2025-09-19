#!/usr/bin/env node

/**
 * Generate Capacitor Configuration Script
 * 
 * This script generates a capacitor.config.json file based on environment variables
 * and secure secrets, preventing hardcoded sensitive information in the codebase.
 */

const fs = require('fs');
const path = require('path');

const generateCapacitorConfig = require('../capacitor.config.template.js');

try {
  // Generate the configuration
  const config = generateCapacitorConfig();
  
  // Write to capacitor.config.json
  const configPath = path.join(process.cwd(), 'capacitor.config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  
  console.log('✅ Generated capacitor.config.json');
  console.log(`   App ID: ${config.appId}`);
  console.log(`   App Name: ${config.appName}`);
  console.log(`   Version: ${config.version}`);
  
  if (config.android) {
    console.log('🤖 Android keystore configured');
  } else {
    console.log('⚠️  Android keystore not configured');
  }
  
} catch (error) {
  console.error('❌ Failed to generate capacitor.config.json:');
  console.error(error.message);
  process.exit(1);
}