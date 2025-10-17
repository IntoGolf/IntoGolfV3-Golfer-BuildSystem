#!/bin/bash

# IntoGolf Build Script v2.1
# Now with automatic build number increment

# Ensure a client name is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <client_name> [options]"
  echo ""
  echo "Options:"
  echo "  --no-increment     Don't auto-increment the build number"
  echo "  --clear-cache      Clear Xcode cache after iOS build"
  echo "  --open-xcode       Open Xcode after build"
  echo "  --open-ios         Open iOS app in Simulator after build"
  echo "  --open-android     Open Android app in emulator/device after build"
  echo "  --open-studio      Open Android Studio after build"
  exit 1
fi

CLIENT=$1
ENV_FILE="env/.env.${CLIENT}"
NO_INCREMENT=false
CLEAR_CACHE=false
OPEN_XCODE=false
OPEN_IOS=false
OPEN_ANDROID=false
OPEN_STUDIO=false

# Check for flags
for arg in "${@:2}"; do
  case $arg in
    --no-increment)
      NO_INCREMENT=true
      ;;
    --clear-cache)
      CLEAR_CACHE=true
      ;;
    --open-xcode)
      OPEN_XCODE=true
      ;;
    --open-ios)
      OPEN_IOS=true
      ;;
    --open-android)
      OPEN_ANDROID=true
      ;;
    --open-studio)
      OPEN_STUDIO=true
      ;;
  esac
done

# Check if environment file exists
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Environment file not found: $ENV_FILE"
  echo ""
  echo "Available clients:"
  ls env/.env.* | sed 's/env\/.env./  - /' | grep -v template
  exit 1
fi

echo "📋 Loading configuration from $ENV_FILE"
source "$ENV_FILE"

echo ""
echo "🌍 Environment Configuration:"
echo "   VUE_APP_BASE_URL: ${VUE_APP_BASE_URL:-'NOT SET'}"
echo "   APP_ID: ${APP_ID:-'NOT SET'}"
echo "   APP_DISPLAY_NAME: ${APP_DISPLAY_NAME:-'NOT SET'}"
echo "   VUE_APP_ENABLE_PUSH_NOTIFICATIONS: ${VUE_APP_ENABLE_PUSH_NOTIFICATIONS:-'NOT SET'}"
echo ""

# Function to increment build number
increment_build_number() {
  local current_build="${APP_BUILD_NUMBER:-0}"
  local new_build=$((current_build + 1))

  echo "📈 Incrementing build number: $current_build → $new_build"

  # Update the env file
  if grep -q "^APP_BUILD_NUMBER=" "$ENV_FILE"; then
    sed -i '' "s/^APP_BUILD_NUMBER=.*/APP_BUILD_NUMBER=$new_build/" "$ENV_FILE"
  else
    echo "APP_BUILD_NUMBER=$new_build" >> "$ENV_FILE"
  fi

  # Also update Android version code if it exists
  if grep -q "^ANDROID_VERSION_CODE=" "$ENV_FILE"; then
    sed -i '' "s/^ANDROID_VERSION_CODE=.*/ANDROID_VERSION_CODE=$new_build/" "$ENV_FILE"
  fi

  # Reload the environment with new build number
  APP_BUILD_NUMBER=$new_build
  ANDROID_VERSION_CODE=$new_build

  return $new_build
}

# Auto-increment build number unless disabled
if [ "$NO_INCREMENT" = false ]; then
  increment_build_number
else
  echo "ℹ️  Build number increment disabled (using $APP_BUILD_NUMBER)"
fi

# Export environment variables for build process
export ENVIRONMENT=$CLIENT

# Use variables from env file with fallbacks for backward compatibility
APP_NAME="${APP_DISPLAY_NAME:-${CLIENT^}}"
PACKAGE_NAME="${APP_ID:-nl.intogolf.${CLIENT}}"
VERSION_CODE="${ANDROID_VERSION_CODE:-$APP_BUILD_NUMBER}"
IOS_VERSION="${APP_VERSION:-1.4.10}"
IOS_BUILD_NUMBER="${APP_BUILD_NUMBER:-1}"

echo ""
echo "=========================================="
echo "🚀 Building ${APP_NAME}"
echo "=========================================="
echo "   Package: ${PACKAGE_NAME}"
echo "   Version: ${APP_VERSION} (Build ${APP_BUILD_NUMBER})"
echo "   Android SDK: ${ANDROID_TARGET_SDK}"
echo "   iOS Target: ${IOS_DEPLOYMENT_TARGET}"
echo "=========================================="
echo ""

# Load secrets using the new secrets management system
echo "🔐 Loading secure secrets for client: $CLIENT"
if [ -f ".secrets/${CLIENT}.env" ]; then
  source ".secrets/${CLIENT}.env"
  echo "✅ Loaded secrets from .secrets/${CLIENT}.env"
else
  echo "⚠️  No secrets found for client: $CLIENT"
  echo "   Generating new secrets..."
  node scripts/secrets-manager.js generate "$CLIENT" || {
    echo "[error] Failed to generate secrets for $CLIENT"; exit 1;
  }
  source ".secrets/${CLIENT}.env"
fi

# Keystore configuration using secure location
KEYSTORE_NAME="${CLIENT}.keystore"
KEYSTORE_PATH=".secrets/${KEYSTORE_NAME}"
KEYSTORE_TYPE="JKS"

# Ensure the .secrets directory exists
if [ ! -d ".secrets" ]; then
  echo "Creating .secrets directory..."
  mkdir -p ".secrets" || {
    echo "[error] Failed to create .secrets directory"; exit 1;
  }
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
  if [ -d "res/template" ]; then
    cp -r "res/template/"* "res/${KEYSTORE_DIR}/" 2>/dev/null || true
  fi
else
  echo "Directory res/${KEYSTORE_DIR} already exists."
fi

# Remove existing Android folder
if [ "$BUILD_ANDROID" = "true" ]; then
  echo "Removing existing Android platform..."
  rm -rf android || {
    echo "[error] Failed to remove existing Android platform"; exit 1;
  }
fi

# Handle iOS folder - preserve important configurations
if [ "$BUILD_IOS" = "true" ]; then
  if [ -d "ios" ]; then
    echo "🔧 Preserving existing iOS configurations..."

    # Create backup directory
    BACKUP_DIR=".ios-backup-$(date +%s)"
    mkdir -p "$BACKUP_DIR"

    # Backup critical files that shouldn't be overwritten
    IOS_FILES_TO_PRESERVE=(
      "ios/App/App/GoogleService-Info.plist"
      "ios/App/App/AppDelegate.swift"
      "ios/App/App/App.entitlements"
    )

    for file in "${IOS_FILES_TO_PRESERVE[@]}"; do
      if [ -f "$file" ]; then
        echo "📋 Backing up: $file"
        cp "$file" "$BACKUP_DIR/$(basename "$file")"
      fi
    done

    echo "Removing existing iOS platform..."
    rm -rf ios || {
      echo "[error] Failed to remove existing iOS platform"; exit 1;
    }
  else
    echo "No existing iOS platform found."
  fi
fi

# Generate capacitor.config.json using secure configuration system
echo "🔧 Generating capacitor.config.json for $CLIENT..."
ENVIRONMENT=$CLIENT node scripts/generate-capacitor-config.js || {
  echo "[error] Failed to generate capacitor configuration"; exit 1;
}

# Build Android if enabled
if [ "$BUILD_ANDROID" = "true" ]; then
  echo ""
  echo "=========================================="
  echo "📱 Building Android"
  echo "=========================================="

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

  # Update Android SDK versions (cross-platform sed)
  echo "Updating Android SDK versions..."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/compileSdkVersion = .*/compileSdkVersion = $ANDROID_COMPILE_SDK/" android/variables.gradle
    sed -i '' "s/targetSdkVersion = .*/targetSdkVersion = $ANDROID_TARGET_SDK/" android/variables.gradle
    sed -i '' "s/minSdkVersion = .*/minSdkVersion = $ANDROID_MIN_SDK/" android/variables.gradle
  else
    # Linux
    sed -i "s/compileSdkVersion = .*/compileSdkVersion = $ANDROID_COMPILE_SDK/" android/variables.gradle
    sed -i "s/targetSdkVersion = .*/targetSdkVersion = $ANDROID_TARGET_SDK/" android/variables.gradle
    sed -i "s/minSdkVersion = .*/minSdkVersion = $ANDROID_MIN_SDK/" android/variables.gradle
  fi

  # Update Gradle versions for compatibility with SDK 35 (cross-platform sed)
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' 's/com.android.tools.build:gradle:8.2.1/com.android.tools.build:gradle:8.5.2/' android/build.gradle
    sed -i '' 's/com.android.tools.build:gradle:8.3.2/com.android.tools.build:gradle:8.5.2/' android/build.gradle
    sed -i '' 's/gradle-8.2.1-all.zip/gradle-8.10-all.zip/' android/gradle/wrapper/gradle-wrapper.properties
    sed -i '' 's/gradle-8.4-all.zip/gradle-8.10-all.zip/' android/gradle/wrapper/gradle-wrapper.properties
  else
    # Linux
    sed -i 's/com.android.tools.build:gradle:8.2.1/com.android.tools.build:gradle:8.5.2/' android/build.gradle
    sed -i 's/com.android.tools.build:gradle:8.3.2/com.android.tools.build:gradle:8.5.2/' android/build.gradle
    sed -i 's/gradle-8.2.1-all.zip/gradle-8.10-all.zip/' android/gradle/wrapper/gradle-wrapper.properties
    sed -i 's/gradle-8.4-all.zip/gradle-8.10-all.zip/' android/gradle/wrapper/gradle-wrapper.properties
  fi

  # Force update variables.gradle to ensure API 35
  echo "Forcing Android API 35 configuration..."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' 's/compileSdkVersion = [0-9]*/compileSdkVersion = 35/' android/variables.gradle
    sed -i '' 's/targetSdkVersion = [0-9]*/targetSdkVersion = 35/' android/variables.gradle
  else
    sed -i 's/compileSdkVersion = [0-9]*/compileSdkVersion = 35/' android/variables.gradle
    sed -i 's/targetSdkVersion = [0-9]*/targetSdkVersion = 35/' android/variables.gradle
  fi

  # Continue with Android build steps...
  cd android || exit 1

  # Update version code and name in build.gradle (signing config is already properly configured)
  echo "Updating version information..."
  sed -i '' "s/versionCode .*/versionCode $VERSION_CODE/" app/build.gradle
  sed -i '' "s/versionName .*/versionName \"$APP_VERSION\"/" app/build.gradle

  echo "✅ Android configuration updated with secure keystore path"

  # Build APK and AAB
  echo "Building Android release..."
  ./gradlew clean
  ./gradlew assembleRelease || {
    echo "[error] Failed to build APK"
  }
  ./gradlew bundleRelease || {
    echo "[error] Failed to build AAB"
  }

  # Copy outputs
  APK_PATH="app/build/outputs/apk/release/app-release.apk"
  AAB_PATH="app/build/outputs/bundle/release/app-release.aab"

  if [ -f "$APK_PATH" ]; then
    cp "$APK_PATH" "../res/${CLIENT}/${CLIENT}-release.apk"
    echo "✅ APK saved to res/${CLIENT}/${CLIENT}-release.apk"
  fi

  if [ -f "$AAB_PATH" ]; then
    cp "$AAB_PATH" "../res/${CLIENT}/${CLIENT}-release.aab"
    echo "✅ AAB saved to res/${CLIENT}/${CLIENT}-release.aab"
  fi

  cd ..
fi

# Build iOS if enabled
if [ "$BUILD_IOS" = "true" ]; then
  echo ""
  echo "=========================================="
  echo "🍎 Building iOS"
  echo "=========================================="

  # Add iOS to the project
  echo "Capacitor add iOS project..."
  npx cap add ios || {
    echo "[error] Failed to add iOS to project"; exit 1;
  }

  # Sync iOS to the project
  echo "Capacitor sync iOS project..."
  npx cap sync ios || {
    echo "[error] Failed to sync iOS to project"; exit 1;
  }

  # Restore preserved iOS configurations
  if [ -n "$BACKUP_DIR" ] && [ -d "$BACKUP_DIR" ]; then
    echo "🔄 Restoring preserved iOS configurations..."

    # Restore GoogleService-Info.plist
    if [ -f "$BACKUP_DIR/GoogleService-Info.plist" ]; then
      echo "📋 Restoring: GoogleService-Info.plist"
      cp "$BACKUP_DIR/GoogleService-Info.plist" "ios/App/App/GoogleService-Info.plist"
    fi

    # Restore AppDelegate.swift
    if [ -f "$BACKUP_DIR/AppDelegate.swift" ]; then
      echo "📋 Restoring: AppDelegate.swift"
      cp "$BACKUP_DIR/AppDelegate.swift" "ios/App/App/AppDelegate.swift"
    fi

    # Restore App.entitlements
    if [ -f "$BACKUP_DIR/App.entitlements" ]; then
      echo "📋 Restoring: App.entitlements"
      cp "$BACKUP_DIR/App.entitlements" "ios/App/App/App.entitlements"

      # Ensure the entitlements file is properly linked in Xcode project
      PBXPROJ="ios/App/App.xcodeproj/project.pbxproj"
      if [ -f "$PBXPROJ" ]; then
        # Add entitlements reference if not present
        if ! grep -q "App.entitlements" "$PBXPROJ"; then
          echo "🔗 Linking entitlements file in Xcode project..."
          sed -i '' 's|CODE_SIGN_ENTITLEMENTS = "";|CODE_SIGN_ENTITLEMENTS = App/App.entitlements;|g' "$PBXPROJ"
        fi
      fi
    fi

    # Ensure entitlements are properly configured in Xcode project
    PBXPROJ="ios/App/App.xcodeproj/project.pbxproj"
    if [ -f "$PBXPROJ" ] && [ -f "ios/App/App/App.entitlements" ]; then
      echo "🔗 Ensuring entitlements are linked in Xcode project..."
      # Add CODE_SIGN_ENTITLEMENTS to both Debug and Release configurations
      if ! grep -q "CODE_SIGN_ENTITLEMENTS" "$PBXPROJ"; then
        python3 - <<EOF
import sys
import re

pbxproj_path = "$PBXPROJ"

with open(pbxproj_path, 'r') as f:
    content = f.read()

# Add CODE_SIGN_ENTITLEMENTS to app target buildSettings (both Debug and Release)
pattern = r'(\s+buildSettings = \{\s+ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;\s+)CODE_SIGN_STYLE'
replacement = r'\1CODE_SIGN_ENTITLEMENTS = App/App.entitlements;\n\t\t\t\tCODE_SIGN_STYLE'

content = re.sub(pattern, replacement, content)

with open(pbxproj_path, 'w') as f:
    f.write(content)

print("✅ Added CODE_SIGN_ENTITLEMENTS to Xcode project")
EOF
      else
        echo "✅ CODE_SIGN_ENTITLEMENTS already configured"
      fi
    fi

    # Clean up backup directory
    rm -rf "$BACKUP_DIR"
    echo "✅ iOS configurations restored"
  fi

  # Configure iOS settings
  echo "Configuring iOS project..."

  INFO_PLIST="ios/App/App/Info.plist"
  if [ -f "$INFO_PLIST" ]; then
    echo "📝 Updating Info.plist..."

    # Display name
    /usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName '$APP_DISPLAY_NAME'" "$INFO_PLIST"

    # Version - IMPORTANT: Use the new build number
    /usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $APP_VERSION" "$INFO_PLIST"
    /usr/libexec/PlistBuddy -c "Set :CFBundleVersion $APP_BUILD_NUMBER" "$INFO_PLIST"

    # App category
    if [ "$IOS_APP_CATEGORY" = "Sports" ]; then
      /usr/libexec/PlistBuddy -c "Add :LSApplicationCategoryType string public.app-category.sports" "$INFO_PLIST" 2>/dev/null || \
      /usr/libexec/PlistBuddy -c "Set :LSApplicationCategoryType public.app-category.sports" "$INFO_PLIST"
    fi

    # Device family
    if [ "$IOS_DEVICE_FAMILY" = "iPhone" ]; then
      /usr/libexec/PlistBuddy -c "Delete :UIDeviceFamily" "$INFO_PLIST" 2>/dev/null || true
      /usr/libexec/PlistBuddy -c "Add :UIDeviceFamily array" "$INFO_PLIST"
      /usr/libexec/PlistBuddy -c "Add :UIDeviceFamily:0 integer 1" "$INFO_PLIST"
    fi

    # Orientation
    if [ "$IOS_ORIENTATION" = "Portrait" ]; then
      /usr/libexec/PlistBuddy -c "Delete :UISupportedInterfaceOrientations" "$INFO_PLIST" 2>/dev/null || true
      /usr/libexec/PlistBuddy -c "Add :UISupportedInterfaceOrientations array" "$INFO_PLIST"
      /usr/libexec/PlistBuddy -c "Add :UISupportedInterfaceOrientations:0 string UIInterfaceOrientationPortrait" "$INFO_PLIST"
    fi
  fi

  # Update project.pbxproj
  PBXPROJ="ios/App/App.xcodeproj/project.pbxproj"
  if [ -f "$PBXPROJ" ]; then
    echo "🔨 Updating Xcode project settings..."

    # Create Python script for robust pbxproj updates
    cat > /tmp/update_pbxproj.py << PYTHON_SCRIPT
import sys
import re

pbxproj_path = sys.argv[1]
version = sys.argv[2]
build = sys.argv[3]
display_name = sys.argv[4]
bundle_id = sys.argv[5]

with open(pbxproj_path, 'r') as f:
    content = f.read()

# Function to update or add a setting in all buildSettings blocks
def update_or_add_setting(content, key, value, is_string=True):
    if is_string:
        value_formatted = f'"{value}"'
    else:
        value_formatted = str(value)

    # Check if key exists and update it
    pattern = rf'{key} = [^;]*;'
    replacement = f'{key} = {value_formatted};'

    if re.search(pattern, content):
        content = re.sub(pattern, replacement, content)
    else:
        # Add to all buildSettings blocks
        content = re.sub(
            r'(buildSettings = \{[^}]*)',
            rf'\1\n\t\t\t\t{key} = {value_formatted};',
            content
        )

    return content

# Update all required settings
content = update_or_add_setting(content, 'MARKETING_VERSION', version)
content = update_or_add_setting(content, 'CURRENT_PROJECT_VERSION', build)
content = update_or_add_setting(content, 'PRODUCT_NAME', display_name)
content = update_or_add_setting(content, 'PRODUCT_BUNDLE_IDENTIFIER', bundle_id)
content = update_or_add_setting(content, 'INFOPLIST_KEY_CFBundleDisplayName', display_name)
content = update_or_add_setting(content, 'INFOPLIST_KEY_LSApplicationCategoryType', 'public.app-category.sports')
content = update_or_add_setting(content, 'TARGETED_DEVICE_FAMILY', '1', is_string=False)
content = update_or_add_setting(content, 'SUPPORTED_PLATFORMS', 'iphoneos iphonesimulator')
content = update_or_add_setting(content, 'SUPPORTS_MAC_DESIGNED_FOR_IPHONE_IPAD', 'NO', is_string=False)
content = update_or_add_setting(content, 'SUPPORTS_MACCATALYST', 'NO', is_string=False)
content = update_or_add_setting(content, 'SUPPORTS_XR_DESIGNED_FOR_IPHONE_IPAD', 'NO', is_string=False)

# Update target display name in the project (visual only)
content = update_or_add_setting(content, 'TARGET_NAME', display_name)
content = update_or_add_setting(content, 'PRODUCT_MODULE_NAME', 'App')  # Keep this as App for compatibility

with open(pbxproj_path, 'w') as f:
    f.write(content)

print(f"✅ Updated Xcode project settings")
print(f"   Version: {version}")
print(f"   Build: {build}")
print(f"   Display Name: {display_name}")
PYTHON_SCRIPT

    # Run the Python script
    python3 /tmp/update_pbxproj.py "$PBXPROJ" "$APP_VERSION" "$APP_BUILD_NUMBER" "$APP_DISPLAY_NAME" "$APP_ID"

    # Clean up
    rm -f /tmp/update_pbxproj.py
  fi
fi

# Define paths for assets
CAPACITOR_ASSETS_DIR="assets"
ICON_SRC="res/${CLIENT}/icon.png"
SPLASH_SRC="res/${CLIENT}/splash.png"

# Generate assets if files exist
if [ -f "$ICON_SRC" ] && [ -f "$SPLASH_SRC" ]; then
  echo "Generating assets..."
  mkdir -p "$CAPACITOR_ASSETS_DIR"

  cp "$ICON_SRC" "$CAPACITOR_ASSETS_DIR/icon-only.png"
  cp "$ICON_SRC" "$CAPACITOR_ASSETS_DIR/icon-foreground.png"
  cp "$ICON_SRC" "$CAPACITOR_ASSETS_DIR/icon-background.png"
  cp "$SPLASH_SRC" "$CAPACITOR_ASSETS_DIR/splash.png"

  npx capacitor-assets generate || {
    echo "[warning] Asset generation failed"
  }
fi

# Upload to Capgo if enabled
if [ "$UPLOAD_TO_CAPGO" = "true" ]; then
  echo ""
  echo "📤 Uploading to Capgo..."
  npx @capgo/cli app add ${PACKAGE_NAME} 2>/dev/null || true
  npx @capgo/cli bundle upload ${PACKAGE_NAME}
fi

# Save build history
BUILD_HISTORY_FILE="res/${CLIENT}/build-history.log"
echo "$(date '+%Y-%m-%d %H:%M:%S') - Version ${APP_VERSION} (Build ${APP_BUILD_NUMBER})" >> "$BUILD_HISTORY_FILE"

# Final summary
echo ""
echo "=========================================="
echo "✅ Build completed for ${APP_DISPLAY_NAME}"
echo "=========================================="
echo ""
echo "📱 Configuration Summary:"
echo "   Display Name: ${APP_DISPLAY_NAME}"
echo "   Bundle ID: ${PACKAGE_NAME}"
echo "   Version: ${APP_VERSION} (Build ${APP_BUILD_NUMBER})"
echo ""

if [ "$BUILD_ANDROID" = "true" ]; then
  echo "🤖 Android:"
  echo "   APK: res/${CLIENT}/${CLIENT}-release.apk"
  echo "   AAB: res/${CLIENT}/${CLIENT}-release.aab"
  echo "   SDK: ${ANDROID_TARGET_SDK}"
  echo ""
fi

if [ "$BUILD_IOS" = "true" ]; then
  echo "🍎 iOS:"
  echo "   Project: ios/App/App.xcworkspace"
  echo "   Device: ${IOS_DEVICE_FAMILY}"
  echo "   Category: ${IOS_APP_CATEGORY}"
  echo "   Orientation: ${IOS_ORIENTATION}"
  echo ""
  echo "   Next steps:"
  echo "   1. Clear Xcode cache (recommended):"
  echo "      rm -rf ~/Library/Developer/Xcode/DerivedData/*"
  echo "   2. Open: open ios/App/App.xcworkspace"
  echo "   3. Select team: ${IOS_DEVELOPMENT_TEAM}"
  echo "   4. Archive and upload to App Store"
  echo ""
  echo "   💡 Tip: If version/build shows wrong in Xcode:"
  echo "      - Close Xcode completely (Cmd+Q)"
  echo "      - Clear cache with command above"
  echo "      - Reopen the project"
fi

echo ""
echo "📊 Build History:"
tail -n 5 "$BUILD_HISTORY_FILE" 2>/dev/null || echo "   First build!"
echo ""

# Post-build actions
if [ "$BUILD_IOS" = "true" ]; then
  if [ "$CLEAR_CACHE" = true ]; then
    echo "🧹 Clearing Xcode cache..."
    rm -rf ~/Library/Developer/Xcode/DerivedData/*
    echo "✅ Xcode cache cleared"
  fi

  if [ "$OPEN_XCODE" = true ]; then
    echo "🚀 Opening Xcode..."
    open ios/App/App.xcworkspace
  fi

  if [ "$OPEN_IOS" = true ]; then
    echo "📱 Opening iOS app in Simulator..."

    # Clean up the app name for file paths (remove spaces)
    APP_NAME_SAFE=$(echo "$APP_DISPLAY_NAME" | tr ' ' '_')

    # First, build the app for simulator
    cd ios/App

    echo "🔨 Building for Simulator..."
    xcodebuild -workspace App.xcworkspace \
      -scheme App \
      -configuration Debug \
      -sdk iphonesimulator \
      -derivedDataPath build \
      -quiet 2>&1 | grep -E "(error:|warning:|FAILED|SUCCEEDED|\*\*)" || true

    # Check if build succeeded
    if [ ${PIPESTATUS[0]} -ne 0 ]; then
        echo "❌ Build failed"
        cd ../..
        exit 1
    fi

    # Find the actual app path (handles spaces in name)
    APP_PATH=$(find build/Build/Products/Debug-iphonesimulator -name "*.app" -type d | head -1)

    if [ -z "$APP_PATH" ]; then
      echo "❌ Could not find built app"
      cd ../..
      exit 1
    fi

    echo "📦 Found app at: $APP_PATH"

    # Open Simulator
    echo "🚀 Starting Simulator..."
    open -a Simulator

    # Wait for simulator to boot
    sleep 5

    # Get the booted device or boot one
    DEVICE_ID=$(xcrun simctl list devices | grep "Booted" | head -1 | grep -o "[A-F0-9\-]\{36\}")

    if [ -z "$DEVICE_ID" ]; then
      echo "📱 Booting iPhone simulator..."
      # Get first available iPhone
      DEVICE_ID=$(xcrun simctl list devices | grep "iPhone" | grep -v "unavailable" | head -1 | grep -o "[A-F0-9\-]\{36\}")
      if [ ! -z "$DEVICE_ID" ]; then
        xcrun simctl boot $DEVICE_ID 2>/dev/null || true
        sleep 5
      else
        echo "⚠️  No iPhone simulator found"
        cd ../..
        exit 1
      fi
    fi

    echo "📲 Installing app..."
    xcrun simctl install "$DEVICE_ID" "$APP_PATH" || {
      echo "❌ Failed to install app"
      cd ../..
      exit 1
    }

    echo "🚀 Launching app..."
    xcrun simctl launch "$DEVICE_ID" "$PACKAGE_NAME" || {
      echo "⚠️  Could not launch app, but it's installed. Try launching manually."
    }

    echo "✅ iOS app launched in Simulator"
    cd ../..
  fi
fi

if [ "$BUILD_ANDROID" = "true" ]; then
  if [ "$OPEN_STUDIO" = true ]; then
    echo "🤖 Opening Android Studio..."
    open -a "Android Studio" android 2>/dev/null || studio android 2>/dev/null || {
      echo "⚠️  Android Studio not found. Please open manually."
    }
  fi

  if [ "$OPEN_ANDROID" = true ]; then
    echo "📱 Opening Android app..."

    # Check if any device/emulator is running
    DEVICE_COUNT=$(adb devices | grep -v "List" | grep -v "^$" | wc -l)

    if [ "$DEVICE_COUNT" -eq 0 ]; then
      echo "🚀 Starting Android emulator..."
      # Try to start the first available emulator
      EMULATOR=$(emulator -list-avds | head -1)
      if [ ! -z "$EMULATOR" ]; then
        emulator -avd "$EMULATOR" &
        echo "⏳ Waiting for emulator to boot..."
        adb wait-for-device
        sleep 10
      else
        echo "⚠️  No Android emulator found. Please start one manually."
        echo "   You can create one in Android Studio > AVD Manager"
      fi
    fi

    # Install and launch the APK
    if [ -f "res/${CLIENT}/${CLIENT}-release.apk" ]; then
      echo "📲 Installing APK..."
      adb install -r "res/${CLIENT}/${CLIENT}-release.apk"

      echo "🚀 Launching app..."
      # Launch the app
      adb shell monkey -p "$PACKAGE_NAME" -c android.intent.category.LAUNCHER 1
      echo "✅ Android app launched"
    else
      echo "⚠️  APK not found. Build may have failed."
    fi
  fi
fi

echo "🊎 Done!"
