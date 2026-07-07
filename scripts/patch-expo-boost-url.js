const fs = require('fs');
const path = require('path');

const gradleFile = path.join(
  __dirname,
  '..',
  'node_modules',
  'expo-modules-core',
  'android',
  'build.gradle'
);

if (!fs.existsSync(gradleFile)) {
  console.warn('[patch-expo-boost-url] expo-modules-core build.gradle not found.');
  process.exit(0);
}

const oldUrl =
  'https://boostorg.jfrog.io/artifactory/main/release/${BOOST_VERSION.replace("_", ".")}/source/boost_${BOOST_VERSION}.tar.gz';
const newUrl =
  'https://archives.boost.io/release/${BOOST_VERSION.replace("_", ".")}/source/boost_${BOOST_VERSION}.tar.gz';

const source = fs.readFileSync(gradleFile, 'utf8');

if (source.includes(newUrl)) {
  console.log('[patch-expo-boost-url] Boost URL already patched.');
  process.exit(0);
}

if (!source.includes(oldUrl)) {
  console.warn('[patch-expo-boost-url] Expected Boost URL not found; leaving file unchanged.');
  process.exit(0);
}

fs.writeFileSync(gradleFile, source.replace(oldUrl, newUrl));
console.log('[patch-expo-boost-url] Patched expo-modules-core Boost download URL.');