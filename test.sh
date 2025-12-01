#!/bin/bash

# Test Script for Electron Node Manager
# This script helps verify that all fixes are working correctly

echo "=================================="
echo "Electron Node Manager - Test Suite"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track test results
PASSED=0
FAILED=0

# Function to print test result
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASSED${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}: $2"
        ((FAILED++))
    fi
}

echo "1. Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    test_result 0 "Node.js installed ($NODE_VERSION)"
else
    test_result 1 "Node.js not found"
fi

echo ""
echo "2. Checking npm installation..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    test_result 0 "npm installed ($NPM_VERSION)"
else
    test_result 1 "npm not found"
fi

echo ""
echo "3. Checking package.json exists..."
if [ -f "package.json" ]; then
    test_result 0 "package.json found"
else
    test_result 1 "package.json not found"
fi

echo ""
echo "4. Checking main files exist..."
FILES=("main.js" "renderer.js" "preload.js" "index.html")
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        test_result 0 "$file exists"
    else
        test_result 1 "$file missing"
    fi
done

echo ""
echo "5. Checking utility files..."
UTIL_FILES=("utils/gitScanner.js" "utils/projectActions.js" "utils/fileScanner.js" "utils/portFinder.js")
for file in "${UTIL_FILES[@]}"; do
    if [ -f "$file" ]; then
        test_result 0 "$file exists"
    else
        test_result 1 "$file missing"
    fi
done

echo ""
echo "6. Checking for node_modules..."
if [ -d "node_modules" ]; then
    test_result 0 "node_modules directory exists"
else
    echo -e "${YELLOW}⚠ WARNING${NC}: node_modules not found. Run 'npm install' first."
    ((FAILED++))
fi

echo ""
echo "7. Checking for critical dependencies..."
if [ -d "node_modules" ]; then
    DEPS=("electron" "ps-tree" "portfinder" "tailwindcss")
    for dep in "${DEPS[@]}"; do
        if [ -d "node_modules/$dep" ]; then
            test_result 0 "$dep installed"
        else
            test_result 1 "$dep not installed"
        fi
    done
else
    echo -e "${YELLOW}Skipping dependency check (no node_modules)${NC}"
fi

echo ""
echo "8. Checking for syntax errors in JavaScript files..."
if command -v node &> /dev/null; then
    for file in main.js renderer.js preload.js utils/*.js; do
        if [ -f "$file" ]; then
            if node -c "$file" 2>/dev/null; then
                test_result 0 "$file syntax valid"
            else
                test_result 1 "$file has syntax errors"
            fi
        fi
    done
else
    echo -e "${YELLOW}Skipping syntax check (Node.js not available)${NC}"
fi

echo ""
echo "9. Checking Tailwind CSS build..."
if [ -f "dist/output.css" ]; then
    test_result 0 "Tailwind CSS compiled"
else
    echo -e "${YELLOW}⚠ WARNING${NC}: dist/output.css not found. Run 'npm run build-css'"
    ((FAILED++))
fi

echo ""
echo "10. Checking for build artifacts..."
if [ -d "release" ]; then
    test_result 0 "Release directory exists"
else
    echo -e "${YELLOW}ℹ INFO${NC}: No release builds yet. Run 'npm run build' to create one."
fi

echo ""
echo "=================================="
echo "Test Summary"
echo "=================================="
echo -e "${GREEN}Passed${NC}: $PASSED"
echo -e "${RED}Failed${NC}: $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✓${NC}"
    echo ""
    echo "Next steps:"
    echo "1. If dependencies not installed: npm install"
    echo "2. If CSS not built: npm run build-css"
    echo "3. To run in dev mode: npm run dev"
    echo "4. To build for production: npm run build"
    exit 0
else
    echo -e "${RED}Some tests failed. Please fix the issues above.${NC}"
    echo ""
    echo "Common fixes:"
    echo "- Run 'npm install' to install dependencies"
    echo "- Run 'npm run build-css' to compile Tailwind CSS"
    echo "- Check that all files are present and not corrupted"
    exit 1
fi

