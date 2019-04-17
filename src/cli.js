#!/usr/bin/env node
const args  = require('yargs').argv;
const chalk = require('chalk');
const ota   = require('../');

const payload = {
  ipa: args.ipa,
  apk: args.apk,
  name: args.app_name,
  version: args.app_version,
  package: args.package_name
};

ota(payload)
.catch(exception => {
  displayErrorMessage(exception);
  process.exit(exception);
});

function displayErrorMessage(message) {
  console.log(chalk.red(message));
}