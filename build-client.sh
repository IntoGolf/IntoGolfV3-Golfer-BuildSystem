#!/bin/bash

# Ensure a client name is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <client_name>"
  exit 1
fi

CLIENT=$1
APP_NAME="${CLIENT}"
PACKAGE_NAME="nl.intogolf.${CLIENT}"
VERSION_CODE=3

# Keystore configuration
KEYSTORE_DIR="${CLIENT}"
KEYSTORE_NAME="${CLIENT}.keystore"
KEYSTORE_PATH="res/${KEYSTORE_DIR}/${KEYSTORE_NAME}"
KEYSTORE_TYPE="JKS" # Default to JKS, update if needed

# Path to store generated passwords
CREDENTIALS_FILE="res/${CLIENT}/keystore_credentials.env"

# Ensure the keystore directory exists
if [ ! -d "res/${KEYSTORE_DIR}" ]; then
  echo "Creating directory res/${KEYSTORE_DIR}..."
  mkdir -p "res/${KEYSTORE_DIR}" || {
    echo "[error] Failed to create directory res/${KEYSTORE_DIR}"; exit 1;
  }
fi

# Check if credentials file exists; if not, generate new passwords
if [ ! -f "$CREDENTIALS_FILE" ]; then
  echo "Generating new keystore passwords and saving them to $CREDENTIALS_FILE..."
  KEY_PASSWORD=$(openssl rand -base64 16 | tr -d /=+ | cut -c1-16)
  KEYSTORE_PASSWORD=$(openssl rand -base64 16 | tr -d /=+ | cut -c1-16)
  KEY_ALIAS="${CLIENT}-key-alias"
  echo "KEY_PASSWORD=$KEY_PASSWORD" > "$CREDENTIALS_FILE"
  echo "KEYSTORE_PASSWORD=$KEYSTORE_PASSWORD" >> "$CREDENTIALS_FILE"
  echo "KEY_ALIAS=$KEY_ALIAS" >> "$KEY_ALIAS"
else
  echo "Loading existing keystore passwords from $CREDENTIALS_FILE..."
  source "$CREDENTIALS_FILE"
fi

# Check if keystore exists and matches credentials
if [ -f "$KEYSTORE_PATH" ]; then
  echo "Keystore already exists: $KEYSTORE_PATH"
  echo "Verifying keystore with existing credentials..."
  keytool -list -keystore "$KEYSTORE_PATH" -storepass "$KEYSTORE_PASSWORD" > /dev/null 2>&1 || {
    echo "[warning] Keystore passwords do not match or keystore is corrupted. Recreating keystore..."
    rm -f "$KEYSTORE_PATH"
  }
fi

# Generate a new keystore if it does not exist
if [ ! -f "$KEYSTORE_PATH" ]; then
  echo "Generating keystore for $CLIENT..."
  keytool -genkeypair -v \
    -keystore "$KEYSTORE_PATH" \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -alias "$KEY_ALIAS" \
    -dname "CN=${CLIENT}, OU=Development, O=Company, L=City, S=State, C=US" \
    -storepass "$KEYSTORE_PASSWORD" \
    -keypass "$KEY_PASSWORD" \
    -storetype "$KEYSTORE_TYPE" || {
    echo "[error] Failed to generate keystore"; exit 1;
  }
fi

# Build quasar
echo "Build quasar"
ENVIRONMENT=${CLIENT} quasar build || {
  echo "[error] Failed to build quasar"; exit 1;
}

# Ensure the assets directory exists
echo "Creating keystore directory..."
if [ ! -d "res/${KEYSTORE_DIR}" ]; then
  echo "Directory res/${KEYSTORE_DIR} does not exist. Copying res/template to res/${KEYSTORE_DIR}..."
  mkdir -p "res/${KEYSTORE_DIR}"
  cp -r "res/template/"* "res/${KEYSTORE_DIR}/"
else
  echo "Directory res/${KEYSTORE_DIR} already exists."
fi

# Build quasar
echo "Build quasar"
ENVIRONMENT=${CLIENT} quasar build || {
  echo "[error] Failed to build quasar"; exit 1;
}

# Remove existing Android folder
echo "Removing existing Android platform..."
rm -rf android || {
  echo "[error] Failed to remove existing Android platform"; exit 1;
}

# Remove existing Ios folder
echo "Removing existing Ios platform..."
rm -rf ios || {
  echo "[error] Failed to remove existing Ios platform"; exit 1;
}

# Update capacitor.config.json
echo "Updating capacitor.config.json for $CLIENT..."
cat > capacitor.config.json <<EOL
{
  "appId": "$PACKAGE_NAME",
  "appName": "$APP_NAME",
  "version": "1.4.8",
  "webDir": "dist/spa",
  "ios": {
    "buildOptions": {
      "developmentTeam": "IntoGolf B.V.",
      "codeSignIdentity": "IntoGolf B.V.",
      "provisioningProfile": "IntoGolf B.V.",
      "deviceFamily": "1",
      "device": "iPhone",
      "scheme": "hildenberg"
    }
  }
}
EOL

# Add Android to the project
echo "Capacitor add Android project..."
npx cap add android || {
  echo "[error] Failed to add Android to project"; exit 1;
}

# Sync Android to the project
echo "Capacitor sync Android project..."
npx cap sync android || {
  echo "[error] Failed to sync Android to project"; exit 1;
}

# Add Ios to the project
echo "Capacitor add Ios project..."
npx cap add ios || {
  echo "[error] Failed to add Ios to project"; exit 1;
}

# Sync Ios to the project
echo "Ios sync Android project..."
npx cap sync ios || {
  echo "[error] Failed to sync Ios to project"; exit 1;
}

# Define paths
CAPACITOR_ASSETS_DIR="assets"
ICON_SRC="res/${CLIENT}/icon.png"
SPLASH_SRC="res/${CLIENT}/splash.png"

# Ensure the assets directory exists
echo "Creating assets directory..."
mkdir -p "$CAPACITOR_ASSETS_DIR"

# Copy and rename the icon
echo "Copying and renaming icon..."
cp "$ICON_SRC" "$CAPACITOR_ASSETS_DIR/icon-only.png" || {
  echo "[error] Failed to copy and rename icon"; exit 1;
}
cp "$ICON_SRC" "$CAPACITOR_ASSETS_DIR/icon-foreground.png" || {
  echo "[error] Failed to copy and rename icon"; exit 1;
}
cp "$ICON_SRC" "$CAPACITOR_ASSETS_DIR/icon-background.png" || {
  echo "[error] Failed to copy and rename icon"; exit 1;
}

# Copy the splash screen
echo "Copying splash screen..."
cp "$SPLASH_SRC" "$CAPACITOR_ASSETS_DIR/splash.png" || {
  echo "[error] Failed to copy splash screen"; exit 1;
}

# Generate assets
echo "Generating assets for Android..."
npx capacitor-assets generate || {
  echo "[error] Asset generation failed"; exit 1;
}

echo "Assets generation completed successfully."

# Navigate to the Android project
cd android || {
  echo "[error] Android directory not found"; exit 1;
}

# Configure signingConfigs and buildTypes in app/build.gradle
echo "Configuring signing for release..."

# Correct relative path to the keystore file from the app module
KEYSTORE_RELATIVE_PATH="../../res/${CLIENT}/${KEYSTORE_NAME}"

# Add signingConfigs if missing
if ! grep -q "signingConfigs {" app/build.gradle; then
  echo "Adding signingConfigs block..."
  sed -i '' '/android {/a\
    signingConfigs {\
        release {\
            keyAlias "'"$KEY_ALIAS"'"\
            keyPassword "'"$KEY_PASSWORD"'"\
            storeFile file("'"$KEYSTORE_RELATIVE_PATH"'")\
            storePassword "'"$KEYSTORE_PASSWORD"'"\
            storeType "'"$KEYSTORE_TYPE"'"\
        }\
    }\
' app/build.gradle
else
  echo "signingConfigs block already exists, adding release configuration..."
  sed -i '' '/signingConfigs {/a\
        release {\
            keyAlias "'"$KEY_ALIAS"'"\
            keyPassword "'"$KEY_PASSWORD"'"\
            storeFile file("'"$KEYSTORE_RELATIVE_PATH"'")\
            storePassword "'"$KEYSTORE_PASSWORD"'"\
            storeType "'"$KEYSTORE_TYPE"'"\
        }\
' app/build.gradle
fi

# Add buildTypes if missing
if ! grep -q "buildTypes {" app/build.gradle; then
  echo "Adding buildTypes block..."
  sed -i '' '/android {/a\
    buildTypes {\
        release {\
            signingConfig signingConfigs.release\
            minifyEnabled true\
            proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"\
        }\
    }\
' app/build.gradle
else
  echo "buildTypes block already exists, adding release configuration..."
  sed -i '' '/buildTypes {/a\
        release {\
            signingConfig signingConfigs.release\
            minifyEnabled true\
            proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"\
        }\
' app/build.gradle
fi

# Clean the project
echo "Cleaning the project..."
./gradlew clean

# Pad naar build.gradle
GRADLE_FILE="app/build.gradle"

# Controleer of het bestand bestaat
if [[ ! -f "$GRADLE_FILE" ]]; then
  echo "Error: $GRADLE_FILE niet gevonden!"
  exit 1
fi

# Huidige versionCode ophalen (compatibel met macOS en Linux)
CURRENT_VERSION_CODE=$(grep 'versionCode' "$GRADLE_FILE" | awk '{print $2}')

# build.gradle aanpassen met nieuwe versionCode (compatibel met macOS & Linux)
sed -i '' "s/versionCode $CURRENT_VERSION_CODE/versionCode $VERSION_CODE/" "$GRADLE_FILE"

echo "✅ VersionCode bijgewerkt: $CURRENT_VERSION_CODE → $VERSION_CODE"

# Build the signed APK
echo "Building the signed APK..."
./gradlew assembleRelease || {
  echo "[error] Failed to build the signed APK"; exit 1;
}

# Copy the APK to a specific location
APK_PATH="app/build/outputs/apk/release/app-release.apk"
DEST_PATH="../res/${CLIENT}/${CLIENT}-release.apk"
if [ -f "$APK_PATH" ]; then
  echo "Copying APK to $DEST_PATH..."
  cp "$APK_PATH" "$DEST_PATH"
else
  echo "[error] APK not found: $APK_PATH"
  exit 1;
fi

echo "Signed APK successfully built and saved to $DEST_PATH"

# Build the signed AAB
echo "Building the signed AAB..."
./gradlew bundleRelease || {
  echo "[error] Failed to build the signed AAB"; exit 1;
}

# Copy the AAB to a specific location
AAB_PATH="app/build/outputs/bundle/release/app-release.aab"
DEST_AAB_PATH="../res/${CLIENT}/${CLIENT}-release.aab"
if [ -f "$AAB_PATH" ]; then
  echo "Copying AAB to $DEST_AAB_PATH..."
  cp "$AAB_PATH" "$DEST_AAB_PATH"
else
  echo "[error] AAB not found: $AAB_PATH"
  exit 1;
fi


# Navigate back to the project root
cd -

echo "Android app for $CLIENT configured, signed, and built successfully!"

npx @capgo/cli app add ${PACKAGE_NAME}

npx @capgo/cli bundle upload ${PACKAGE_NAME}
