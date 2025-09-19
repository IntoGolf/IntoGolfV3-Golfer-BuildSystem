#!/bin/bash

# Setup GitHub Secrets for IntoGolf Multi-Tenant App
# This script helps you upload all tenant secrets to GitHub

echo "🔐 IntoGolf GitHub Secrets Setup"
echo "================================="
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI not found. Please install it first:"
    echo "   brew install gh"
    echo "   gh auth login"
    exit 1
fi

# Check if logged in
if ! gh auth status &> /dev/null; then
    echo "❌ Not logged in to GitHub. Please run:"
    echo "   gh auth login"
    exit 1
fi

echo "✅ GitHub CLI ready"
echo ""

# Get all available tenants
if [ ! -d ".secrets" ]; then
    echo "❌ .secrets directory not found. Run the build script first to generate secrets."
    exit 1
fi

TENANTS=$(ls .secrets/*.env 2>/dev/null | xargs -n 1 basename | sed 's/\.env$//' | sort)

if [ -z "$TENANTS" ]; then
    echo "❌ No tenant secrets found in .secrets/"
    exit 1
fi

echo "📋 Found tenants:"
for tenant in $TENANTS; do
    echo "   - $tenant"
done
echo ""

read -p "Continue with uploading secrets for all tenants? (y/N): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "🔄 Processing tenant secrets..."

for tenant in $TENANTS; do
    echo ""
    echo "📤 Processing: $tenant"
    echo "  ├─ Loading secrets from .secrets/${tenant}.env"

    # Load tenant secrets
    if [ ! -f ".secrets/${tenant}.env" ]; then
        echo "  └─ ❌ Secret file not found"
        continue
    fi

    # Read secrets from file
    source ".secrets/${tenant}.env"

    TENANT_UPPER=$(echo "$tenant" | tr '[:lower:]' '[:upper:]')

    # Upload keystore credentials
    echo "  ├─ Uploading ${TENANT_UPPER}_KEY_PASSWORD"
    echo "$KEY_PASSWORD" | gh secret set "${TENANT_UPPER}_KEY_PASSWORD" || echo "  │  ⚠️ Failed"

    echo "  ├─ Uploading ${TENANT_UPPER}_KEYSTORE_PASSWORD"
    echo "$KEYSTORE_PASSWORD" | gh secret set "${TENANT_UPPER}_KEYSTORE_PASSWORD" || echo "  │  ⚠️ Failed"

    echo "  ├─ Uploading ${TENANT_UPPER}_KEY_ALIAS"
    echo "$KEY_ALIAS" | gh secret set "${TENANT_UPPER}_KEY_ALIAS" || echo "  │  ⚠️ Failed"

    # Upload keystore file (base64 encoded)
    if [ -f ".secrets/${tenant}.keystore" ]; then
        echo "  ├─ Uploading ${TENANT_UPPER}_KEYSTORE_BASE64"
        base64 -i ".secrets/${tenant}.keystore" | gh secret set "${TENANT_UPPER}_KEYSTORE_BASE64" || echo "  │  ⚠️ Failed"
    else
        echo "  ├─ ⚠️ Keystore file not found: .secrets/${tenant}.keystore"
    fi

    # Upload Firebase config if exists
    FIREBASE_ANDROID="res/${tenant}/google-services.json"
    FIREBASE_IOS="res/${tenant}/GoogleService-Info.plist"

    if [ -f "$FIREBASE_ANDROID" ]; then
        echo "  ├─ Uploading ${TENANT_UPPER}_FIREBASE_CONFIG (Android)"
        cat "$FIREBASE_ANDROID" | jq -c . | gh secret set "${TENANT_UPPER}_FIREBASE_CONFIG" || echo "  │  ⚠️ Failed"
    elif [ -f "$FIREBASE_IOS" ]; then
        echo "  ├─ Uploading ${TENANT_UPPER}_FIREBASE_CONFIG (iOS)"
        cat "$FIREBASE_IOS" | gh secret set "${TENANT_UPPER}_FIREBASE_CONFIG" || echo "  │  ⚠️ Failed"
    else
        echo "  ├─ ⚠️ No Firebase config found for $tenant"
    fi

    echo "  └─ ✅ $tenant secrets uploaded"
done

echo ""
echo "=========================================="
echo "✅ GitHub Secrets Setup Complete!"
echo "=========================================="
echo ""
echo "🔍 Uploaded secrets for tenants: $(echo $TENANTS | tr '\n' ' ')"
echo ""
echo "📝 Secret naming convention:"
echo "   TENANT_KEY_PASSWORD"
echo "   TENANT_KEYSTORE_PASSWORD"
echo "   TENANT_KEY_ALIAS"
echo "   TENANT_KEYSTORE_BASE64"
echo "   TENANT_FIREBASE_CONFIG"
echo ""
echo "🚀 Ready to trigger builds:"
echo "   Repository Dispatch: build-app"
echo "   Payload: {\"tenant\": \"engelenburg\", \"platform\": \"android\"}"
echo ""
echo "💡 Test the workflow:"
echo "   1. Go to GitHub Actions tab"
echo "   2. Select 'Build Golf App' workflow"
echo "   3. Click 'Run workflow'"
echo "   4. Enter tenant name and platform"
echo ""