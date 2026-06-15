#!/bin/bash

# Target directory where Gradle expects the Boost file
DEST="node_modules/expo-modules-core/android/build/downloads"
FILE="boost_1_76_0.tar.gz"
SOURCE="android-build-setup/$FILE"

echo "Running EAS Pre-build setup..."

if [ -f "$SOURCE" ]; then
  echo "✅ Boost file found in $SOURCE. Preparing to copy..."
  mkdir -p "$DEST"
  cp "$SOURCE" "$DEST/"
  echo "✅ Boost file successfully copied to $DEST."
else
  echo "⚠️ Warning: Boost file not found at $SOURCE."
  echo "Please make sure you have created the 'android-build-setup' folder and placed '$FILE' inside it."
fi
