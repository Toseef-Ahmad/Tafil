#!/bin/bash

# Fix all TAFIL permission issues across all projects
# Run this: bash FIX_ALL_PERMISSIONS.sh

echo "🔧 Fixing TAFIL permissions across all projects..."
echo ""

# Fix permissions in common project locations
LOCATIONS=(
  "/Users/sodaclick/Desktop/projects"
  "/Users/sodaclick/Desktop"
  "/Users/sodaclick"
)

for location in "${LOCATIONS[@]}"; do
  if [ -d "$location" ]; then
    echo "📂 Fixing permissions in: $location"
    
    # Find all .tafil directories and fix ownership
    sudo find "$location" -type d -name ".tafil" -exec chown -R sodaclick:staff {} \; 2>/dev/null
    
    # Fix write permissions
    find "$location" -type d -name ".tafil" -exec chmod -R u+w {} \; 2>/dev/null
    
    echo "   ✅ Done"
  fi
done

echo ""
echo "✅ All permissions fixed!"
echo ""
echo "Now restart TAFIL:"
echo "  cd /Users/sodaclick/Desktop/projects/Own\ Projects/node-project-manager/electron-node-manager"
echo "  npm start"

