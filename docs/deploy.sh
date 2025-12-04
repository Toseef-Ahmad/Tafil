#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Tafil Documentation Deployment Script  ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════╝${NC}"
echo ""

# Check if we're in the docs directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Must run from docs/ directory${NC}"
    echo -e "${YELLOW}Run this command first:${NC}"
    echo -e "  cd docs"
    exit 1
fi

echo -e "${BLUE}📦 Step 1: Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ npm install failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

echo -e "${BLUE}🔨 Step 2: Building documentation...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build complete${NC}"
echo ""

# Create a temporary directory with docs folder structure
TEMP_DIR=$(mktemp -d)
DOCS_DIR="$TEMP_DIR/docs"
mkdir -p "$DOCS_DIR"
echo -e "${BLUE}📁 Step 3: Preparing deployment...${NC}"
cp -r .vitepress/dist/* "$DOCS_DIR/"
echo -e "${GREEN}✅ Files prepared${NC}"
echo ""

echo -e "${BLUE}🚀 Step 4: Deploying to GitHub Pages...${NC}"
# Deploy the temp directory (which contains docs folder) to gh-pages
cd "$TEMP_DIR"
npx --yes gh-pages -d . --message "Deploy docs to /docs"
DEPLOY_EXIT=$?
cd - > /dev/null
rm -rf "$TEMP_DIR"

if [ $DEPLOY_EXIT -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Deployed successfully!${NC}"
echo ""

echo -e "${GREEN}╔═══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║       Documentation Deployed! 🎉         ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Your documentation will be live in 1-3 minutes at:${NC}"
echo -e "${GREEN}https://toseef-ahmad.github.io/Tafil/docs/${NC}"
echo ""
echo -e "${YELLOW}Note:${NC} Make sure GitHub Pages is configured to serve from ${GREEN}gh-pages${NC} branch (root folder)"
echo ""
