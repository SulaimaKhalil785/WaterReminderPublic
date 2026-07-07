#!/bin/bash

# Boost configuration
BOOST_VERSION="1.76.0"
BOOST_FILENAME="boost_1_76_0.tar.gz"
DOWNLOAD_URL="https://github.com/react-native-community/boost-for-react-native/releases/download/v1.76.0-0/$BOOST_FILENAME"

# In Expo 47 / RN 0.70, expo-modules-core expects boost here
TARGET_DIR="node_modules/expo-modules-core/android/build/downloads"

echo "--- Boost Pre-download Script ---"
echo "Target directory: $TARGET_DIR"

mkdir -p "$TARGET_DIR"

if [ -f "$TARGET_DIR/$BOOST_FILENAME" ]; then
    echo "Existing file found. Checking integrity..."
    if tar -tzf "$TARGET_DIR/$BOOST_FILENAME" >/dev/null 2>&1; then
        echo "Valid Boost archive already exists. Skipping download."
        exit 0
    else
        echo "Corrupted file detected. Deleting..."
        rm "$TARGET_DIR/$BOOST_FILENAME"
    fi
fi

echo "Downloading Boost from $DOWNLOAD_URL..."
# Using -f to fail on 404/500 errors
curl -L -f "$DOWNLOAD_URL" -o "$TARGET_DIR/$BOOST_FILENAME"

if [ $? -eq 0 ]; then
    echo "Boost $BOOST_VERSION downloaded successfully to $TARGET_DIR."
    # Double check integrity after download
    if tar -tzf "$TARGET_DIR/$BOOST_FILENAME" >/dev/null 2>&1; then
        echo "Integrity check passed."
    else
        echo "Error: Downloaded file is corrupted."
        exit 1
    fi
else
    echo "Error: Failed to download Boost library from GitHub mirror."
    echo "Trying fallback source..."
    curl -L -f "https://ms-react-native.azureedge.net/mirror/boost_1_76_0.tar.gz" -o "$TARGET_DIR/$BOOST_FILENAME"
    if [ $? -eq 0 ]; then
         echo "Boost downloaded from fallback source."
    else
         echo "Critical Error: All Boost download sources failed."
         exit 1
    fi
fi
echo "--- Boost Pre-download Script Finished ---"
