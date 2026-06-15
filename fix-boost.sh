#!/bin/bash

# Path to the build.gradle file that contains the Boost download link
TARGET_FILE="node_modules/expo-modules-core/android/build.gradle"

if [ -f "$TARGET_FILE" ]; then
  echo "🛠️ Fixing Boost download URL in expo-modules-core..."
  # Replace JFrog URL with Official Boost Archive URL
  sed -i 's|https://boostorg.jfrog.io/artifactory/main/release/|https://archives.boost.io/release/|g' "$TARGET_FILE"
  echo "✅ URL updated successfully."
else
  echo "⚠️ Target file not found."
fi
