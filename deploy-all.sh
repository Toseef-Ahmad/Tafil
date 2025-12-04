#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Tafil Complete Deployment Script        ║${NC}"
echo -e "${BLUE}║   (Landing Page + Documentation)         ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════╝${NC}"
echo ""

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

# Clean up any previous deployment directory
rm -rf .deploy-temp
mkdir -p .deploy-temp/docs
echo -e "${BLUE}📁 Created deployment directory${NC}"
echo ""

# ============================================
# Step 1: Build Landing Page
# ============================================
echo -e "${BLUE}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Step 1: Building Landing Page           ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════╝${NC}"

cd "$PROJECT_ROOT/landing"

echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Landing page npm install failed${NC}"
    rm -rf "$PROJECT_ROOT/.deploy-temp"
    exit 1
fi

echo -e "${BLUE}🔨 Building landing page...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Landing page build failed${NC}"
    rm -rf "$PROJECT_ROOT/.deploy-temp"
    exit 1
fi

cp -r dist/* "$PROJECT_ROOT/.deploy-temp/"
echo -e "${GREEN}✅ Landing page built${NC}"
echo ""

# ============================================
# Step 2: Build Documentation
# ============================================
echo -e "${BLUE}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Step 2: Building Documentation          ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════╝${NC}"

cd "$PROJECT_ROOT/docs"

echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Docs npm install failed${NC}"
    rm -rf "$PROJECT_ROOT/.deploy-temp"
    exit 1
fi

echo -e "${BLUE}🔨 Building documentation...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Documentation build failed${NC}"
    rm -rf "$PROJECT_ROOT/.deploy-temp"
    exit 1
fi

cp -r .vitepress/dist/* "$PROJECT_ROOT/.deploy-temp/docs/"
echo -e "${GREEN}✅ Documentation built${NC}"
echo ""

# ============================================
# Step 3: Deploy to gh-pages
# ============================================
echo -e "${BLUE}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Step 3: Deploying to GitHub Pages      ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════╝${NC}"

cd "$PROJECT_ROOT"
echo -e "${BLUE}🚀 Deploying to gh-pages branch...${NC}"
npx --yes gh-pages -d .deploy-temp --message "Deploy landing + docs"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed${NC}"
    rm -rf .deploy-temp
    exit 1
fi

rm -rf .deploy-temp
echo -e "${GREEN}✅ Deployment successful!${NC}"
echo ""

# ============================================
# Success
# ============================================
echo -e "${GREEN}╔═══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║        Deployment Complete! 🎉           ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Your sites are live at:${NC}"
echo ""
echo -e "  ${GREEN}Landing Page:${NC}  https://toseef-ahmad.github.io/Tafil/"
echo -e "  ${GREEN}Documentation:${NC} https://toseef-ahmad.github.io/Tafil/docs/"
echo ""
