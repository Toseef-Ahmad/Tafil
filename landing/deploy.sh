#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Tafil Landing Page Deployment Script   ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════╝${NC}"
echo ""

# Check if we're in the landing directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Must run from landing/ directory${NC}"
    echo -e "${YELLOW}Run this command first:${NC}"
    echo -e "  cd \"/Users/sodaclick/Desktop/projects/Own Projects/node-project-manager/electron-node-manager/landing\""
    exit 1
fi

echo -e "${BLUE}📦 Step 1: Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ npm install failed${NC}"
    echo -e "${YELLOW}Try running:${NC}"
    echo -e "  sudo chown -R \$(id -u):\$(id -g) ~/.npm"
    exit 1
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

echo -e "${BLUE}🔨 Step 2: Building landing page...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build complete${NC}"
echo ""

echo -e "${BLUE}🚀 Step 3: Deploying to GitHub Pages...${NC}"
npm run deploy
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Deployed successfully!${NC}"
echo ""

echo -e "${GREEN}╔═══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           Deployment Complete! 🎉          ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Configure GitHub Pages (ONE TIME ONLY)${NC}"
echo ""
echo -e "1. Open: ${BLUE}https://github.com/Toseef-Ahmad/Tafil/settings/pages${NC}"
echo -e "2. Under 'Build and deployment':"
echo -e "   - Source: ${GREEN}Deploy from a branch${NC}"
echo -e "   - Branch: ${GREEN}gh-pages${NC}"
echo -e "   - Folder: ${GREEN}/ (root)${NC}"
echo -e "3. Click ${GREEN}Save${NC}"
echo ""
echo -e "${BLUE}Your landing page will be live in 1-3 minutes at:${NC}"
echo -e "${GREEN}https://toseef-ahmad.github.io/Tafil/${NC}"
echo ""

