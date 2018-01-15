'use strict';
const postBuild = require('./lib/de-dupe-engine-vendor').postBuild;

module.exports = {
  name: 'ember-cli-lazy-loading-engine-vendor-deduper',
  postBuild,
};
