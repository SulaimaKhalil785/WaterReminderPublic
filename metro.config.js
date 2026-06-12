const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude the .git directory from Metro's file watcher to prevent 
// EPERM errors when Git creates temporary lock files.
config.resolver.blockList = [
  /.*\.git\/.*/,
];

module.exports = config;