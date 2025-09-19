# 🔐 Security Guide

## Overview

Dit project gebruikt nu een beveiligd secrets management systeem om hardcoded wachtwoorden en gevoelige informatie uit de codebase te houden.

## ⚠️ Belangrijke Wijzigingen

### Voor Deze Update:
- ❌ Wachtwoorden stonden hardcoded in `capacitor.config.json`
- ❌ Keystore credentials in `res/*/keystore_credentials.env` (in git)
- ❌ Android keystores in `res/*/` directory

### Na Deze Update:
- ✅ Alle secrets in `.secrets/` directory (uitgesloten van git)
- ✅ Dynamische configuratie generatie
- ✅ Veilige keystore opslag
- ✅ Automatische secrets generatie

## 🔧 Secrets Management

### Directory Structuur
```
.secrets/                    # Secure directory (not in git)
├── engelenburg.env         # Keystore passwords for engelenburg
├── delfland.env           # Keystore passwords for delfland
├── engelenburg.keystore   # Android keystore for engelenburg
└── delfland.keystore      # Android keystore for delfland
```

### Secrets Manager Commands

```bash
# Genereer nieuwe secrets voor een client
node scripts/secrets-manager.js generate engelenburg

# Migreer bestaande credentials naar veilige locatie
node scripts/secrets-manager.js migrate

# Toon alle beschikbare clients
node scripts/secrets-manager.js list

# Laad secrets voor een client (voor debugging)
node scripts/secrets-manager.js load engelenburg

# Verwijder secrets voor een client
node scripts/secrets-manager.js remove engelenburg
```

## 🏗️ Build Process

### Nieuwe Build Flow
1. **Secrets laden**: Build script laadt automatisch secrets uit `.secrets/<client>.env`
2. **Config generatie**: Capacitor configuratie wordt dynamisch gegenereerd
3. **Veilige keystore**: Keystores worden gelezen vanuit `.secrets/` directory

### Build Commands (Ongewijzigd)
```bash
# Build voor engelenburg
./build-client-v2.sh engelenburg

# Build voor delfland  
./build-client-v2.sh delfland
```

## 🔒 Security Best Practices

### ✅ DO
- Gebruik `node scripts/secrets-manager.js` voor secrets beheer
- Houd `.secrets/` directory lokaal en buiten git
- Gebruik environment-specifieke secrets files
- Backup keystores veilig (niet in git)

### ❌ DON'T  
- Commit nooit bestanden uit `.secrets/` naar git
- Plaats geen wachtwoorden in code of configuratie bestanden
- Deel keystores niet via onveilige kanalen
- Verwijder `.secrets/` directory niet zonder backup

## 📋 Setup voor Nieuwe Developers

### 1. Eerste Keer Setup
```bash
# Clone het project
git clone <repository>
cd IntoGolfV3_Golfer

# Installeer dependencies
yarn install

# Migreer bestaande credentials (als je toegang hebt)
node scripts/secrets-manager.js migrate
```

### 2. Nieuwe Client Toevoegen
```bash
# Genereer secrets voor nieuwe client
node scripts/secrets-manager.js generate nieuwe-client

# Kopieer icon en splash naar res/nieuwe-client/
cp res/template/* res/nieuwe-client/

# Maak environment file
cp env/.env.template env/.env.nieuwe-client
```

### 3. Bestaande Client Setup
Voor bestaande developers die toegang nodig hebben tot keystore credentials:

1. Vraag aan teamlead om `.secrets/` backup
2. Plaats bestanden in je lokale `.secrets/` directory
3. Test met: `node scripts/secrets-manager.js list`

## 🚨 Troubleshooting

### "No secrets found for client"
```bash
# Genereer nieuwe secrets
node scripts/secrets-manager.js generate <client-name>
```

### "Keystore not found"
```bash
# Check keystore locatie
ls .secrets/

# Herrun migratie script
node scripts/secrets-manager.js migrate
```

### "Failed to generate capacitor configuration"
```bash
# Check environment file bestaat
ls env/.env.<client>

# Check secrets bestaan
node scripts/secrets-manager.js load <client>
```

## 🔄 Migration Checklist

- [x] ✅ Migreer bestaande keystore credentials
- [x] ✅ Verplaats keystores naar secure locatie  
- [x] ✅ Update build scripts
- [x] ✅ Update capacitor configuratie generatie
- [x] ✅ Update .gitignore exclusions
- [ ] ⏳ Verwijder oude credential bestanden (na verificatie)
- [ ] ⏳ Update CI/CD pipelines (indien van toepassing)

## 📞 Support

Voor vragen over het secrets management systeem:
1. Check deze documentatie
2. Run `node scripts/secrets-manager.js` voor help
3. Contact het development team

## 🔐 Secret Format

Elk client secrets bestand (`.secrets/<client>.env`) bevat:
```bash
KEYSTORE_PASSWORD=<20-character-random-password>
KEY_PASSWORD=<20-character-random-password>  
KEY_ALIAS=key<ClientName>
```

Deze worden automatisch gegenereerd met cryptografisch veilige random passwords.