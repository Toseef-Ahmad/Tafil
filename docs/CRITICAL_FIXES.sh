#!/bin/bash

# CRITICAL PRODUCTION FIXES FOR TAFIL
# This script fixes all permission and setup issues

set -e

echo "🚨 TAFIL PRODUCTION HARDENING"
echo "================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running from correct directory
if [ ! -f "FIX_ALL_PERMISSIONS.sh" ]; then
    echo -e "${RED}❌ Please run from: /Users/sodaclick/Desktop/projects/Own Projects/${NC}"
    exit 1
fi

echo "Step 1: Fixing permission issues..."
echo "-----------------------------------"

# Fix .tafil permissions in all project directories
echo "🔍 Finding all .tafil directories..."

# Desktop projects
if [ -d "/Users/sodaclick/Desktop/projects" ]; then
    echo "📂 Fixing Desktop/projects..."
    sudo find "/Users/sodaclick/Desktop/projects" -type d -name ".tafil" -exec chown -R sodaclick:staff {} \; 2>/dev/null || true
    find "/Users/sodaclick/Desktop/projects" -type d -name ".tafil" -exec chmod -R 755 {} \; 2>/dev/null || true
    echo -e "${GREEN}✅ Desktop/projects fixed${NC}"
fi

# Home directory
echo "📂 Fixing home directory..."
sudo find "/Users/sodaclick" -maxdepth 3 -type d -name ".tafil" -exec chown -R sodaclick:staff {} \; 2>/dev/null || true
find "/Users/sodaclick" -maxdepth 3 -type d -name ".tafil" -exec chmod -R 755 {} \; 2>/dev/null || true
echo -e "${GREEN}✅ Home directory fixed${NC}"

echo ""
echo "Step 2: Fixing TAFIL app permissions..."
echo "---------------------------------------"

cd /Users/sodaclick/Desktop/projects/Own\ Projects/node-project-manager/electron-node-manager

# Fix electron-node-manager .tafil
if [ -d ".tafil" ]; then
    sudo chown -R sodaclick:staff .tafil/ 2>/dev/null || true
    chmod -R 755 .tafil/
    echo -e "${GREEN}✅ TAFIL app directory fixed${NC}"
fi

# Fix license file permissions
if [ -d "$HOME/.tafil" ]; then
    sudo chown -R sodaclick:staff "$HOME/.tafil" 2>/dev/null || true
    chmod -R 700 "$HOME/.tafil"
    echo -e "${GREEN}✅ License directory fixed${NC}"
fi

echo ""
echo "Step 3: Cleaning up corrupted directories..."
echo "--------------------------------------------"

# Remove any corrupted root-owned module directories
sudo find /Users/sodaclick/Desktop/projects -type d -path "*/.tafil/modules/*" -user root -exec rm -rf {} \; 2>/dev/null || true
echo -e "${GREEN}✅ Cleaned up corrupted modules${NC}"

echo ""
echo -e "${GREEN}✅ ALL FIXES COMPLETED!${NC}"
echo ""
echo "Next steps:"
echo "1. Close TAFIL if running (Cmd+Q)"
echo "2. Start TAFIL: cd electron-node-manager && npm start"
echo "3. Test: Add task in Blueprint - should work!"
echo "4. Test: Run project - should work without popup!"
echo ""
echo -e "${YELLOW}⚠️  Going forward, NEVER run TAFIL with sudo!${NC}"
echo ""

