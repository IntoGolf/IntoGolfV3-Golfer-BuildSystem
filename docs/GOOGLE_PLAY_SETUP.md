# Google Play Store Automatische Upload Setup

Deze gids legt uit hoe je automatische uploads naar de Google Play Store configureert voor alle IntoGolf apps.

## 🔧 Vereisten

- Google Play Console toegang voor alle apps
- Google Cloud Console toegang
- Admin rechten op GitHub repository

## 📋 Stap-voor-stap Setup

### 1. Google Cloud Console Setup

1. **Ga naar [Google Cloud Console](https://console.cloud.google.com)**
2. **Maak een nieuw project** of selecteer bestaand project
3. **Enable APIs:**
   - Ga naar "APIs & Services" → "Library"
   - Zoek en enable: "Google Play Developer API"

### 2. Service Account Aanmaken

1. **Ga naar "IAM & Admin" → "Service Accounts"**
2. **Klik "Create Service Account"**
   - Name: `intogolf-playstore-upload`
   - Description: `Service account for automated Play Store uploads`
3. **Skip de rollen stap** (configureren we later in Play Console)
4. **Klik "Done"**

### 3. Service Account Key Genereren

1. **Klik op de aangemaakte service account**
2. **Ga naar "Keys" tab**
3. **Klik "Add Key" → "Create new key"**
4. **Selecteer "JSON" format**
5. **Download het JSON bestand** (bewaar dit veilig!)

### 4. Google Play Console Configuratie

1. **Ga naar [Play Console](https://play.google.com/console)**
2. **Ga naar "Setup" → "API access"**
3. **Klik "Link a Google Cloud project"**
4. **Selecteer het Google Cloud project** van stap 1
5. **Grant toegang aan de service account:**
   - Zoek de service account email (uit het JSON bestand)
   - Klik "Grant access"
   - **Account permissions:**
     - ✅ View app information and download bulk reports
     - ✅ Create and edit draft apps
     - ✅ Release apps to testing tracks
     - ✅ Release apps to production
     - ✅ Manage testing tracks and edit tester lists
   - **App permissions:** Select "Add from Play Console projects"
   - Voeg alle IntoGolf apps toe waar je automatische uploads wilt

### 5. GitHub Secrets Configureren

1. **Ga naar repository Settings → Secrets and variables → Actions**
2. **Voeg toe: `GOOGLE_PLAY_SERVICE_ACCOUNT`**
   - Value: Base64 encoded JSON bestand
   ```bash
   # Op macOS/Linux:
   base64 -i service-account-key.json
   
   # Op Windows:
   certutil -encode service-account-key.json tmp.b64 && findstr /v /c:- tmp.b64
   ```
3. **Kopieer de complete base64 string** (inclusief alle regels)

## 🚀 Gebruik

### Automatische Upload tijdens Build

```bash
# Trigger build MET upload naar Play Store
gh workflow run android-build.yml \
  --repo IntoGolf/IntoGolfV3-Golfer-BuildSystem \
  -f client=goese \
  -f upload_to_play_console=true
```

### Dedicated Play Store Upload

```bash
# Alleen uploaden (zonder nieuwe build)
gh workflow run playstore-upload.yml \
  --repo IntoGolf/IntoGolfV3-Golfer-BuildSystem \
  -f client=goese \
  -f track=internal \
  -f release_status=completed
```

### Beschikbare Tracks

- **internal** - Interne testing (max 100 testers)
- **alpha** - Closed alpha testing
- **beta** - Open/closed beta testing  
- **production** - Live in Play Store

### Release Status Options

- **draft** - Opslaan als concept
- **inProgress** - Start release process
- **completed** - Direct live (gebruik voorzichtig!)
- **halted** - Stop huidige release

## ⚠️ Belangrijke Opmerkingen

### Eerste Upload
- **Apps moeten eerst handmatig** worden aangemaakt in Play Console
- Upload minimaal één keer handmatig voordat je automatische upload gebruikt
- Configureer app metadata (naam, beschrijving, screenshots, etc.)

### Version Codes
- **Elke upload moet een uniek version code hebben**
- GitHub Actions incrementeert automatisch de build number
- Controleer in `env/.env.{client}` het `APP_BUILD_NUMBER`

### App Signing
- **Play App Signing moet zijn ingeschakeld** in Play Console
- Ga naar "Setup" → "App signing" voor elke app
- Upload je upload certificaat (eerste keer)

## 🔍 Troubleshooting

### "Permission denied" errors
- Controleer service account permissions in Play Console
- Zorg dat alle benodigde apps zijn toegevoegd

### "Version already exists" 
- Increment `APP_BUILD_NUMBER` in client environment file
- Of gebruik `increment_build=true` in workflow

### "App not found"
- App moet eerst handmatig zijn aangemaakt in Play Console
- Controleer dat package name (`APP_ID`) correct is

### "Invalid AAB"
- Controleer dat build succesvol was
- AAB moet gesigned zijn met correct certificaat

## 📱 Per Client Configuratie

Elke client kan verschillende Play Store instellingen hebben:

```bash
# env/.env.{client}
APP_ID=nl.intogolf.{client}           # Package name in Play Store
APP_VERSION=1.4.11                    # Version name
APP_BUILD_NUMBER=5                    # Version code (must be unique)
```

## 🎯 Workflow Bestanden

- `android-build.yml` - Build + optionele upload
- `playstore-upload.yml` - Dedicated upload workflow
- `client-specific-build.yml` - Per-client build met upload optie

## 📞 Support

Bij problemen:
1. Check GitHub Actions logs voor specifieke error messages
2. Verify service account permissions in Play Console
3. Controleer dat alle secrets correct zijn geconfigureerd
4. Test eerst met "internal" track voordat je naar productie gaat