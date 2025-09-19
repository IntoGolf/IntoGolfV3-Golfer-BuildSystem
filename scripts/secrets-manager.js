#!/usr/bin/env node

/**
 * IntoGolf Secrets Manager
 * 
 * This script manages sensitive credentials for the multi-tenant golf app
 * It prevents hardcoded passwords in source code by using environment variables
 * and local secrets files that are excluded from git.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class SecretsManager {
  constructor() {
    this.secretsDir = path.join(process.cwd(), '.secrets');
    this.ensureSecretsDirectory();
  }

  /**
   * Ensure the .secrets directory exists
   */
  ensureSecretsDirectory() {
    if (!fs.existsSync(this.secretsDir)) {
      fs.mkdirSync(this.secretsDir, { recursive: true });
      console.log('✅ Created .secrets directory');
    }
  }

  /**
   * Generate a secure random password
   * @param {number} length - Password length
   * @returns {string} - Random password
   */
  generatePassword(length = 16) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  /**
   * Generate keystore credentials for a specific client
   * @param {string} clientName - The client name (e.g., 'engelenburg')
   */
  generateClientSecrets(clientName) {
    const secretsFile = path.join(this.secretsDir, `${clientName}.env`);
    
    // Check if secrets already exist
    if (fs.existsSync(secretsFile)) {
      console.log(`⚠️  Secrets already exist for ${clientName}`);
      return this.loadClientSecrets(clientName);
    }

    // Generate new secrets
    const keystorePassword = this.generatePassword(20);
    const keyPassword = this.generatePassword(20);
    const keyAlias = `key${clientName.charAt(0).toUpperCase() + clientName.slice(1)}`;

    const secrets = {
      KEYSTORE_PASSWORD: keystorePassword,
      KEY_PASSWORD: keyPassword,
      KEY_ALIAS: keyAlias
    };

    // Write to secrets file
    const content = Object.entries(secrets)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n') + '\n';

    fs.writeFileSync(secretsFile, content, { mode: 0o600 });
    console.log(`✅ Generated secrets for ${clientName}`);
    
    return secrets;
  }

  /**
   * Load secrets for a specific client
   * @param {string} clientName - The client name
   * @returns {object} - Object with secrets
   */
  loadClientSecrets(clientName) {
    const secretsFile = path.join(this.secretsDir, `${clientName}.env`);
    
    if (!fs.existsSync(secretsFile)) {
      throw new Error(`No secrets found for client: ${clientName}`);
    }

    const content = fs.readFileSync(secretsFile, 'utf8');
    const secrets = {};
    
    content.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        secrets[key] = value;
      }
    });

    return secrets;
  }

  /**
   * Migrate existing keystore_credentials.env files to new system
   */
  migrateExistingSecrets() {
    console.log('🔄 Migrating existing keystore credentials...');
    
    const resDir = path.join(process.cwd(), 'res');
    if (!fs.existsSync(resDir)) {
      console.log('❌ res/ directory not found');
      return;
    }

    const clientDirs = fs.readdirSync(resDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    clientDirs.forEach(clientName => {
      const credentialsFile = path.join(resDir, clientName, 'keystore_credentials.env');
      
      if (fs.existsSync(credentialsFile)) {
        console.log(`📦 Migrating ${clientName}...`);
        
        // Read existing credentials
        const content = fs.readFileSync(credentialsFile, 'utf8');
        const newSecretsFile = path.join(this.secretsDir, `${clientName}.env`);
        
        // Copy to new location with secure permissions
        fs.writeFileSync(newSecretsFile, content, { mode: 0o600 });
        
        console.log(`✅ Migrated ${clientName} to secure location`);
      }
    });
  }

  /**
   * Generate gitignore entries for secrets
   */
  updateGitignore() {
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    const secretsEntries = [
      '',
      '# Secure secrets (DO NOT COMMIT)',
      '.secrets/',
      '*.keystore',
      'keystore_credentials.env'
    ].join('\n');

    if (fs.existsSync(gitignorePath)) {
      const content = fs.readFileSync(gitignorePath, 'utf8');
      if (!content.includes('.secrets/')) {
        fs.appendFileSync(gitignorePath, secretsEntries);
        console.log('✅ Updated .gitignore with secrets exclusions');
      }
    }
  }

  /**
   * List all available client secrets
   */
  listClients() {
    if (!fs.existsSync(this.secretsDir)) {
      console.log('❌ No secrets directory found');
      return [];
    }

    const files = fs.readdirSync(this.secretsDir)
      .filter(file => file.endsWith('.env'))
      .map(file => file.replace('.env', ''));

    console.log('📋 Available client secrets:');
    files.forEach(client => console.log(`   - ${client}`));
    
    return files;
  }

  /**
   * Remove secrets for a specific client
   * @param {string} clientName - The client name
   */
  removeClientSecrets(clientName) {
    const secretsFile = path.join(this.secretsDir, `${clientName}.env`);
    
    if (fs.existsSync(secretsFile)) {
      fs.unlinkSync(secretsFile);
      console.log(`✅ Removed secrets for ${clientName}`);
    } else {
      console.log(`⚠️  No secrets found for ${clientName}`);
    }
  }
}

// CLI Interface
if (require.main === module) {
  const manager = new SecretsManager();
  const command = process.argv[2];
  const clientName = process.argv[3];

  switch (command) {
    case 'generate':
      if (!clientName) {
        console.error('❌ Please specify a client name: node secrets-manager.js generate <client>');
        process.exit(1);
      }
      manager.generateClientSecrets(clientName);
      break;

    case 'migrate':
      manager.migrateExistingSecrets();
      manager.updateGitignore();
      break;

    case 'list':
      manager.listClients();
      break;

    case 'remove':
      if (!clientName) {
        console.error('❌ Please specify a client name: node secrets-manager.js remove <client>');
        process.exit(1);
      }
      manager.removeClientSecrets(clientName);
      break;

    case 'load':
      if (!clientName) {
        console.error('❌ Please specify a client name: node secrets-manager.js load <client>');
        process.exit(1);
      }
      try {
        const secrets = manager.loadClientSecrets(clientName);
        console.log(`🔐 Secrets for ${clientName}:`);
        Object.entries(secrets).forEach(([key, value]) => {
          console.log(`   ${key}=${value}`);
        });
      } catch (error) {
        console.error(`❌ ${error.message}`);
        process.exit(1);
      }
      break;

    default:
      console.log(`
🔐 IntoGolf Secrets Manager

Usage:
  node secrets-manager.js migrate           # Migrate existing credentials
  node secrets-manager.js generate <client> # Generate new secrets for a client
  node secrets-manager.js load <client>     # Load secrets for a client  
  node secrets-manager.js list              # List all clients with secrets
  node secrets-manager.js remove <client>   # Remove secrets for a client

Examples:
  node secrets-manager.js migrate
  node secrets-manager.js generate engelenburg
  node secrets-manager.js load engelenburg
      `);
  }
}

module.exports = SecretsManager;