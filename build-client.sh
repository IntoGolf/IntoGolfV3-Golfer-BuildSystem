#!/bin/bash

# Ensure a client name is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <client_name>"
  exit 1
fi

CLIENT=$1
APP_NAME="${CLIENT}"
PACKAGE_NAME="nl.intogolf.${CLIENT}"

# Keystore configuration
KEYSTORE_DIR="${CLIENT}"
KEYSTORE_NAME="${CLIENT}.keystore"
KEY_ALIAS="${CLIENT}-key-alias"
KEY_PASSWORD="aDitIsEenTestPassword"
KEYSTORE_PASSWORD="bDitIsEenTestPassword"
KEYSTORE_PATH="res/${KEYSTORE_DIR}/${KEYSTORE_NAME}"
KEYSTORE_TYPE="JKS" # Default to JKS, update if needed

# Build quasar
echo "Build quasar"
npm run build:${CLIENT}:app || {
  echo "[error] Failed to build quasar"; exit 1;
}

# Generate a keystore if it doesn't already exist
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
else
  echo "Keystore already exists: $KEYSTORE_PATH"
fi

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

