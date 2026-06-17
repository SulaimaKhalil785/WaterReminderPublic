const fs = require('fs');
const path = require('path');

const loadDotEnv = () => {
  const envPath = path.join(__dirname, '.env');

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, '');

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
};

const compactObject = (value) =>
  Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined && entry !== ''));

module.exports = ({ config }) => {
  loadDotEnv();

  const easProjectId = process.env.EAS_PROJECT_ID;
  const bundleIdentifier = process.env.APP_BUNDLE_IDENTIFIER || config.ios?.bundleIdentifier;
  const androidPackage = process.env.APP_ANDROID_PACKAGE || config.android?.package;

  return {
    ...config,
    ios: {
      ...config.ios,
      bundleIdentifier,
    },
    android: {
      ...config.android,
      package: androidPackage,
    },
    extra: compactObject({
      ...config.extra,
      weatherApiKey: process.env.WEATHER_API_KEY,
      firebase: compactObject({
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        androidAppId: process.env.FIREBASE_ANDROID_APP_ID,
        webAppId: process.env.FIREBASE_WEB_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID,
      }),
      eas: easProjectId ? { projectId: easProjectId } : undefined,
    }),
  };
};
