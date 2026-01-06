const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude react-native-iap from web bundling
config.resolver.blacklistRE = /react-native-iap/;

module.exports = config;
