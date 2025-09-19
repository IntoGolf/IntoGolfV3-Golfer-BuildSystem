#!/bin/bash

# Quick release script - simplified version
# Voor productie releases van IntoGolf apps

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_color() {
    printf "${1}${2}${NC}\n"
}

# Check client
if [ -z "$1" ]; then
    echo "Usage: $0 <client_name> [--testflight]"
    echo ""
    echo "Examples:"
    echo "  $0 engelenburg           # Build for stores"
    echo "  $0 engelenburg --testflight  # Build and upload to TestFlight"
    exit 1
fi

CLIENT=$1
ENV_FILE="env/.env.${CLIENT}"
TESTFLIGHT=false

if [ "$2" = "--testflight" ]; then
    TESTFLIGHT=true
fi

# Check env file
if [ ! -f "$ENV_FILE" ]; then
    print_color "$RED" "❌ Environment file not found: $ENV_FILE"
    exit 1
fi

# Load config
source "$ENV_FILE"

# Auto increment version
OLD_VERSION="$APP_VERSION"
OLD_BUILD="$APP_BUILD_NUMBER"

# Increment build number (always)
NEW_BUILD=$((OLD_BUILD + 1))

# Ask for version bump
print_color "$BLUE" "Current version: $OLD_VERSION (Build $OLD_BUILD)"
echo "How do you want to bump the version?"
echo "1) Patch (1.4.10 → 1.4.11)"
echo "2) Minor (1.4.10 → 1.5.0)"
echo "3) Major (1.4.10 → 2.0.0)"
echo "4) Keep same version (only increment build)"
read -p "Choice [1-4]: " choice

case $choice in
    1)
        IFS='.' read -r major minor patch <<< "$OLD_VERSION"
        NEW_VERSION="${major}.${minor}.$((patch + 1))"
        ;;
    2)
        IFS='.' read -r major minor patch <<< "$OLD_VERSION"
        NEW_VERSION="${major}.$((minor + 1)).0"
        ;;
    3)
        IFS='.' read -r major minor patch <<< "$OLD_VERSION"
        NEW_VERSION="$((major + 1)).0.0"
        ;;
    4)
        NEW_VERSION="$OLD_VERSION"
        ;;
    *)
        print_color "$RED" "Invalid choice"
        exit 1
        ;;
esac

print_color "$GREEN" "New version: $NEW_VERSION (Build $NEW_BUILD)"

# Update env file
sed -i '' "s/APP_VERSION=.*/APP_VERSION=$NEW_VERSION/" "$ENV_FILE"
sed -i '' "s/APP_BUILD_NUMBER=.*/APP_BUILD_NUMBER=$NEW_BUILD/" "$ENV_FILE"
sed -i '' "s/ANDROID_VERSION_CODE=.*/ANDROID_VERSION_CODE=$NEW_BUILD/" "$ENV_FILE"
sed -i '' "s/ANDROID_VERSION_NAME=.*/ANDROID_VERSION_NAME=$NEW_VERSION/" "$ENV_FILE"

# Build
print_color "$YELLOW" "🔨 Building app..."
./build-client-v2.sh "$CLIENT" --clear-cache

print_color "$GREEN" "✅ Build complete!"
echo ""

# iOS Instructions
if [ "$BUILD_IOS" = "true" ]; then
    print_color "$BLUE" "📱 iOS Release:"
    
    if [ "$TESTFLIGHT" = true ]; then
        print_color "$YELLOW" "Opening Xcode for TestFlight upload..."
        cd ios/App
        open App.xcworkspace
        cd ../..
        print_color "$YELLOW" "1. In Xcode: Product → Archive"
        print_color "$YELLOW" "2. Distribute App → App Store Connect → Upload"
    else
        print_color "$YELLOW" "1. cd ios/App && open App.xcworkspace"
        print_color "$YELLOW" "2. Select 'Any iOS Device' as target"
        print_color "$YELLOW" "3. Product → Archive"
        print_color "$YELLOW" "4. Distribute App → App Store Connect"
    fi
fi

# Android Instructions
if [ "$BUILD_ANDROID" = "true" ]; then
    echo ""
    print_color "$BLUE" "🤖 Android Release:"
    print_color "$GREEN" "✅ AAB ready: res/${CLIENT}/${CLIENT}-release.aab"
    print_color "$YELLOW" "1. Go to https://play.google.com/console"
    print_color "$YELLOW" "2. Upload the AAB file"
fi

echo ""
print_color "$GREEN" "🎉 Version $NEW_VERSION (Build $NEW_BUILD) ready for release!"
