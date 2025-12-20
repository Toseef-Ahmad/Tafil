#!/bin/bash

# Fix TAFIL permissions
# Run this: bash FIX_PERMISSIONS.sh

echo "🔧 Fixing TAFIL permissions..."

cd "$(dirname "$0")"

# Remove root-owned directories (they'll be recreated with correct permissions)
sudo rm -rf .tafil/modules/1765863327853_2da6535b1077
sudo rm -rf .tafil/modules/1766066858597_5e013c5f546c

# Fix ownership of entire .tafil directory
sudo chown -R $(whoami):staff .tafil/

# Ensure write permissions
chmod -R u+w .tafil/

echo "✅ Permissions fixed!"
echo ""
echo "Now restart TAFIL:"
echo "  npm start"

