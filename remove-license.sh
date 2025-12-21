#!/bin/bash
# Remove License Script (Shell version)
# Removes all license files to test the app without a license

echo "🔓 Removing license files..."
echo ""

# Get home directory
HOME_DIR="$HOME"

# Path 1: ~/.tafil/license.json (licenseLoader)
LICENSE_LOADER_PATH="$HOME_DIR/.tafil/license.json"
if [ -f "$LICENSE_LOADER_PATH" ]; then
  rm "$LICENSE_LOADER_PATH"
  echo "✅ Removed: licenseLoader"
  echo "   $LICENSE_LOADER_PATH"
else
  echo "ℹ️  Not found: licenseLoader"
  echo "   $LICENSE_LOADER_PATH"
fi
echo ""

# Path 2: [userData]/.tafil-license (license-manager)
# macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
  LICENSE_MANAGER_PATH="$HOME_DIR/Library/Application Support/electron-node-manager/.tafil-license"
  if [ -f "$LICENSE_MANAGER_PATH" ]; then
    rm "$LICENSE_MANAGER_PATH"
    echo "✅ Removed: license-manager (macOS)"
    echo "   $LICENSE_MANAGER_PATH"
  else
    echo "ℹ️  Not found: license-manager (macOS)"
    echo "   $LICENSE_MANAGER_PATH"
  fi
# Linux
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  LICENSE_MANAGER_PATH="$HOME_DIR/.config/electron-node-manager/.tafil-license"
  if [ -f "$LICENSE_MANAGER_PATH" ]; then
    rm "$LICENSE_MANAGER_PATH"
    echo "✅ Removed: license-manager (Linux)"
    echo "   $LICENSE_MANAGER_PATH"
  else
    echo "ℹ️  Not found: license-manager (Linux)"
    echo "   $LICENSE_MANAGER_PATH"
  fi
# Windows (Git Bash/Cygwin)
elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]]; then
  LICENSE_MANAGER_PATH="$HOME_DIR/AppData/Roaming/electron-node-manager/.tafil-license"
  if [ -f "$LICENSE_MANAGER_PATH" ]; then
    rm "$LICENSE_MANAGER_PATH"
    echo "✅ Removed: license-manager (Windows)"
    echo "   $LICENSE_MANAGER_PATH"
  else
    echo "ℹ️  Not found: license-manager (Windows)"
    echo "   $LICENSE_MANAGER_PATH"
  fi
fi

echo ""
echo "🔄 Restart the app to test without license."

