const fs = require('fs');
const https = require('https');
const path = require('path');
const zlib = require('zlib');

const boostVersion = '1_76_0';
const boostFileName = `boost_${boostVersion}.tar.gz`;
const downloadsDir = path.join(
  __dirname,
  '..',
  'node_modules',
  'expo-modules-core',
  'android',
  'build',
  'downloads'
);
const boostPath = path.join(downloadsDir, boostFileName);
const tempPath = `${boostPath}.tmp`;

const urls = [
  `https://archives.boost.io/release/${boostVersion.replace(/_/g, '.')}/source/${boostFileName}`,
  `https://github.com/react-native-community/boost-for-react-native/releases/download/v${boostVersion.replace(/_/g, '.')}-0/${boostFileName}`,
  `https://ms-react-native.azureedge.net/mirror/${boostFileName}`,
];

function validateGzip(filePath) {
  return new Promise((resolve) => {
    if (!fs.existsSync(filePath)) {
      resolve(false);
      return;
    }

    const input = fs.createReadStream(filePath);
    const gunzip = zlib.createGunzip();

    input.on('error', () => resolve(false));
    gunzip.on('error', () => resolve(false));
    gunzip.on('end', () => resolve(true));

    input.pipe(gunzip).resume();
  });
}

function download(url, destination, redirects = 0) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location
      ) {
        response.resume();
        if (redirects >= 5) {
          reject(new Error(`Too many redirects for ${url}`));
          return;
        }
        resolve(download(new URL(response.headers.location, url).toString(), destination, redirects + 1));
        return;
      }

      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`HTTP ${response.statusCode} from ${url}`));
        return;
      }

      const file = fs.createWriteStream(destination);
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    });

    request.setTimeout(120000, () => {
      request.destroy(new Error(`Timed out downloading ${url}`));
    });
    request.on('error', reject);
  });
}

async function main() {
  fs.mkdirSync(downloadsDir, { recursive: true });

  if (await validateGzip(boostPath)) {
    console.log(`[ensure-boost] Valid ${boostFileName} already exists.`);
    return;
  }

  if (fs.existsSync(boostPath)) {
    console.warn(`[ensure-boost] Removing corrupt ${boostFileName}.`);
    fs.unlinkSync(boostPath);
  }

  for (const url of urls) {
    try {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }

      console.log(`[ensure-boost] Downloading ${boostFileName} from ${url}`);
      await download(url, tempPath);

      if (!(await validateGzip(tempPath))) {
        throw new Error('Downloaded file is not a valid gzip archive');
      }

      fs.renameSync(tempPath, boostPath);
      console.log(`[ensure-boost] Saved valid ${boostFileName}.`);
      return;
    } catch (error) {
      console.warn(`[ensure-boost] ${error.message}`);
    }
  }

  if (fs.existsSync(tempPath)) {
    fs.unlinkSync(tempPath);
  }

  throw new Error(`Unable to download a valid ${boostFileName}.`);
}

main().catch((error) => {
  console.error(`[ensure-boost] ${error.message}`);
  process.exit(1);
});
