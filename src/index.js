const path = require('path');
const fs = require('fs-extra');
const ngrok = require('ngrok');
const express = require('express');
const qrcode = require('qrcode-terminal');

const TEMP_DIR = path.resolve('/tmp/ota');
const OTA_SERVER_PORT = 8080;
const ITMS_MANIFEST_URL = 'itms-services://?action=download-manifest&url=${DOMAIN}';
const DEFAULT_OTA_MANIFEST_PATH = path.resolve('./static/manifest.plist');

async function ota({ ipa, apk, name, version, package }) {
  if (typeof name !== 'string') {
    throw new Error(`Undefined app name!`);
  } else if (!/\d{1,}\.\d{1,}\.\d{1,}/.test(version)) {
    throw new Error(`Version is undefined or not in the right format!`);
  } else if (!/\w{2,}\.\w{2,}/.test(package)) {
    throw new Error(`Package name is undefined or not in the right format!`);
  }

  const app = ipa || apk;

  if (typeof app !== 'string' || !/(\.apk)|(\.ipa)$/.test(app)) {
    throw new Error(`Could not detect the app file type.`);
  }

  if (/\.ipa$/.test(app)) {
    return await createOTADistributionServer({
      name,
      version,
      package,
      ipa: app
    });
  } else if (/\.apk$/.test(app)) {
    throw new Error(`Support for .apk files not yet supported.`);
  }
}

async function createServer({ ipa, manifest }) {
  console.log(`Creating express server…`);
  const port = OTA_SERVER_PORT;
  const server = express();
  server
    .get('/', (req, res) => res.end(fs.readFileSync(manifest)))
    .get('/ipa', (req, res) => res.end(fs.readFileSync(ipa)))
    .listen(port, () => {
      console.log(`Express server booted on ${port}`);
    });
  return server;
};

async function createOTADistributionServer({ name, version, package, ipa }) {
  const tmp = createTempDir();
  const proxyDomain = await startProxyServer();
  const manifestPath = await touchManifest({
    name,
    version,
    package,
    ipa: `${proxyDomain}/ipa`,
    tmp,
  });
  const server = await createServer({ ipa, manifest: manifestPath });
  const itms = ITMS_MANIFEST_URL.replace(/\$\{DOMAIN\}/, proxyDomain);
  displayDownloadQRCode(itms);
}

function createTempDir() {
  const tmp = path.join(TEMP_DIR, Date.now().toString());
  fs.ensureDirSync(tmp);
  return tmp;
};

async function touchManifest({ name, version, package, ipa, tmp }) {
  console.log(`Touching manifest plist file…`);
  const manifestPath = path.join(tmp, 'manifest.plist');
  const manifestContent = fs.readFileSync(DEFAULT_OTA_MANIFEST_PATH)
    .toString()
    .replace(/\$\{IPA_URL\}/, ipa)
    .replace(/\$\{APP_BUNDLE_IDENTIFIER\}/, package)
    .replace(/\$\{APP_BUNDLE_VERSION\}/, version)
    .replace(/\$\{APP_TITLE\}/, name);
  await fs.writeFileSync(manifestPath, manifestContent);
  return manifestPath;
}

async function startProxyServer() {
  console.log(`Starting https server…`);
  const proxyDomain = await ngrok.connect(OTA_SERVER_PORT);
  console.log(`ngrok proxy: ${proxyDomain}`);
  return proxyDomain;
}

function displayDownloadQRCode(url) {
  console.log(url);
  qrcode.generate(url, { small: true });
}

module.exports = ota;