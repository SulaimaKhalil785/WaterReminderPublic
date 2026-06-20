const fs = require('fs');
const path = require('path');

const loadDotEnv = () => {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const [key, ...parts] = trimmed.split('=');
    const value = parts.join('=').trim().replace(/^['"]|['"]$/g, '');
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
};

const { withMainActivity } = require('@expo/config-plugins');

const withDisableRootSecurity = (config) => {
  return withMainActivity(config, (config) => {
    let contents = config.modResults.contents;
    if (!contents.includes('import android.view.WindowManager;')) {
      contents = contents.replace('import android.os.Bundle;', 'import android.os.Bundle;\nimport android.view.WindowManager;');
    }
    if (!contents.includes('WindowManager.LayoutParams.FLAG_SECURE')) {
      contents = contents.replace('super.onCreate(null);', 'super.onCreate(null);\n    getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);');
    }
    config.modResults.contents = contents;
    return config;
  });
};

module.exports = ({ config }) => {
  loadDotEnv();

  const firebaseConfig = {
    androidApiKey: process.env.FIREBASE_ANDROID_API_KEY,
    webApiKey: process.env.FIREBASE_WEB_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    androidAppId: process.env.FIREBASE_ANDROID_APP_ID,
    webAppId: process.env.FIREBASE_WEB_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  };

  const finalConfig = {
    ...config,
    android: {
      ...config.android,
      package: "com.sevincaeren.watertracker",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON || "./google-services.json"
    },
    extra: {
      ...config.extra,
      firebase: firebaseConfig,
      weatherApiKey: process.env.WEATHER_API_KEY,
      eas: { projectId: "3816df4e-f58e-4e47-8f77-4cc96ab4334a" }
    },
  };

  return withDisableRootSecurity(finalConfig);
};
