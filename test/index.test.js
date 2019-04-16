const ota = require('../src');
const path = require('path');
const env = require('dotenv').config().parsed;

ota({
  name:     env.APP_NAME,
  version:  env.APP_VERSION,
  package:  env.PACKAGE_NAME,
  ipa:      path.resolve('./test/ipa/app.ipa'),
});