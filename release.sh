#!/bin/bash

# IntoGolf App Release Script
# Automatiseert het release proces voor iOS en Android

set -e  # Stop bij errors

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_color() {
    printf "${1}${2}${NC}\n"
}

# Check if client name is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <client_name> [options]"
    echo ""
    echo "Options:"
    echo "  --major              Increment major version (1.0.0 -> 2.0.0)"
    echo "  --minor              Increment minor version (1.0.0 -> 1.1.0)"
    echo "  --patch              Increment patch version (1.0.0 -> 1.0.1) [default]"
    echo "  --version <version>  Set specific version (e.g., 1.5.0)"
    echo "  --skip-ios           Skip iOS build"
    echo "  --skip-android       Skip Android build"
    echo "  --testflight         Upload to TestFlight (iOS)"
    echo "  --play-console       Open Play Console after build"
    echo "  --release-notes      Edit release notes before building"
    exit 1
fi

CLIENT=$1
ENV_FILE="env/.env.${CLIENT}"
SKIP_IOS=false
SKIP_ANDROID=false
TESTFLIGHT=false
PLAY_CONSOLE=false
EDIT_NOTES=false
VERSION_TYPE="patch"
SPECIFIC_VERSION=""

# Parse arguments
for arg in "${@:2}"; do
    case $arg in
        --major)
            VERSION_TYPE="major"
            ;;
        --minor)
            VERSION_TYPE="minor"
            ;;
        --patch)
            VERSION_TYPE="patch"
            ;;
        --version)
            shift
            SPECIFIC_VERSION="${@:2:1}"
            ;;
        --skip-ios)
            SKIP_IOS=true
            ;;
        --skip-android)
            SKIP_ANDROID=true
            ;;
        --testflight)
            TESTFLIGHT=true
            ;;
        --play-console)
            PLAY_CONSOLE=true
            ;;
        --release-notes)
            EDIT_NOTES=true
            ;;
    esac
done

# Check if environment file exists
if [ ! -f "$ENV_FILE" ]; then
    print_color "$RED" "❌ Environment file not found: $ENV_FILE"
    exit 1
fi

# Load current configuration
source "$ENV_FILE"

# Function to increment version
increment_version() {
    local version=$1
    local type=$2
    
    # Split version into components
    IFS='.' read -r major minor patch <<< "$version"
    
    case $type in
        major)
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        minor)
            minor=$((minor + 1))
            patch=0
            ;;
        patch)
            patch=$((patch + 1))
            ;;
    esac
    
    echo "${major}.${minor}.${patch}"
}

# Determine new version
if [ ! -z "$SPECIFIC_VERSION" ]; then
    NEW_VERSION="$SPECIFIC_VERSION"
else
    NEW_VERSION=$(increment_version "$APP_VERSION" "$VERSION_TYPE")
fi

# Increment build number
NEW_BUILD_NUMBER=$((APP_BUILD_NUMBER + 1))

print_color "$BLUE" "=========================================="
print_color "$BLUE" "🚀 Release Process for ${APP_DISPLAY_NAME}"
print_color "$BLUE" "=========================================="
echo ""
print_color "$YELLOW" "Current Version: ${APP_VERSION} (Build ${APP_BUILD_NUMBER})"
print_color "$GREEN" "New Version: ${NEW_VERSION} (Build ${NEW_BUILD_NUMBER})"
echo ""

# Create release notes file if it doesn't exist
RELEASE_NOTES_DIR="release-notes"
RELEASE_NOTES_FILE="${RELEASE_NOTES_DIR}/${CLIENT}-${NEW_VERSION}.md"

if [ ! -d "$RELEASE_NOTES_DIR" ]; then
    mkdir -p "$RELEASE_NOTES_DIR"
fi

if [ ! -f "$RELEASE_NOTES_FILE" ]; then
    cat > "$RELEASE_NOTES_FILE" << EOF
# Version ${NEW_VERSION}

## English
- Bug fixes and performance improvements
- Enhanced user experience

## Nederlands  
- Bug fixes en prestatie verbeteringen
- Verbeterde gebruikerservaring

## Español
- Correcciones de errores y mejoras de rendimiento
- Experiencia de usuario mejorada
EOF
fi

# Edit release notes if requested
if [ "$EDIT_NOTES" = true ]; then
    print_color "$YELLOW" "📝 Opening release notes for editing..."
    ${EDITOR:-nano} "$RELEASE_NOTES_FILE"
fi

# Show release notes
print_color "$BLUE" "📋 Release Notes:"
cat "$RELEASE_NOTES_FILE"
echo ""

# Confirm before proceeding
read -p "Do you want to proceed with the release? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_color "$RED" "❌ Release cancelled"
    exit 1
fi

# Update version numbers in env file
print_color "$YELLOW" "📝 Updating version numbers..."
sed -i '' "s/APP_VERSION=.*/APP_VERSION=$NEW_VERSION/" "$ENV_FILE"
sed -i '' "s/APP_BUILD_NUMBER=.*/APP_BUILD_NUMBER=$NEW_BUILD_NUMBER/" "$ENV_FILE"
sed -i '' "s/ANDROID_VERSION_CODE=.*/ANDROID_VERSION_CODE=$NEW_BUILD_NUMBER/" "$ENV_FILE"
sed -i '' "s/ANDROID_VERSION_NAME=.*/ANDROID_VERSION_NAME=$NEW_VERSION/" "$ENV_FILE"

# Clean build
print_color "$YELLOW" "🧹 Cleaning previous builds..."
rm -rf ios/App/build 2>/dev/null || true
rm -rf android/app/build 2>/dev/null || true

# Build the app
print_color "$YELLOW" "🔨 Building app..."
./build-client-v2.sh "$CLIENT" --clear-cache

# iOS Release
if [ "$SKIP_IOS" = false ] && [ "$BUILD_IOS" = "true" ]; then
    print_color "$BLUE" "=========================================="
    print_color "$BLUE" "📱 iOS Release"
    print_color "$BLUE" "=========================================="
    
    cd ios/App
    
    # Clean build folder
    rm -rf build/
    rm -rf ~/Library/Developer/Xcode/DerivedData/*
    
    # Build archive
    print_color "$YELLOW" "📦 Creating iOS Archive..."
    xcodebuild -workspace App.xcworkspace \
        -scheme App \
        -sdk iphoneos \
        -configuration Release \
        -archivePath build/App.xcarchive \
        archive \
        DEVELOPMENT_TEAM="$IOS_DEVELOPMENT_TEAM" \
        PRODUCT_BUNDLE_IDENTIFIER="$APP_ID" \
        MARKETING_VERSION="$NEW_VERSION" \
        CURRENT_PROJECT_VERSION="$NEW_BUILD_NUMBER" \
        -quiet || {
            print_color "$RED" "❌ Archive failed"
            exit 1
        }
    
    print_color "$GREEN" "✅ Archive created successfully"
    
    # Export archive
    print_color "$YELLOW" "📤 Exporting Archive..."
    
    # Create ExportOptions.plist
    cat > ExportOptions.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>$IOS_DEVELOPMENT_TEAM</string>
    <key>uploadBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <true/>
    <key>compileBitcode</key>
    <false/>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>provisioningProfiles</key>
    <dict>
        <key>$APP_ID</key>
        <string>Automatic</string>
    </dict>
</dict>
</plist>
EOF
    
    xcodebuild -exportArchive \
        -archivePath build/App.xcarchive \
        -exportPath build/Export \
        -exportOptionsPlist ExportOptions.plist \
        -quiet || {
            print_color "$RED" "❌ Export failed"
            exit 1
        }
    
    print_color "$GREEN" "✅ IPA exported successfully"
    
    # Upload to App Store Connect
    if [ "$TESTFLIGHT" = true ]; then
        print_color "$YELLOW" "🚀 Uploading to TestFlight..."
        xcrun altool --upload-app \
            -f build/Export/App.ipa \
            -t ios \
            --apiKey "$APP_STORE_API_KEY" \
            --apiIssuer "$APP_STORE_ISSUER_ID" \
            --verbose || {
                print_color "$YELLOW" "⚠️  Automatic upload failed. Please upload manually via Xcode."
            }
    else
        print_color "$YELLOW" "📱 To upload to App Store Connect:"
        print_color "$YELLOW" "   1. Open Xcode"
        print_color "$YELLOW" "   2. Window → Organizer"
        print_color "$YELLOW" "   3. Select the archive and click 'Distribute App'"
        print_color "$YELLOW" ""
        print_color "$YELLOW" "   Or run: $0 $CLIENT --testflight"
    fi
    
    cd ../..
fi

# Android Release
if [ "$SKIP_ANDROID" = false ] && [ "$BUILD_ANDROID" = "true" ]; then
    print_color "$BLUE" "=========================================="
    print_color "$BLUE" "🤖 Android Release"
    print_color "$BLUE" "=========================================="
    
    AAB_PATH="res/${CLIENT}/${CLIENT}-release.aab"
    APK_PATH="res/${CLIENT}/${CLIENT}-release.apk"
    
    if [ -f "$AAB_PATH" ]; then
        print_color "$GREEN" "✅ Android AAB found: $AAB_PATH"
        
        # Get file size
        AAB_SIZE=$(du -h "$AAB_PATH" | cut -f1)
        print_color "$YELLOW" "   Size: $AAB_SIZE"
        
        # Open Play Console if requested
        if [ "$PLAY_CONSOLE" = true ]; then
            print_color "$YELLOW" "🌐 Opening Play Console..."
            open "https://play.google.com/console/u/0/developers/4631927126321559033/app/4972850179493570327/tracks/production"
        fi
        
        print_color "$YELLOW" ""
        print_color "$YELLOW" "📤 To upload to Google Play:"
        print_color "$YELLOW" "   1. Go to https://play.google.com/console"
        print_color "$YELLOW" "   2. Select your app"
        print_color "$YELLOW" "   3. Production → Create new release"
        print_color "$YELLOW" "   4. Upload: $AAB_PATH"
        print_color "$YELLOW" "   5. Add release notes from: $RELEASE_NOTES_FILE"
    else
        print_color "$RED" "❌ Android AAB not found"
        exit 1
    fi
fi

# Create git tag
print_color "$YELLOW" "🏷️  Creating git tag..."
git add "$ENV_FILE"
git add "$RELEASE_NOTES_FILE"
git commit -m "Release version $NEW_VERSION (Build $NEW_BUILD_NUMBER) for $CLIENT" 2>/dev/null || true
git tag -a "v${NEW_VERSION}-${CLIENT}" -m "Release version $NEW_VERSION for $CLIENT"

# Summary
print_color "$GREEN" "=========================================="
print_color "$GREEN" "✅ Release Preparation Complete!"
print_color "$GREEN" "=========================================="
echo ""
print_color "$BLUE" "📊 Summary:"
print_color "$BLUE" "   Client: ${CLIENT}"
print_color "$BLUE" "   Version: ${NEW_VERSION}"
print_color "$BLUE" "   Build: ${NEW_BUILD_NUMBER}"
echo ""

if [ "$SKIP_IOS" = false ]; then
    print_color "$BLUE" "📱 iOS:"
    if [ "$TESTFLIGHT" = true ]; then
        print_color "$BLUE" "   ✅ Uploaded to TestFlight"
    else
        print_color "$BLUE" "   📦 Archive ready for manual upload"
    fi
fi

if [ "$SKIP_ANDROID" = false ]; then
    print_color "$BLUE" "🤖 Android:"
    print_color "$BLUE" "   📦 AAB ready at: res/${CLIENT}/${CLIENT}-release.aab"
fi

echo ""
print_color "$YELLOW" "📝 Next Steps:"
print_color "$YELLOW" "   1. Upload builds to stores if not done automatically"
print_color "$YELLOW" "   2. Submit for review"
print_color "$YELLOW" "   3. Push git tag: git push origin v${NEW_VERSION}-${CLIENT}"
echo ""
print_color "$GREEN" "🎉 Good luck with your release!"
