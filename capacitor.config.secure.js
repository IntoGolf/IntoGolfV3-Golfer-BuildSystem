/**
 * Secure Capacitor Configuration
 * 
 * This configuration loads secrets dynamically at build time
 * instead of storing them in capacitor.config.json
 */

const generateCapacitorConfig = require('./capacitor.config.template.js');

module.exports = generateCapacitorConfig();