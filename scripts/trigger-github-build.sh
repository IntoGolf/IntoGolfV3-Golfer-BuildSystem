#!/bin/bash

# Trigger GitHub Actions build via API
# Usage: ./trigger-github-build.sh <tenant> [platform]

TENANT=${1:-dev}
PLATFORM=${2:-android}

echo "🚀 Triggering GitHub Actions build"
echo "   Tenant: $TENANT"
echo "   Platform: $PLATFORM"
echo ""

# Check if gh CLI is available
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI not found. Install with: brew install gh"
    exit 1
fi

# Trigger via repository dispatch
echo "📤 Sending repository dispatch..."
gh api repos/IntoGolf/IntoGolfV3-Golfer/dispatches \
    --method POST \
    --field event_type="build-app" \
    --field "client_payload[tenant]=$TENANT" \
    --field "client_payload[platform]=$PLATFORM" \
    --field "client_payload[callback_url]=https://example.com/callback" \
    --field "client_payload[triggered_by]=manual"

if [ $? -eq 0 ]; then
    echo "✅ Build triggered successfully!"
    echo ""
    echo "🔍 Check build status:"
    echo "   GitHub Actions: https://github.com/IntoGolf/IntoGolfV3-Golfer/actions"
    echo ""
    echo "⏰ Build will start within 1-2 minutes"
else
    echo "❌ Failed to trigger build"
    echo ""
    echo "💡 Alternative: Manual trigger via GitHub UI"
    echo "   1. Go to: https://github.com/IntoGolf/IntoGolfV3-Golfer/actions"
    echo "   2. Select a workflow"
    echo "   3. Click 'Run workflow'"
fi