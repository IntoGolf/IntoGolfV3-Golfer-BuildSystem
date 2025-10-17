# GitHub Actions Setup Guide

Deze guide helpt je om GitHub Actions in te stellen voor automatische iOS en Android builds.

## 🚀 Workflows

Er zijn 3 workflows beschikbaar:

1. **`ios-build.yml`** - Alleen iOS builds op macOS runners
2. **`android-build.yml`** - Alleen Android builds op Linux runners  
3. **`combined-build.yml`** - Beide platforms parallel

## 🔧 Setup Stappen

### 1. Repository Secrets Configureren

Ga naar: `Settings > Secrets and variables > Actions`

#### Voor Android:
```
KEYSTORE_PASSWORD=your_keystore_password
KEY_PASSWORD=your_key_password  
KEY_ALIAS=your_key_alias
GOOGLE_SERVICES_JSON=base64_encoded_google_services_json
```

#### Voor iOS:
```
IOS_CERTIFICATE_P12=base64_encoded_p12_certificate
IOS_CERTIFICATE_PASSWORD=certificate_password
IOS_PROVISIONING_PROFILE=base64_encoded_mobileprovision
APPLE_API_KEY_ID=your_api_key_id
APPLE_API_ISSUER_ID=your_issuer_id
APPLE_API_PRIVATE_KEY=base64_encoded_p8_key
```

### 2. Base64 Encoding van Files

#### Android Google Services:
```bash
base64 -i res/goese/google-services.json | pbcopy
```

#### iOS Certificate:
```bash
base64 -i path/to/certificate.p12 | pbcopy
```

#### iOS Provisioning Profile:
```bash
base64 -i path/to/profile.mobileprovision | pbcopy
```

#### Apple API Key:
```bash
base64 -i path/to/AuthKey_XXXXXXXXXX.p8 | pbcopy
```

### 3. Environment Files

Zorg ervoor dat je environment files bestaan:
- `env/.env.goese`
- `env/.env.{client}`

## 🎯 Workflows Uitvoeren

### Via GitHub Interface:

1. Ga naar `Actions` tab
2. Selecteer een workflow
3. Klik `Run workflow`
4. Vul parameters in:
   - **client**: `goese` (of andere client naam)
   - **increment_build**: `true/false`
   - **build_ios**: `true/false` (alleen combined workflow)
   - **build_android**: `true/false` (alleen combined workflow)

### Via GitHub CLI:

```bash
# iOS build
gh workflow run ios-build.yml \
  -f client=goese \
  -f increment_build=true \
  -f upload_to_testflight=false

# Android build  
gh workflow run android-build.yml \
  -f client=goese \
  -f increment_build=true \
  -f upload_to_play_console=false

# Combined build
gh workflow run combined-build.yml \
  -f client=goese \
  -f build_ios=true \
  -f build_android=true \
  -f increment_build=true
```

## 📱 Build Artifacts

Na een successful build:

1. Ga naar de workflow run
2. Scroll naar beneden naar "Artifacts"
3. Download:
   - `android-build-{client}` - APK en AAB files
   - `ios-build-{client}` - Xcode archive en build output
   - `release-notes-{client}` - Build informatie

## 💰 Kosten Indicatie

**GitHub Actions - Free tier:**
- 2000 minuten/maand gratis
- Linux runners: gratis 
- macOS runners: 10x multiplier (200 min effectief)

**Geschatte build times:**
- Android: 5-10 minuten
- iOS: 15-25 minuten

**Maandelijkse capacity (free tier):**
- ~8-10 iOS builds
- ~200+ Android builds
- Mix: ~5 iOS + 100 Android builds

## 🔍 Troubleshooting

### Android Issues:
- **Keystore errors**: Check KEYSTORE_PASSWORD en KEY_PASSWORD secrets
- **Google Services**: Zorg dat GOOGLE_SERVICES_JSON correct base64 encoded is
- **Build failures**: Check Android SDK versies in workflow

### iOS Issues:
- **Certificate errors**: Zorg dat IOS_CERTIFICATE_P12 en password correct zijn
- **Provisioning**: Check dat IOS_PROVISIONING_PROFILE geldig is
- **Xcode version**: Update setup-xcode action als needed

### Build Script Issues:
- **Environment file**: Check dat `env/.env.{client}` bestaat
- **Secrets**: Run secrets-manager.js lokaal om secrets te genereren
- **Dependencies**: npm install failures - check package.json

## 🛠️ Customization

### Workflow Aanpassingen:

#### Andere Xcode versie:
```yaml
- name: Setup Xcode
  uses: maxim-lobanov/setup-xcode@v1
  with:
    xcode-version: '15.0'
```

#### Andere Android SDK:
```yaml
- name: Setup Android SDK
  uses: android-actions/setup-android@v3
  with:
    api-level: 33
    build-tools: 33.0.2
```

#### Schedule Builds:
```yaml
on:
  schedule:
    - cron: '0 2 * * 1'  # Every Monday at 2 AM
  workflow_dispatch:
    # ... existing inputs
```

## 📋 Checklist

- [ ] Repository secrets geconfigureerd
- [ ] Environment files aanwezig
- [ ] Base64 encoding correct gedaan
- [ ] Workflows getest met manual trigger
- [ ] Artifacts gedownload en getest
- [ ] Cost monitoring ingesteld

## 🔗 Handige Links

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Pricing](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions)
- [Xcode GitHub Action](https://github.com/maxim-lobanov/setup-xcode)
- [Android GitHub Action](https://github.com/android-actions/setup-android)