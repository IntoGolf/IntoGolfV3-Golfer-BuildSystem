#!/bin/bash

# iOS Upload Helper Script
# Helpt met het correct uploaden naar App Store Connect

echo "🍎 iOS Upload Helper"
echo "===================="

# Check if we're in the right directory
if [ ! -f "App.xcworkspace/contents.xcworkspacedata" ]; then
    echo "⚠️  Please run this from ios/App directory"
    echo "   cd ios/App"
    exit 1
fi

# Clean everything
echo "🧹 Cleaning build artifacts..."
rm -rf ~/Library/Developer/Xcode/DerivedData/*
rm -rf build/

# Show current version
INFO_PLIST="App/Info.plist"
CURRENT_VERSION=$(/usr/libexec/PlistBuddy -c "Print CFBundleShortVersionString" "$INFO_PLIST")
CURRENT_BUILD=$(/usr/libexec/PlistBuddy -c "Print CFBundleVersion" "$INFO_PLIST")

echo "📱 Current version: $CURRENT_VERSION ($CURRENT_BUILD)"
echo ""

# Create archive
echo "📦 Creating Archive..."
echo "   This will take 5-10 minutes..."

xcodebuild -workspace App.xcworkspace \
  -scheme App \
  -configuration Release \
  -archivePath build/App.xcarchive \
  -destination "generic/platform=iOS" \
  -quiet \
  archive || {
    echo "❌ Archive failed!"
    echo ""
    echo "Common fixes:"
    echo "1. Open Xcode and select 'Any iOS Device' as target"
    echo "2. Make sure you're signed in with your Apple ID"
    echo "3. Check that provisioning profiles are valid"
    exit 1
}

echo "✅ Archive created successfully!"
echo ""

# Export for App Store
echo "📤 Preparing for App Store..."

cat > ExportOptions.plist << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>uploadSymbols</key>
    <true/>
    <key>generateAppStoreInformation</key>
    <true/>
    <key>signingStyle</key>
    <string>automatic</string>
</dict>
</plist>
EOF

xcodebuild -exportArchive \
  -archivePath build/App.xcarchive \
  -exportPath build/Export \
  -exportOptionsPlist ExportOptions.plist \
  -quiet || {
    echo "❌ Export failed!"
    exit 1
}

echo "✅ Export successful!"
echo ""

# Check if we can use automatic upload
if command -v xcrun &> /dev/null; then
    echo "🚀 Ready to upload!"
    echo ""
    echo "Option 1: Upload via Xcode (Recommended)"
    echo "   1. Open Xcode"
    echo "   2. Window → Organizer"
    echo "   3. Select today's archive"
    echo "   4. Click 'Distribute App'"
    echo "   5. Choose 'App Store Connect' → 'Upload'"
    echo ""
    echo "Option 2: Upload via Terminal"
    echo "   Run: xcrun altool --upload-app -f build/Export/*.ipa -u YOUR_APPLE_ID -p YOUR_APP_PASSWORD"
    echo ""
    echo "   To create app-specific password:"
    echo "   Go to https://appleid.apple.com/account/manage"
    echo "   Sign in → Security → App-Specific Passwords → Generate"
else
    echo "📦 IPA ready at: build/Export/"
    echo "Upload this via Xcode Organizer or Transporter app"
fi

# Open Organizer
echo ""
read -p "Open Xcode Organizer now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    open -a Xcode
    osascript -e 'tell application "Xcode" to activate'
    osascript -e 'tell application "System Events" to tell process "Xcode" to keystroke "O" using {command down, shift down}'
fi

echo ""
echo "⏱️  After upload:"
echo "   • Wait 15-30 minutes for processing"
echo "   • Check email for confirmation"
echo "   • Build appears in App Store Connect → TestFlight"
echo ""
echo "🎉 Good luck with your release!"
